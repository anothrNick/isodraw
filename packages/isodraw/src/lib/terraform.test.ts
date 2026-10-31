import { afterEach, describe, expect, it, vi } from 'vitest';
import { containerOf } from './containers';
import { importTerraform, isTerraformJson, terraformToDiagram } from './terraform';
import type { Diagram, DiagramNode, IconLibrary } from './types';
import shopState from '../demo/terraform/shop.tfstate.json';

const byId = (d: Diagram, id: string) => d.nodes.find((n) => n.id === id)!;
const parentOf = (d: Diagram, id: string) => containerOf(byId(d, id), d.nodes)?.id;
const links = (d: Diagram) => d.edges.map((e) => `${e.from} → ${e.to}`).sort();

/** No two items in the same area may overlap. */
function expectNoOverlaps(d: Diagram) {
  const groups = new Map<string | undefined, DiagramNode[]>();
  for (const n of d.nodes) {
    const p = containerOf(n, d.nodes)?.id;
    groups.set(p, [...(groups.get(p) ?? []), n]);
  }
  for (const items of groups.values()) {
    for (const a of items)
      for (const b of items) {
        if (a === b) continue;
        const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.d <= b.y || b.y + b.d <= a.y;
        expect(apart, `${a.id} overlaps ${b.id}`).toBe(true);
      }
  }
}

describe('isTerraformJson', () => {
  it('recognizes state files, show -json state and plans', () => {
    expect(isTerraformJson(shopState)).toBe(true);
    expect(isTerraformJson({ format_version: '1.0', terraform_version: '1.9.0', values: { root_module: {} } })).toBe(true);
    expect(isTerraformJson({ format_version: '1.2', planned_values: { root_module: {} } })).toBe(true);
  });

  it('rejects IsoDraw diagrams and other JSON', () => {
    expect(isTerraformJson({ version: 1, nodes: [], edges: [] })).toBe(false);
    expect(isTerraformJson([])).toBe(false);
    expect(isTerraformJson(null)).toBe(false);
  });

  it('explains what went wrong', () => {
    expect(() => terraformToDiagram({ nodes: [] })).toThrow(/Not a Terraform state or plan/);
    expect(() => terraformToDiagram({ version: 4, resources: [] })).toThrow(/No managed resources/);
    expect(() =>
      terraformToDiagram({ version: 4, resources: [{ mode: 'managed', type: 'random_id', name: 'x', instances: [{ attributes: { id: 'abc' } }] }] }),
    ).toThrow(/none that are drawn/);
  });
});

describe('AWS state file (the demo sample)', () => {
  const { diagram: d, summary } = terraformToDiagram(shopState);

  it('draws components, not supporting resources', () => {
    expect(summary).toMatchObject({ source: 'state file', terraformVersion: '1.9.8', resources: 49, components: 17, areas: 3 });
    expect(d.nodes.some((n) => n.id.startsWith('aws_iam_role'))).toBe(false);
    expect(summary.hidden).toMatchObject({ aws_security_group: 4, aws_iam_role: 3, aws_lb_listener: 1, aws_ecs_task_definition: 1 });
    expect(summary.unrecognized).toEqual([]);
  });

  it('infers the request and event flow', () => {
    expect(links(d)).toEqual(
      [
        'aws_route53_zone.main → aws_cloudfront_distribution.cdn', // alias record
        'aws_cloudfront_distribution.cdn → aws_s3_bucket.assets', // origin
        'aws_cloudfront_distribution.cdn → aws_lb.web',
        'aws_cloudfront_distribution.cdn → aws_wafv2_web_acl.edge',
        'aws_lb.web → aws_ecs_service.api', // listener → target group → service
        'aws_ecs_service.api → aws_db_instance.main', // task definition environment
        'aws_ecs_service.api → aws_elasticache_replication_group.cache',
        'aws_ecs_service.api → aws_sns_topic.order_events',
        'aws_ecs_service.api → aws_secretsmanager_secret.db',
        'aws_ecs_service.api → aws_ecr_repository.api',
        'aws_sns_topic.order_events → aws_sqs_queue.orders', // subscription
        'aws_sqs_queue.orders → aws_lambda_function.fulfil', // event source mapping
        'aws_sqs_queue.orders → aws_sqs_queue.orders_dlq', // redrive policy
        'aws_lambda_function.fulfil → aws_dynamodb_table.receipts', // environment variable
      ].sort(),
    );
  });

  it('explains each connection', () => {
    const e = d.edges.find((x) => x.from === 'aws_lb.web')!;
    expect(e.doc).toContain('via `aws_lb_listener.https`');
  });

  it('nests components in their VPC and subnets', () => {
    expect(parentOf(d, 'aws_subnet.public-0')).toBe('aws_vpc.main');
    expect(parentOf(d, 'aws_subnet.private-0')).toBe('aws_vpc.main');
    expect(parentOf(d, 'aws_nat_gateway.main')).toBe('aws_subnet.public-0');
    expect(parentOf(d, 'aws_lb.web')).toBe('aws_subnet.public-0');
    expect(parentOf(d, 'aws_ecs_service.api')).toBe('aws_subnet.private-0');
    expect(parentOf(d, 'aws_db_instance.main')).toBe('aws_subnet.private-0'); // through its DB subnet group
    expect(parentOf(d, 'aws_internet_gateway.main')).toBe('aws_vpc.main');
    expect(parentOf(d, 'aws_lambda_function.fulfil')).toBeUndefined();
    // Empty subnets are left out.
    expect(d.nodes.some((n) => n.id === 'aws_subnet.private-1')).toBe(false);
  });

  it('lays things out without overlaps, flowing left to right', () => {
    expectNoOverlaps(d);
    const x = (id: string) => byId(d, id).x;
    expect(x('aws_route53_zone.main')).toBeLessThan(x('aws_cloudfront_distribution.cdn'));
    expect(x('aws_cloudfront_distribution.cdn')).toBeLessThan(x('aws_lb.web'));
    expect(x('aws_lb.web')).toBeLessThan(x('aws_ecs_service.api'));
    expect(x('aws_sqs_queue.orders')).toBeLessThan(x('aws_lambda_function.fulfil'));
  });

  it('uses AWS icons and readable labels', () => {
    expect(byId(d, 'aws_lambda_function.fulfil')).toMatchObject({
      kind: 'image',
      label: 'shop-fulfil',
      src: expect.stringMatching(/aws-icons@[\d.]+\/icons\/architecture-service\/AWSLambda\.svg$/),
    });
    expect(byId(d, 'aws_ecs_service.api').src).toMatch(/AWSFargate\.svg$/);
    expect(byId(d, 'aws_lb.web').src).toMatch(/ApplicationLoadBalancer\.svg$/);
    expect(byId(d, 'aws_vpc.main').label).toBe('shop-vpc 10.0.0.0/16');
    expect(byId(d, 'aws_secretsmanager_secret.db').label).toBe('shop/db');
  });

  it('writes starter docs from safe settings only', () => {
    const db = byId(d, 'aws_db_instance.main').doc!;
    expect(db).toMatch(/^RDS database, managed by Terraform as `aws_db_instance.main`\. Spans shop-private-a, shop-private-b\./);
    expect(db).toContain('| engine_version | `16.3` |');
    expect(db).toContain('| multi_az | `true` |');
    expect(JSON.stringify(d)).not.toContain('example-not-a-real-password');
    expect(JSON.stringify(d)).not.toContain('username');
    expect(d.doc).toContain('49 resources, drawn as 17 components');
    expect(d.doc).toContain('| `aws_security_group` | 4 |');
  });
});

describe('GCP plan with modules', () => {
  // `terraform show -json plan.out`: values that aren't known yet are missing,
  // so connections come from the configuration's references.
  const r = (address: string, values: Record<string, unknown> = {}) => {
    const [type, name] = address.split('.').slice(-2);
    return { address, mode: 'managed', type, name: name.replace(/\[.*/, ''), values };
  };
  const plan = {
    format_version: '1.2',
    terraform_version: '1.8.0',
    planned_values: {
      root_module: {
        resources: [
          r('google_compute_network.main', { name: 'shop' }),
          r('google_vpc_access_connector.conn', { name: 'shop-conn' }),
          r('google_cloud_run_v2_service.api', { name: 'shop-api', location: 'europe-west1' }),
          r('google_sql_database_instance.db', { name: 'shop-db', database_version: 'POSTGRES_16' }),
          r('google_pubsub_topic.events', { name: 'shop-events' }),
          r('google_pubsub_subscription.push', { name: 'shop-events-push' }),
          r('google_cloudfunctions2_function.worker', { name: 'shop-worker' }),
          { ...r('google_storage_bucket.media[0]', { name: 'shop-media-eu' }), index: 0 },
          { ...r('google_storage_bucket.media[1]', { name: 'shop-media-us' }), index: 1 },
          r('google_compute_global_forwarding_rule.lb', { name: 'shop-lb' }),
          r('google_compute_target_https_proxy.lb'),
          r('google_compute_url_map.lb'),
          r('google_compute_backend_service.api'),
          r('google_compute_region_network_endpoint_group.api'),
          r('google_project_iam_member.worker'),
        ],
        child_modules: [{ address: 'module.net', resources: [r('module.net.google_compute_subnetwork.app', { name: 'shop-app', ip_cidr_range: '10.8.0.0/24' })] }],
      },
    },
    configuration: {
      root_module: {
        resources: [
          { address: 'google_compute_network.main', mode: 'managed', type: 'google_compute_network', name: 'main', expressions: {} },
          {
            address: 'google_vpc_access_connector.conn',
            mode: 'managed',
            expressions: { subnet: [{ name: { references: ['module.net.subnet_name', 'module.net'] } }] },
          },
          {
            address: 'google_cloud_run_v2_service.api',
            mode: 'managed',
            expressions: {
              template: [
                {
                  vpc_access: [{ connector: { references: ['google_vpc_access_connector.conn.id', 'google_vpc_access_connector.conn'] } }],
                  containers: [{ env: [{ value: { references: ['google_sql_database_instance.db.connection_name', 'google_sql_database_instance.db'] } }] }],
                },
              ],
            },
          },
          { address: 'google_sql_database_instance.db', mode: 'managed', expressions: { name: { constant_value: 'shop-db' } } },
          { address: 'google_pubsub_topic.events', mode: 'managed', expressions: {} },
          {
            address: 'google_pubsub_subscription.push',
            mode: 'managed',
            expressions: {
              topic: { references: ['google_pubsub_topic.events.id', 'google_pubsub_topic.events'] },
              push_config: [{ push_endpoint: { references: ['google_cloud_run_v2_service.api.uri', 'google_cloud_run_v2_service.api'] } }],
            },
          },
          {
            address: 'google_cloudfunctions2_function.worker',
            mode: 'managed',
            expressions: {
              event_trigger: [{ pubsub_topic: { references: ['google_pubsub_topic.events.id', 'google_pubsub_topic.events'] } }],
              service_config: [{ environment_variables: { references: ['google_storage_bucket.media[0].name', 'google_storage_bucket.media'] } }],
            },
          },
          { address: 'google_storage_bucket.media', mode: 'managed', expressions: {} },
          { address: 'google_compute_global_forwarding_rule.lb', mode: 'managed', expressions: { target: { references: ['google_compute_target_https_proxy.lb.id'] } } },
          { address: 'google_compute_target_https_proxy.lb', mode: 'managed', expressions: { url_map: { references: ['google_compute_url_map.lb.id'] } } },
          { address: 'google_compute_url_map.lb', mode: 'managed', expressions: { default_service: { references: ['google_compute_backend_service.api.id'] } } },
          {
            address: 'google_compute_backend_service.api',
            mode: 'managed',
            expressions: { backend: [{ group: { references: ['google_compute_region_network_endpoint_group.api.id'] } }] },
          },
          {
            address: 'google_compute_region_network_endpoint_group.api',
            mode: 'managed',
            expressions: { cloud_run: [{ service: { references: ['google_cloud_run_v2_service.api.name'] } }] },
          },
          {
            address: 'google_project_iam_member.worker',
            mode: 'managed',
            expressions: { member: { references: ['google_cloudfunctions2_function.worker.service_config'] } },
          },
        ],
        module_calls: {
          net: {
            source: './modules/net',
            expressions: { network: { references: ['google_compute_network.main.id', 'google_compute_network.main'] } },
            module: {
              resources: [
                {
                  address: 'google_compute_subnetwork.app',
                  mode: 'managed',
                  expressions: { network: { references: ['var.network'] } },
                },
              ],
              outputs: { subnet_name: { expression: { references: ['google_compute_subnetwork.app.name', 'google_compute_subnetwork.app'] } } },
            },
          },
        },
      },
    },
  };

  const gcpIcons: IconLibrary = {
    id: 'gcp',
    name: 'GCP',
    icons: ['pubsub', 'cloud-functions', 'cloud-load-balancing'].map((k) => ({ id: `gcp:product/${k}`, name: k, src: `data:image/svg+xml,${k}` })),
  };
  const { diagram: d, summary } = terraformToDiagram(plan, { gcpIcons });

  it('reads planned resources, including counted ones', () => {
    expect(summary).toMatchObject({ source: 'plan', components: 7, areas: 2 });
    expect(d.nodes.map((n) => n.label)).toEqual(expect.arrayContaining(['shop-media-eu', 'shop-media-us']));
  });

  it('follows references through module inputs, outputs and load balancer parts', () => {
    expect(links(d)).toEqual(
      [
        'google_cloud_run_v2_service.api → google_sql_database_instance.db',
        'google_pubsub_topic.events → google_cloud_run_v2_service.api', // push subscription
        'google_pubsub_topic.events → google_cloudfunctions2_function.worker', // event trigger, reversed
        'google_cloudfunctions2_function.worker → google_storage_bucket.media-0',
        'google_cloudfunctions2_function.worker → google_storage_bucket.media-1',
        'google_compute_global_forwarding_rule.lb → google_cloud_run_v2_service.api', // proxy → URL map → backend → NEG
      ].sort(),
    );
  });

  it('places Cloud Run in the subnet its VPC connector uses', () => {
    expect(parentOf(d, 'module.net.google_compute_subnetwork.app')).toBe('google_compute_network.main');
    expect(parentOf(d, 'google_cloud_run_v2_service.api')).toBe('module.net.google_compute_subnetwork.app');
    expectNoOverlaps(d);
  });

  it('uses core icons by URL and product icons from the loaded library', () => {
    expect(byId(d, 'google_cloud_run_v2_service.api').src).toMatch(/gcp-icons@[\d.]+\/dist\/icons\/cloudrun-512-color-rgb\.svg$/);
    expect(byId(d, 'google_pubsub_topic.events').src).toBe('data:image/svg+xml,pubsub');
  });

  it('falls back to blocks without the GCP library', () => {
    const plain = terraformToDiagram(plan).diagram;
    expect(byId(plain, 'google_pubsub_topic.events')).toMatchObject({ kind: 'block', label: 'shop-events' });
    expect(byId(plain, 'google_cloud_run_v2_service.api').kind).toBe('image');
  });

  describe('importTerraform', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('loads the GCP library when it needs it', async () => {
      const fetch = vi.fn(async (url: string) =>
        url.endsWith('icons.json')
          ? new Response(JSON.stringify({ width: 24, height: 24, icons: { pubsub: { body: '<path/>' } } }))
          : new Response('[]'),
      );
      vi.stubGlobal('fetch', fetch);
      const { diagram } = await importTerraform(plan);
      expect(byId(diagram, 'google_pubsub_topic.events').src).toMatch(/^data:image\/svg\+xml,/);
      expect(fetch).toHaveBeenCalled();
    });

    it('still imports when the library cannot load', async () => {
      vi.stubGlobal('fetch', vi.fn(async () => new Response('down', { status: 503 })));
      const { diagram } = await importTerraform(plan);
      expect(byId(diagram, 'google_pubsub_topic.events').kind).toBe('block');
    });

    it('does not fetch anything for AWS', async () => {
      const fetch = vi.fn();
      vi.stubGlobal('fetch', fetch);
      await importTerraform(shopState);
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});

describe('Azure show -json state', () => {
  const sub = '/subscriptions/0000-1111/resourceGroups/rg-shop';
  const vnet = `${sub}/providers/Microsoft.Network/virtualNetworks/vnet-shop`;
  const resource = (address: string, values: Record<string, unknown>, sensitive_values: Record<string, unknown> = {}) => {
    const [type, name] = address.split('.');
    return { address, mode: 'managed', type, name, values, sensitive_values };
  };
  const state = {
    format_version: '1.0',
    terraform_version: '1.9.2',
    values: {
      root_module: {
        resources: [
          resource('azurerm_resource_group.main', { id: sub, name: 'rg-shop', location: 'westeurope' }),
          resource('azurerm_virtual_network.main', { id: vnet, name: 'vnet-shop', resource_group_name: 'rg-shop', address_space: ['10.20.0.0/16'] }),
          resource('azurerm_subnet.app', { id: `${vnet}/subnets/app`, name: 'app', resource_group_name: 'rg-shop', virtual_network_name: 'vnet-shop', address_prefixes: ['10.20.1.0/24'] }),
          resource('azurerm_subnet.db', { id: `${vnet}/subnets/db`, name: 'db', resource_group_name: 'rg-shop', virtual_network_name: 'vnet-shop', address_prefixes: ['10.20.2.0/24'] }),
          resource('azurerm_service_plan.main', { id: `${sub}/providers/Microsoft.Web/serverFarms/plan-shop`, name: 'plan-shop', sku_name: 'P1v3' }),
          resource(
            'azurerm_linux_web_app.api',
            {
              id: `${sub}/providers/Microsoft.Web/sites/app-shop-api`,
              name: 'app-shop-api',
              resource_group_name: 'rg-shop',
              service_plan_id: `${sub}/providers/Microsoft.Web/serverFarms/plan-shop`,
              virtual_network_subnet_id: `${vnet}/subnets/app`,
              default_hostname: 'app-shop-api.azurewebsites.net',
              app_settings: {
                DB_HOST: 'psql-shop.postgres.database.azure.com',
                VAULT: 'https://kv-shop.vault.azure.net/',
                MEDIA: 'https://stshopmedia.blob.core.windows.net/',
              },
            },
            { app_settings: true },
          ),
          resource('azurerm_postgresql_flexible_server.main', {
            id: `${sub}/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-shop`,
            name: 'psql-shop',
            resource_group_name: 'rg-shop',
            delegated_subnet_id: `${vnet}/subnets/db`,
            fqdn: 'psql-shop.postgres.database.azure.com',
            version: '16',
            sku_name: 'GP_Standard_D2s_v3',
            administrator_password: 'example-not-a-real-password',
          }),
          resource('azurerm_key_vault.main', {
            id: `${sub}/providers/Microsoft.KeyVault/vaults/kv-shop`,
            name: 'kv-shop',
            resource_group_name: 'rg-shop',
            vault_uri: 'https://kv-shop.vault.azure.net/',
            sku_name: 'standard',
          }),
          resource('azurerm_storage_account.media', {
            id: `${sub}/providers/Microsoft.Storage/storageAccounts/stshopmedia`,
            name: 'stshopmedia',
            resource_group_name: 'rg-shop',
            primary_blob_endpoint: 'https://stshopmedia.blob.core.windows.net/',
            account_tier: 'Standard',
            primary_access_key: 'example-not-a-real-key',
          }),
          resource('azurerm_role_assignment.api_kv', { id: `${sub}/providers/Microsoft.Authorization/roleAssignments/1`, scope: `${sub}/providers/Microsoft.KeyVault/vaults/kv-shop` }),
        ],
      },
    },
  };
  const { diagram: d, summary } = terraformToDiagram(state);

  it('nests the resource group, virtual network and subnets', () => {
    expect(summary).toMatchObject({ source: 'state', components: 4, areas: 4 });
    expect(parentOf(d, 'azurerm_virtual_network.main')).toBe('azurerm_resource_group.main');
    expect(parentOf(d, 'azurerm_subnet.app')).toBe('azurerm_virtual_network.main');
    expect(parentOf(d, 'azurerm_linux_web_app.api')).toBe('azurerm_subnet.app');
    expect(parentOf(d, 'azurerm_postgresql_flexible_server.main')).toBe('azurerm_subnet.db');
    expect(parentOf(d, 'azurerm_key_vault.main')).toBe('azurerm_resource_group.main');
    expect(byId(d, 'azurerm_virtual_network.main').label).toBe('vnet-shop 10.20.0.0/16');
    expectNoOverlaps(d);
  });

  it('connects the app to what its settings point at', () => {
    expect(links(d)).toEqual(
      [
        'azurerm_linux_web_app.api → azurerm_key_vault.main',
        'azurerm_linux_web_app.api → azurerm_postgresql_flexible_server.main',
        'azurerm_linux_web_app.api → azurerm_storage_account.media',
      ].sort(),
    );
  });

  it('keeps secrets out of the docs', () => {
    const json = JSON.stringify(d);
    expect(json).not.toContain('example-not-a-real');
    expect(byId(d, 'azurerm_postgresql_flexible_server.main').doc).toContain('| sku_name | `GP_Standard_D2s_v3` |');
    expect(byId(d, 'azurerm_linux_web_app.api').src).toMatch(/pack-azure@[\d.]+\/icons\/app-services\.svg$/);
  });
});

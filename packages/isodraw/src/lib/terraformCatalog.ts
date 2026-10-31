/**
 * How each Terraform resource type appears in an imported diagram.
 *
 * - `node`: a component, drawn with a cloud icon.
 * - `area`: a network boundary (VPC, subnet, resource group…); `level` orders
 *   nesting, outermost first.
 * - `glue`: not drawn, but implies a connection from whatever its `from`
 *   attributes point at to whatever its `to` attributes point at (`self` means
 *   the glue resource itself, so other glue can chain through it).
 * - `via`: not drawn; connections pass through it (target groups, URL maps…).
 *   With `reverseIncoming`, components that point at it are fed by it instead.
 * - `merge`: not drawn; its references count as references of the components
 *   that use it (an ECS task definition's environment belongs to its service).
 * - `hide`: not drawn and ignored, except for placing things in areas.
 *
 * Types not listed become a plain block unless they match `SUPPORTING`.
 */

export type CatalogEntry =
  | { role: 'node'; what: string; icon: string | ((v: Record<string, unknown>) => string) }
  | { role: 'area'; what: string; level: number; color: string; opacity: number; dashed?: boolean }
  | { role: 'glue'; from: string[]; to: string[] }
  | { role: 'via'; reverseIncoming?: boolean }
  | { role: 'merge' }
  | { role: 'hide' };

const node = (what: string, icon: string | ((v: Record<string, unknown>) => string)): CatalogEntry => ({ role: 'node', what, icon });
const glue = (from: string[], to: string[]): CatalogEntry => ({ role: 'glue', from, to });
const VIA: CatalogEntry = { role: 'via' };
const MERGE: CatalogEntry = { role: 'merge' };
const HIDE: CatalogEntry = { role: 'hide' };

const AWS_SVC = (f: string) => `aws:architecture-service/${f}`;
const AWS_RES = (f: string) => `aws:resource/${f}`;

export const CATALOG: Record<string, CatalogEntry> = {
  // ---------------------------------------------------------------- AWS
  aws_vpc: { role: 'area', what: 'VPC', level: 0, color: '#8c4fff', opacity: 0.08, dashed: true },
  aws_subnet: { role: 'area', what: 'Subnet', level: 1, color: '#4f8cf7', opacity: 0.14 },

  aws_instance: node('EC2 instance', AWS_SVC('AmazonEC2')),
  aws_autoscaling_group: node('EC2 Auto Scaling group', AWS_SVC('AmazonEC2AutoScaling')),
  aws_lambda_function: node('Lambda function', AWS_SVC('AWSLambda')),
  aws_ecs_service: node('ECS service', (v) => (v.launch_type === 'FARGATE' ? AWS_SVC('AWSFargate') : AWS_RES('AmazonElasticContainerServiceService'))),
  aws_eks_cluster: node('EKS cluster', AWS_SVC('AmazonElasticKubernetesService')),
  aws_elastic_beanstalk_environment: node('Elastic Beanstalk environment', AWS_SVC('AWSElasticBeanstalk')),
  aws_batch_job_queue: node('Batch job queue', AWS_SVC('AWSBatch')),
  aws_db_instance: node('RDS database', AWS_SVC('AmazonRDS')),
  aws_rds_cluster: node('Aurora cluster', AWS_SVC('AmazonAurora')),
  aws_docdb_cluster: node('DocumentDB cluster', AWS_RES('AmazonDocumentDBElasticClusters')),
  aws_dynamodb_table: node('DynamoDB table', AWS_SVC('AmazonDynamoDB')),
  aws_elasticache_cluster: node('ElastiCache cluster', AWS_SVC('AmazonElastiCache')),
  aws_elasticache_replication_group: node('ElastiCache replication group', AWS_SVC('AmazonElastiCache')),
  aws_redshift_cluster: node('Redshift cluster', AWS_SVC('AmazonRedshift')),
  aws_opensearch_domain: node('OpenSearch domain', AWS_SVC('AmazonOpenSearchService')),
  aws_elasticsearch_domain: node('OpenSearch domain', AWS_SVC('AmazonOpenSearchService')),
  aws_s3_bucket: node('S3 bucket', AWS_SVC('AmazonSimpleStorageService')),
  aws_efs_file_system: node('EFS file system', AWS_RES('AmazonElasticFileSystemFileSystem')),
  aws_ecr_repository: node('ECR repository', AWS_SVC('AmazonElasticContainerRegistry')),
  aws_lb: node('Load balancer', (v) =>
    v.load_balancer_type === 'network'
      ? AWS_RES('ElasticLoadBalancingNetworkLoadBalancer')
      : v.load_balancer_type === 'gateway'
        ? AWS_RES('ElasticLoadBalancingGatewayLoadBalancer')
        : AWS_RES('ElasticLoadBalancingApplicationLoadBalancer'),
  ),
  aws_elb: node('Classic load balancer', AWS_RES('ElasticLoadBalancingClassicLoadBalancer')),
  aws_cloudfront_distribution: node('CloudFront distribution', AWS_SVC('AmazonCloudFront')),
  aws_api_gateway_rest_api: node('API Gateway REST API', AWS_SVC('AmazonAPIGateway')),
  aws_apigatewayv2_api: node('API Gateway HTTP API', AWS_SVC('AmazonAPIGateway')),
  aws_appsync_graphql_api: node('AppSync API', AWS_SVC('AWSAppSync')),
  aws_route53_zone: node('Route 53 hosted zone', AWS_RES('AmazonRoute53HostedZone')),
  aws_nat_gateway: node('NAT gateway', AWS_RES('AmazonVPCNATGateway')),
  aws_internet_gateway: node('Internet gateway', AWS_RES('AmazonVPCInternetGateway')),
  aws_sqs_queue: node('SQS queue', AWS_SVC('AmazonSimpleQueueService')),
  aws_sns_topic: node('SNS topic', AWS_SVC('AmazonSimpleNotificationService')),
  aws_cloudwatch_event_bus: node('EventBridge event bus', AWS_SVC('AmazonEventBridge')),
  aws_cloudwatch_event_rule: node('EventBridge rule', AWS_RES('AmazonEventBridgeRule')),
  aws_scheduler_schedule: node('EventBridge schedule', AWS_RES('AmazonEventBridgeScheduler')),
  aws_kinesis_stream: node('Kinesis data stream', AWS_SVC('AmazonKinesisDataStreams')),
  aws_kinesis_firehose_delivery_stream: node('Data Firehose stream', AWS_SVC('AmazonDataFirehose')),
  aws_msk_cluster: node('MSK cluster', AWS_SVC('AmazonManagedStreamingforApacheKafka')),
  aws_sfn_state_machine: node('Step Functions state machine', AWS_SVC('AWSStepFunctions')),
  aws_glue_job: node('Glue job', AWS_SVC('AWSGlue')),
  aws_cognito_user_pool: node('Cognito user pool', AWS_SVC('AmazonCognito')),
  aws_secretsmanager_secret: node('Secrets Manager secret', AWS_SVC('AWSSecretsManager')),
  aws_wafv2_web_acl: node('WAF web ACL', AWS_SVC('AWSWAF')),

  aws_lambda_event_source_mapping: glue(['event_source_arn'], ['function_name']),
  aws_sns_topic_subscription: glue(['topic_arn'], ['endpoint']),
  aws_cloudwatch_event_target: glue(['rule'], ['arn']),
  aws_s3_bucket_notification: glue(['bucket'], ['lambda_function', 'queue', 'topic']),
  aws_lb_listener: glue(['load_balancer_arn'], ['self', 'default_action']),
  aws_alb_listener: glue(['load_balancer_arn'], ['self', 'default_action']),
  aws_lb_listener_rule: glue(['listener_arn'], ['action']),
  aws_lb_target_group_attachment: glue(['target_group_arn'], ['target_id']),
  aws_autoscaling_attachment: glue(['lb_target_group_arn', 'elb'], ['autoscaling_group_name']),
  aws_api_gateway_integration: glue(['rest_api_id'], ['uri']),
  aws_apigatewayv2_integration: glue(['api_id'], ['integration_uri']),
  aws_api_gateway_authorizer: glue(['rest_api_id'], ['provider_arns']),
  aws_apigatewayv2_authorizer: glue(['api_id'], ['jwt_configuration']),
  aws_wafv2_web_acl_association: glue(['web_acl_arn'], ['resource_arn']),
  aws_route53_record: glue(['zone_id'], ['alias', 'records']),
  aws_pipes_pipe: glue(['source'], ['target']),
  aws_lb_target_group: { role: 'via', reverseIncoming: true },
  aws_alb_target_group: { role: 'via', reverseIncoming: true },
  aws_ecs_task_definition: MERGE,
  aws_launch_template: MERGE,
  aws_ecs_cluster: HIDE,
  aws_eks_node_group: HIDE,
  aws_rds_cluster_instance: HIDE,
  aws_kms_key: HIDE,
  aws_lambda_layer_version: HIDE,
  aws_vpc_endpoint: HIDE,

  // ---------------------------------------------------------------- Google Cloud
  google_compute_network: { role: 'area', what: 'VPC network', level: 0, color: '#4285f4', opacity: 0.08, dashed: true },
  google_compute_subnetwork: { role: 'area', what: 'Subnet', level: 1, color: '#34a853', opacity: 0.14 },

  google_compute_instance: node('Compute Engine VM', 'gcp:core/computeengine-512-color-rgb'),
  google_compute_instance_group_manager: node('Managed instance group', 'gcp:core/computeengine-512-color-rgb'),
  google_compute_region_instance_group_manager: node('Managed instance group', 'gcp:core/computeengine-512-color-rgb'),
  google_cloud_run_service: node('Cloud Run service', 'gcp:core/cloudrun-512-color-rgb'),
  google_cloud_run_v2_service: node('Cloud Run service', 'gcp:core/cloudrun-512-color-rgb'),
  google_cloud_run_v2_job: node('Cloud Run job', 'gcp:core/cloudrun-512-color-rgb'),
  google_cloudfunctions_function: node('Cloud Function', 'gcp:product/cloud-functions'),
  google_cloudfunctions2_function: node('Cloud Function', 'gcp:product/cloud-functions'),
  google_app_engine_application: node('App Engine app', 'gcp:product/app-engine'),
  google_container_cluster: node('GKE cluster', 'gcp:core/gke-512-color'),
  google_sql_database_instance: node('Cloud SQL instance', 'gcp:core/cloudsql-512-color'),
  google_spanner_instance: node('Spanner instance', 'gcp:core/cloudspanner-512-color'),
  google_alloydb_cluster: node('AlloyDB cluster', 'gcp:core/alloydb-512-color'),
  google_bigtable_instance: node('Bigtable instance', 'gcp:product/bigtable'),
  google_firestore_database: node('Firestore database', 'gcp:product/firestore'),
  google_redis_instance: node('Memorystore for Redis', 'gcp:product/memorystore'),
  google_bigquery_dataset: node('BigQuery dataset', 'gcp:core/bigquery-512-color'),
  google_storage_bucket: node('Cloud Storage bucket', 'gcp:core/cloud-storage-512-color'),
  google_filestore_instance: node('Filestore instance', 'gcp:product/filestore'),
  google_artifact_registry_repository: node('Artifact Registry repository', 'gcp:product/artifact-registry'),
  google_pubsub_topic: node('Pub/Sub topic', 'gcp:product/pubsub'),
  google_cloud_tasks_queue: node('Cloud Tasks queue', 'gcp:product/cloud-tasks'),
  google_cloud_scheduler_job: node('Cloud Scheduler job', 'gcp:product/cloud-scheduler'),
  google_workflows_workflow: node('Workflow', 'gcp:product/workflows'),
  google_dataflow_job: node('Dataflow job', 'gcp:product/dataflow'),
  google_compute_global_forwarding_rule: node('Load balancer', 'gcp:product/cloud-load-balancing'),
  google_compute_forwarding_rule: node('Load balancer', 'gcp:product/cloud-load-balancing'),
  google_api_gateway_gateway: node('API Gateway', 'gcp:product/cloud-api-gateway'),
  google_compute_router_nat: node('Cloud NAT', 'gcp:product/cloud-nat'),
  google_dns_managed_zone: node('Cloud DNS zone', 'gcp:product/cloud-dns'),
  google_secret_manager_secret: node('Secret Manager secret', 'gcp:product/secret-manager'),
  google_vertex_ai_endpoint: node('Vertex AI endpoint', 'gcp:core/vertexai-512-color'),
  google_compute_security_policy: node('Cloud Armor policy', 'gcp:product/cloud-armor'),

  google_pubsub_subscription: glue(['topic'], ['push_config', 'bigquery_config', 'cloud_storage_config']),
  google_eventarc_trigger: glue(['transport', 'matching_criteria'], ['destination']),
  google_dns_record_set: glue(['managed_zone'], ['rrdatas']),
  google_compute_target_http_proxy: VIA,
  google_compute_target_https_proxy: VIA,
  google_compute_url_map: VIA,
  google_compute_backend_service: VIA,
  google_compute_region_backend_service: VIA,
  google_compute_backend_bucket: VIA,
  google_compute_region_network_endpoint_group: VIA,
  google_compute_global_network_endpoint_group: VIA,
  google_compute_instance_template: MERGE,
  google_compute_region_instance_template: MERGE,
  google_container_node_pool: HIDE,
  google_vpc_access_connector: HIDE,
  google_compute_router: HIDE,
  google_bigquery_table: HIDE,
  google_sql_database: HIDE,
  google_project_service: HIDE,

  // ---------------------------------------------------------------- Azure
  azurerm_resource_group: { role: 'area', what: 'Resource group', level: 0, color: '#0078d4', opacity: 0.05, dashed: true },
  azurerm_virtual_network: { role: 'area', what: 'Virtual network', level: 1, color: '#8c4fff', opacity: 0.08 },
  azurerm_subnet: { role: 'area', what: 'Subnet', level: 2, color: '#4f8cf7', opacity: 0.14 },

  azurerm_linux_virtual_machine: node('Virtual machine', 'azure:virtual-machine'),
  azurerm_windows_virtual_machine: node('Virtual machine', 'azure:virtual-machine'),
  azurerm_virtual_machine: node('Virtual machine', 'azure:virtual-machine'),
  azurerm_linux_virtual_machine_scale_set: node('VM scale set', 'azure:vm-scale-sets'),
  azurerm_windows_virtual_machine_scale_set: node('VM scale set', 'azure:vm-scale-sets'),
  azurerm_orchestrated_virtual_machine_scale_set: node('VM scale set', 'azure:vm-scale-sets'),
  azurerm_linux_web_app: node('App Service web app', 'azure:app-services'),
  azurerm_windows_web_app: node('App Service web app', 'azure:app-services'),
  azurerm_app_service: node('App Service web app', 'azure:app-services'),
  azurerm_linux_function_app: node('Function app', 'azure:function-apps'),
  azurerm_windows_function_app: node('Function app', 'azure:function-apps'),
  azurerm_function_app: node('Function app', 'azure:function-apps'),
  azurerm_container_app: node('Container app', 'azure:worker-container-app'),
  azurerm_container_group: node('Container instances', 'azure:container-instances'),
  azurerm_kubernetes_cluster: node('AKS cluster', 'azure:kubernetes-services'),
  azurerm_container_registry: node('Container registry', 'azure:container-registries'),
  azurerm_static_web_app: node('Static web app', 'azure:static-apps'),
  azurerm_storage_account: node('Storage account', 'azure:storage-accounts'),
  azurerm_mssql_server: node('Azure SQL server', 'azure:sql-server'),
  azurerm_mssql_database: node('Azure SQL database', 'azure:sql-database'),
  azurerm_postgresql_flexible_server: node('PostgreSQL server', 'azure:azure-database-postgresql-server'),
  azurerm_postgresql_server: node('PostgreSQL server', 'azure:azure-database-postgresql-server'),
  azurerm_mysql_flexible_server: node('MySQL server', 'azure:azure-database-mysql-server'),
  azurerm_cosmosdb_account: node('Cosmos DB account', 'azure:azure-cosmos-db'),
  azurerm_redis_cache: node('Azure Cache for Redis', 'azure:cache-redis'),
  azurerm_servicebus_namespace: node('Service Bus namespace', 'azure:azure-service-bus'),
  azurerm_eventhub_namespace: node('Event Hubs namespace', 'azure:event-hubs'),
  azurerm_eventgrid_topic: node('Event Grid topic', 'azure:event-grid-topics'),
  azurerm_eventgrid_system_topic: node('Event Grid system topic', 'azure:event-grid-topics'),
  azurerm_lb: node('Load balancer', 'azure:load-balancers'),
  azurerm_application_gateway: node('Application gateway', 'azure:application-gateways'),
  azurerm_cdn_frontdoor_profile: node('Front Door profile', 'azure:front-door-and-cdn-profiles'),
  azurerm_cdn_profile: node('CDN profile', 'azure:cdn-profiles'),
  azurerm_api_management: node('API Management', 'azure:api-management-services'),
  azurerm_key_vault: node('Key Vault', 'azure:key-vaults'),
  azurerm_log_analytics_workspace: node('Log Analytics workspace', 'azure:log-analytics-workspaces'),
  azurerm_application_insights: node('Application Insights', 'azure:application-insights'),
  azurerm_dns_zone: node('DNS zone', 'azure:dns-zones'),
  azurerm_logic_app_workflow: node('Logic app', 'azure:logic-apps'),
  azurerm_nat_gateway: node('NAT gateway', 'azure:nat'),
  azurerm_firewall: node('Firewall', 'azure:firewalls'),
  azurerm_data_factory: node('Data factory', 'azure:data-factories'),
  azurerm_databricks_workspace: node('Databricks workspace', 'azure:azure-databricks'),
  azurerm_cognitive_account: node('Azure AI services', (v) => (v.kind === 'OpenAI' ? 'azure:azure-openai' : 'azure:cognitive-services')),
  azurerm_search_service: node('AI Search service', 'azure:search'),
  azurerm_signalr_service: node('SignalR service', 'azure:signalr'),

  azurerm_eventgrid_event_subscription: glue(['scope'], ['webhook_endpoint', 'azure_function_endpoint', 'service_bus_queue_endpoint_id', 'storage_queue_endpoint']),
  azurerm_service_plan: HIDE,
  azurerm_app_service_plan: HIDE,
  azurerm_container_app_environment: HIDE,
  azurerm_network_interface: HIDE,
  azurerm_public_ip: HIDE,
  azurerm_kubernetes_cluster_node_pool: HIDE,
};

/** Supporting resources of unlisted types: not drawn, and only used for placement. */
const SUPPORTING =
  /_(iam|policy|policies|attachment|association|permission|rule|rules|route|routes|route_table|security_group|acl|role|roles|binding|member|assignment|version|alias|log_group|log_stream|key_pair|access_key|record|certificate|certificate_validation|parameter|parameter_group|option_group|subnet_group|eip|network_interface|service_account|project_service|api_key|stage|deployment|method|method_response|integration_response|model|resource|configuration|setting|settings|lifecycle|lifecycle_configuration|versioning|public_access_block|ownership_controls|server_side_encryption_configuration|cors_configuration|website_configuration|logging|notification|subscription|firewall_rule|diagnostic_setting|alarm|metric_alarm|dashboard|monitor|user|database|schema|table|index|container|blob|secret_version|key|identity|registration|propagation|peering|zone_association|lb_cookie_stickiness_policy|origin_access_control|origin_access_identity)(_|$)/;

/** Providers that never describe infrastructure worth drawing. */
const UTILITY = /^(random|null|time|tls|local|terraform|archive|external|http|template|cloudinit|kubernetes|helm|tfe|github)_/;

/** Terraform resource types drawn as components with an icon, with what they are. The CLI's --icon takes these. */
export function iconTypes(): { type: string; what: string; icon: string }[] {
  return Object.entries(CATALOG).flatMap(([type, e]) =>
    e.role === 'node' ? [{ type, what: e.what, icon: typeof e.icon === 'string' ? e.icon : e.icon({}) }] : [],
  );
}

export function catalogEntry(type: string): CatalogEntry {
  const known = CATALOG[type];
  if (known) return known;
  if (UTILITY.test(type) || SUPPORTING.test(type)) return HIDE;
  return { role: 'node', what: type, icon: '' };
}

/**
 * Settings shown in a component's starter doc. Only these keys are read, so
 * secrets in state (passwords, keys, connection strings) never reach a doc.
 */
export const DOC_SETTINGS = [
  'instance_type', 'instance_class', 'machine_type', 'node_type', 'sku', 'sku_name', 'size', 'tier', 'database_version',
  'engine', 'engine_version', 'version', 'kubernetes_version', 'runtime', 'handler', 'memory_size', 'timeout', 'architectures',
  'cpu', 'memory', 'launch_type', 'desired_count', 'min_size', 'max_size', 'desired_capacity', 'node_count',
  'allocated_storage', 'storage_type', 'multi_az', 'num_cache_nodes', 'num_cache_clusters', 'billing_mode', 'hash_key', 'range_key',
  'stream_enabled', 'fifo_queue', 'visibility_timeout_seconds', 'message_retention_seconds', 'shard_count', 'retention_period',
  'load_balancer_type', 'internal', 'scheme', 'protocol_type', 'price_class', 'cidr_block', 'address_prefixes', 'ip_cidr_range',
  'availability_zone', 'region', 'location', 'storage_class', 'account_tier', 'account_replication_type', 'kind', 'os_type',
  'deletion_protection', 'publicly_accessible',
];

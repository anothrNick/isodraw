import { afterEach, describe, expect, it, vi } from 'vitest';
import { humanizeIconName, loadAwsIconLibrary, loadAzureIconLibrary, loadGcpIconLibrary } from './icons';

/** Stub `fetch` with a JSON body per URL substring; anything else is a 404. */
function stubFetch(routes: Record<string, unknown>) {
  const fetch = vi.fn(async (url: string) => {
    const key = Object.keys(routes).find((k) => url.includes(k));
    if (key === undefined) return new Response('not found', { status: 404 });
    return new Response(JSON.stringify(routes[key]), { status: 200 });
  });
  vi.stubGlobal('fetch', fetch);
  return fetch;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('humanizeIconName', () => {
  it.each([
    ['AmazonEC2.svg', 'Amazon EC2'],
    ['AWSLambda.svg', 'AWS Lambda'],
    ['AmazonDynamoDB.svg', 'Amazon DynamoDB'],
    ['AmazonCloudFront.svg', 'Amazon CloudFront'],
    ['ElasticLoadBalancingApplicationLoadBalancer.svg', 'Elastic Load Balancing Application Load Balancer'],
  ])('%s → %s', (file, name) => {
    expect(humanizeIconName(file)).toBe(name);
  });
});

describe('loadAwsIconLibrary', () => {
  it('lists the chosen folders in order, with CDN URLs', async () => {
    stubFetch({
      'data.jsdelivr.com': {
        files: [
          { name: '/icons/resource/AmazonS3Bucket.svg' },
          { name: '/icons/architecture-service/AWSLambda.svg' },
          { name: '/icons/architecture-service/AmazonEC2.svg' },
          { name: '/icons/unused/Thing.svg' },
          { name: '/README.md' },
        ],
      },
    });
    const lib = await loadAwsIconLibrary({ version: '9.9.9' });
    expect(lib.id).toBe('aws');
    expect(lib.icons.map((i) => [i.name, i.category])).toEqual([
      ['Amazon EC2', 'Services'],
      ['AWS Lambda', 'Services'],
      ['Amazon S3Bucket', 'Resources'],
    ]);
    expect(lib.icons[1].src).toBe('https://cdn.jsdelivr.net/npm/aws-icons@9.9.9/icons/architecture-service/AWSLambda.svg');
  });

  it('fails when the listing cannot be fetched', async () => {
    stubFetch({});
    await expect(loadAwsIconLibrary()).rejects.toThrow(/Could not list AWS icons \(404\)/);
  });
});

describe('loadGcpIconLibrary', () => {
  const products = {
    width: 24,
    height: 24,
    icons: {
      'cloud-sql': { body: '<path d="M0 0"/>' },
      'vertex-ai': { body: '<path d="M1 1"/>', width: 32 },
    },
  };
  const core = [
    { key: 'bigquery-512-color', source: 'product' },
    { key: 'networking-512-color', source: 'category' },
    { key: 'newthing-512-color-rgb', source: 'product' },
  ];

  it('combines the core and product sets, named and grouped', async () => {
    stubFetch({ 'icons-gcp': products, 'icons-metadata.json': core });
    const lib = await loadGcpIconLibrary();
    expect(lib.icons.map((i) => [i.name, i.category])).toEqual([
      ['BigQuery', 'Core products'],
      ['Newthing', 'Core products'],
      ['Cloud SQL', 'Products'],
      ['Vertex AI', 'Products'],
      ['Networking', 'Categories'],
    ]);
  });

  it('turns Iconify icons into standalone SVG data URLs', async () => {
    stubFetch({ 'icons-gcp': products, 'icons-metadata.json': core });
    const lib = await loadGcpIconLibrary();
    const svg = decodeURIComponent(lib.icons.find((i) => i.name === 'Vertex AI')!.src.replace('data:image/svg+xml,', ''));
    expect(svg).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" width="128" height="96"><path d="M1 1"/></svg>');
  });

  it('still loads the products when the core set is unavailable', async () => {
    stubFetch({ 'icons-gcp': products });
    const lib = await loadGcpIconLibrary();
    expect(lib.icons.map((i) => i.name)).toEqual(['Cloud SQL', 'Vertex AI']);
  });

  it('fails when the product set cannot be fetched', async () => {
    stubFetch({ 'icons-metadata.json': core });
    await expect(loadGcpIconLibrary()).rejects.toThrow(/Could not load GCP icons/);
  });
});

describe('loadAzureIconLibrary', () => {
  it('sorts by category with the catch-all categories last', async () => {
    stubFetch({
      'pack.json': {
        icons: {
          a: { file: 'a.svg', title: 'Help', category: 'General' },
          b: { file: 'b.svg', title: 'Virtual Machine', category: 'Compute' },
          c: { file: 'c.svg', title: 'App Service', category: 'Compute' },
          d: { file: 'd.svg', title: 'Blob', category: 'Storage' },
        },
      },
    });
    const lib = await loadAzureIconLibrary();
    expect(lib.icons.map((i) => i.name)).toEqual(['App Service', 'Virtual Machine', 'Blob', 'Help']);
    expect(lib.icons[0]).toMatchObject({ id: 'azure:c', src: expect.stringMatching(/pack-azure@[\d.]+\/icons\/c\.svg$/) });
  });

  it('fails when the pack cannot be fetched', async () => {
    stubFetch({});
    await expect(loadAzureIconLibrary()).rejects.toThrow(/Could not load Azure icons/);
  });
});

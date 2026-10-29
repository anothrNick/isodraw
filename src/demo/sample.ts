import type { Diagram } from '../lib';

const CDN = 'https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/architecture-service';

/** A small three-tier AWS web app. */
export const sampleDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: 'title', kind: 'text', x: 0, y: -4, w: 16, d: 2, h: 0, z: 0, color: '#0f172a', text: 'Three-tier web app', fontSize: 1.1 },
    { id: 'vpc', kind: 'area', x: 4, y: -1, w: 17, d: 13, h: 0, z: 0, color: '#8c4fff', opacity: 0.08, dashed: true, label: 'VPC 10.0.0.0/16', labelColor: '#6d28d9' },
    { id: 'pub', kind: 'area', x: 5, y: 0, w: 4, d: 11, h: 0, z: 0, color: '#7aa116', opacity: 0.14, label: 'Public subnet' },
    { id: 'app', kind: 'area', x: 10, y: 0, w: 5, d: 11, h: 0, z: 0, color: '#4f8cf7', opacity: 0.14, label: 'App subnet' },
    { id: 'data', kind: 'area', x: 16, y: 0, w: 4, d: 11, h: 0, z: 0, color: '#ed7100', opacity: 0.14, label: 'Data subnet' },

    { id: 'users', kind: 'image', x: -4, y: 4, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'standing', src: 'https://cdn.jsdelivr.net/npm/aws-icons@3.3.0/icons/resource/Users.svg', label: 'Users' },
    { id: 'cf', kind: 'image', x: 0, y: 4, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'tile', src: `${CDN}/AmazonCloudFront.svg`, label: 'CloudFront' },
    { id: 's3', kind: 'image', x: 0, y: 8, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'tile', src: `${CDN}/AmazonSimpleStorageService.svg`, label: 'S3 assets' },
    { id: 'alb', kind: 'image', x: 6, y: 4, w: 2, d: 2, h: 0.35, z: 0, color: '#ffffff', imageStyle: 'tile', src: `${CDN}/ElasticLoadBalancing.svg`, label: 'ALB' },

    { id: 'ec2a', kind: 'block', x: 11, y: 1.5, w: 3, d: 2, h: 1.25, z: 0, color: '#ed7100', label: 'web-1' },
    { id: 'ec2b', kind: 'block', x: 11, y: 4.5, w: 3, d: 2, h: 1.25, z: 0, color: '#ed7100', label: 'web-2' },
    { id: 'ec2c', kind: 'block', x: 11, y: 7.5, w: 3, d: 2, h: 1.25, z: 0, color: '#ed7100', label: 'web-3' },

    { id: 'rds', kind: 'cylinder', x: 17, y: 2, w: 2, d: 2, h: 1.75, z: 0, color: '#3b48cc', label: 'RDS primary' },
    { id: 'rds2', kind: 'cylinder', x: 17, y: 6, w: 2, d: 2, h: 1.75, z: 0, color: '#6b77e5', label: 'RDS replica' },
    { id: 'cache', kind: 'hexagon', x: 17, y: 9, w: 2, d: 1.5, h: 0.75, z: 0, color: '#dd344c', label: 'ElastiCache' },
  ],
  edges: [
    { id: 'e1', from: 'users', to: 'cf', color: '#475569', width: 2, routing: 'curved', endMarker: 'arrow', label: 'HTTPS', animation: 'packets', animationDirection: 'both' },
    { id: 'e2', from: 'cf', to: 'alb', color: '#475569', width: 2, routing: 'orthogonal', rounded: true, endMarker: 'arrow', animation: 'flow' },
    { id: 'e3', from: 'cf', to: 's3', color: '#7aa116', width: 2, routing: 'orthogonal', rounded: true, lineStyle: 'dashed', endMarker: 'open' },
    { id: 'e4', from: 'alb', to: 'ec2a', color: '#475569', width: 2, routing: 'orthogonal', rounded: true, endMarker: 'arrow', animation: 'packets' },
    { id: 'e5', from: 'alb', to: 'ec2b', color: '#475569', width: 2, routing: 'orthogonal', rounded: true, endMarker: 'arrow', animation: 'packets' },
    { id: 'e6', from: 'alb', to: 'ec2c', color: '#475569', width: 2, routing: 'orthogonal', rounded: true, endMarker: 'arrow', animation: 'packets' },
    { id: 'e7', from: 'ec2b', to: 'rds', color: '#3b48cc', width: 2, routing: 'orthogonal', rounded: true, startMarker: 'circle', endMarker: 'arrow', animation: 'pulse' },
    { id: 'e8', from: 'rds', to: 'rds2', color: '#3b48cc', width: 2, routing: 'straight', lineStyle: 'dotted', endMarker: 'arrow', label: 'replication', animation: 'flow', animationSpeed: 0.5 },
    { id: 'e9', from: 'ec2c', to: 'cache', color: '#dd344c', width: 2, routing: 'orthogonal', rounded: true, startMarker: 'diamond', endMarker: 'arrow', animation: 'glow' },
  ],
};

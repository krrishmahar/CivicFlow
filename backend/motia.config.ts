import { defineConfig } from '@motiadev/core';
import endpointPlugin from '@motiadev/plugin-endpoint/plugin';
import logsPlugin from '@motiadev/plugin-logs/plugin';
import observabilityPlugin from '@motiadev/plugin-observability/plugin';
import statesPlugin from '@motiadev/plugin-states/plugin';
import bullmqPlugin from '@motiadev/plugin-bullmq/plugin';

export default defineConfig({
  plugins: [observabilityPlugin, statesPlugin, endpointPlugin, logsPlugin, bullmqPlugin],
  build: {
    external: [
      // native build helpers
      '@mapbox/node-pre-gyp',
      'node-pre-gyp',
      // optional deps pulled by node-pre-gyp
      'mock-aws-s3',
      'aws-sdk',
      'nock',
      // native crypto deps
      'bcrypt',
      'crypto-js',
    ],
    rollupOptions: {
      external: [
        '@mapbox/node-pre-gyp',
        'node-pre-gyp',
        'mock-aws-s3',
        'aws-sdk',
        'nock',
        'bcrypt',
        'crypto-js',
      ],
    },
    loader: {
      '.html': 'text',
    },
  },
});

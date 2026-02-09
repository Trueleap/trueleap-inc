/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  IMAGES_BUCKET: R2Bucket;
  GITHUB_TOKEN: string;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}

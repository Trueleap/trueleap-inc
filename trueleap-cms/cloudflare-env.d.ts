declare namespace Cloudflare {
  interface Env {
    R2: R2Bucket
    D1: D1Database
    ASSETS: Fetcher
    AI: Ai
  }
}
interface CloudflareEnv extends Cloudflare.Env {}

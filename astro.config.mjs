import { defineConfig } from 'astro/config';

// Override SITE_URL when moving to a custom domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://city-of-birds.khushal20210-t1kxhglw.workers.dev',
  output: 'static',
  devToolbar: { enabled: false },
});

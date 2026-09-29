/** @type {import('next').NextConfig} */
const nextConfig = {
  // PDF tools read their own data files at runtime, so load them straight from node_modules.
  serverExternalPackages: ['pdfkit', 'fontkit', 'svg-to-pdfkit'],
  // Printable files live outside /public so nobody can download them without paying.
  // This makes sure they are bundled with the download route when deployed.
  outputFileTracingIncludes: {
    '/api/download/[sessionId]/[fileId]': ['./private-files/**/*'],
    // The storybook PDF needs its fonts and the theme artwork at request time.
    '/party/[slug]/api/[...path]': ['./party-app/fonts/**/*', './public/party-app/*.js'],
    // The party apps' HTML pages, filled in per party at request time.
    '/party/[slug]/[page]': ['./party-app/templates/**/*', './party-app/photos/**/*', './party-app/slideshow/**/*'],
  },
};
// Stock items (party packs, decorations…) are hidden for now: send their old pages to the shop.
nextConfig.redirects = async () => [
  { source: '/products/:id', destination: '/products', permanent: false },
];
export default nextConfig;

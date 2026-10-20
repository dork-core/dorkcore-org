# Dork Core Website

React and Vite site for Dork Core, the open-source core software for Dorkcoin. The site focuses on the wallet, node software, source code, and downloads, with a branding-only header on desktop and mobile. The download center reads published releases and downloadable assets directly from the GitHub Releases API.

## Development

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
```

Deploy the project on Vercel using the Vite framework preset. The default build command is `npm run build` and the output directory is `dist`.

Vercel Web Analytics is integrated using `@vercel/analytics/react`. Enable Web Analytics in the Vercel project dashboard and deploy the site to start collecting page views.

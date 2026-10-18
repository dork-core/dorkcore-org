# Dork Core Website

React and Vite site for Dork Core, the open-source core software for Dorkcoin. The site focuses on the wallet, node software, source code, and downloads, with a branding-only header on desktop and mobile. The download center reads published releases and downloadable assets directly from the GitHub Releases API.

The hero links to [dorkcoin.org](https://dorkcoin.org) and hides its logo on mobile (760px and below). The page keeps the contribution callout, feature summary, and download center without separate about or inside sections.

Feature tiles use centered icons and single-line headings and descriptions, with four columns on desktop and two at 1000px and below, including mobile.

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

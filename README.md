<p align='center'>
<img src="https://raw.githubusercontent.com/the-dataface/figma-plugin-svelte-vite/master/.github/assets/logo.svg" height="100px" alt="Logo" />
</p>

<h1 align="center">
  Figma Coordinate
</h1>

<!-- Slogan -->
<p align="center">
   Extract coordinates from targeted Figma nodes.
</p>

<!-- Badges -->
<p align="center">

  <!-- Github Badges -->
  <img src="https://raw.githubusercontent.com/TheSpawnProject/TheSpawnLanguage/master/.github/assets/github-badge.png" height="20px" />

  <a href="https://github.com/the-dataface/figma-coordinate/commits/master">
    <img src="https://img.shields.io/github/last-commit/the-dataface/figma-coordinate" alt="Last commit"/>
  </a>

  <a href="https://github.com/the-dataface/figma-coordinate/issues">
    <img src="https://img.shields.io/github/issues/the-dataface/figma-coordinate" alt="Issues"/>
  </a>

</p>

A simple plugin for quickly targeting nodes and extracting key positional data (X, Y, width, height) for use in other applications. 

_Built using [The DataFace's Figma plugin template](https://github.com/the-dataface/figma-plugin-svelte-vite)_

## How-to

1. Prefix desired nodes with a uniform string (e.g. `COORDINATE.` or `#` or `@`).
2. Once the plugin is initialized, enter that string in the search box (the default is `COORDINATE`) and run the command.
3. The positional data will show up below in the plugin's UI as JSON. You can download the results directly using the download button in the top-right corner of the results box.

## File Structure

- src
  - src/common/ : Sources that are intended to be used both by plugin and ui logical sides.
  - src/plugin/ : Sources of the plugin logical side. Place everything that interracts with Figma here.
  - src/ui/ : Sources of the ui logical side, a classical Vite + Svelte source base.
- scripts
  - scripts/vite/ : Some custom vite plugins to assist inlining assets
- figma.manifest.ts - A module that exports Figma Plugin Manifest for the build scripts

## Getting started

1. Clone this repository
2. Install dependencies with `npm install`
3. In Figma, go to `Plugins` > `Development` > `New Plugin...` and follow the prompts
4. Copy the contents of `manifest.json` into the `figma.manifest.ts` file in this repository's root folder
5. Run `npm run dev`to build the plugin. This command will watch for changes and rebuild the plugin automatically, updating Figma's plugin instance with the changes.
6. To publish the plugin, run `npm run build` and upload the `/dist` folder to the Figma Developer Console

## Caveats

- Images must be either inlined SVGs or be small enough to be inlined as data URIs. Figma plugins are sandboxed and cannot load external resources, so assets must be inlined.

## Notes

- This boilerplate uses [Svelte](https://svelte.dev/) for the UI, [Vite](https://vitejs.dev/) for the build system, and [TypeScript](https://www.typescriptlang.org/) for type checking.
- The plugin is built to the `/dist` folder, which is ignored by Git. This folder is what you upload to the Figma Developer Console when publishing your plugin.

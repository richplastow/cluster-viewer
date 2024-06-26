# cluster-viewer

__Three.js + Vue 3 .glb viewer, with buttons to cluster objects by shape or color.__

- __Version:__ 1.0.1
- __Repo:__ <https://github.com/richplastow/cluster-viewer>
- __Homepage:__ <https://richplastow.com/cluster-viewer>

## Approach

- A bare-bones solution, with tidy code and a presentable UI
- Keep within the `npm init vue@latest` guardrails, for a 'standard' Vue 3 app
- The app is simple enough not to need a UI library or global state system
- Allows for slightly updated versions of the glTF models to be swapped in
- Heads toward a more general purpose app, which can deal with any glTF model

## Next steps

1. __Accessibility:__ Add aria-roles, and test and improve text-to-speech and
   keyboard access
2. __Internationalization:__ Currently UI text is hard coded in British English
3. __Tests and Documentation:__ More unit tests and end-to-end tests, and better
   [JSDoc](https://jsdoc.app/) documentation throughout (also, refactoring)
4. __Performance:__ In terms of bundle/chink size, Lighthouse TTI, animation FPS
5. __Orbit Controls:__ Limit how far the user can zoom, and provide a reset
6. __SEO:__ Add Open Graph metadata, for better searchability and social media
   previews - and then add a share button
7. __Offline Mode:__ for iOS's 'Add to Home Screen', maybe with a service worker
8. __Icons:__ A full set of icons and native theme, eg using
   [RealFaviconGenerator](https://realfavicongenerator.net)
9. __Error Handling:__ Show user-friendly error popups on unhandled exceptions,
   or [Sentry](https://sentry.io/) ...the usage analytics would be interesting
10. __Tidier Clusters:__ They should stack up in size-order, and all sit on the
    ground plane
11. __Model Upload:__ Let the user upload or link to any glTF file
12. __Settings Popup:__ For example, set language, theme and animation speed

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile, Minify and Serve Locally for Production

```sh
npm start
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test
# Runs the tests only on Chromium
npm run test -- --project=chromium
# And also just a specific file's tests
npm run test -- e2e/02-screenshots.spec.ts --project=chromium
# Runs the tests in debug mode
npm run test -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

<!-- 188,300,987 bytes (230.6 MB on disk) for 13,822 items -->
<!-- 193,381,429 bytes (231.2 MB on disk) for 13,904 items after `npm i @vueuse/core` -->
<!-- 194,472,829 bytes (232.3 MB on disk) for 13,904 items -->
<!-- 194,472,829 bytes (232.3 MB on disk) for 13,904 items -->

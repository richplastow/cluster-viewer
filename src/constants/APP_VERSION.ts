const { VITE_APP_VERSION } = import.meta.env

/** The app's version, parsed from package.json by vite.config.ts. */
const APP_VERSION = String(VITE_APP_VERSION) // already a string, but TS doesn't know that

export default APP_VERSION

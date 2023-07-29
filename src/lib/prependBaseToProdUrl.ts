/** Base public path when served in dev or prod, defined in vite.config.ts. */
const base = import.meta.env.BASE_URL // eg '/cluster-viewer/'

/** Prepends a path with the base public path, in production only. */
const prependBaseToProdUrl = (url: string) =>
  // @ts-ignore because __VUE_HMR_RUNTIME__ is only present during `npm run dev`
  typeof window.__VUE_HMR_RUNTIME__ === 'object' ? url : `${base}${url}`

export default prependBaseToProdUrl

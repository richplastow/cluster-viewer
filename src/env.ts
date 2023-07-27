/** Environmental variables which Vue components need access to. */

/** Used by vite.config.ts, and also when loading glTF models. */
export const base = '/cluster-viewer/'

/** Prepends a path with `base`, in production only. */
export const fixUrlForProd = (url: string) =>
  // @ts-ignore (__VUE_HMR_RUNTIME__ is only present during `npm run dev`)
  typeof window.__VUE_HMR_RUNTIME__ === 'object' ? url : `${base}${url}`

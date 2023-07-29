// `BASE_URL` is the Base public path when served in dev or prod, defined in
// vite.config.ts, eg '/cluster-viewer/'.
// `PROD` is true in a production build.
const { BASE_URL, PROD } = import.meta.env

/** Prepends a path with the base public path, in production only. */
const prependBaseToProdUrl = (url: string) => `${PROD ? BASE_URL : ''}${url}`

export default prependBaseToProdUrl

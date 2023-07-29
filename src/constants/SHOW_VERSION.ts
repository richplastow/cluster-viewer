const { VITE_SHOW_VERSION } = import.meta.env

/** A setting from the .env file (overridden by .env.development), which
 *  determines whether the AppVersion component should be displayed. */
const SHOW_VERSION = VITE_SHOW_VERSION.toLowerCase() === 'true'

export default SHOW_VERSION

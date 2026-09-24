/** Resolve public assets for either a root deployment or GitHub Pages project path. */
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

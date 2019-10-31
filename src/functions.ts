export function pathToTemplate(path: string) {
  return path.replace(/\:([^\/]+)/g, "{$1}")
}
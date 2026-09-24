import { cp, mkdir, readdir, rename, rm } from 'node:fs/promises'
// Vite builds the existing app unchanged; arrange it for the Sites Worker runtime.
await mkdir('dist/client', { recursive: true })
for (const entry of await readdir('dist')) {
  if (entry === 'client') continue
  await rename(`dist/${entry}`, `dist/client/${entry}`)
}
await rm('dist/client/watch', { recursive: true, force: true })
await rm('dist/client/logo-options', { recursive: true, force: true })
await mkdir('dist/server', { recursive: true })
await cp('worker/index.js', 'dist/server/index.js')
await mkdir('dist/.openai', { recursive: true })
await cp('.openai/hosting.json', 'dist/.openai/hosting.json')
await cp('drizzle', 'dist/.openai/drizzle', { recursive: true })

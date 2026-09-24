import { rm, writeFile } from 'node:fs/promises'
await rm('dist/watch', { recursive: true, force: true })
await rm('dist/logo-options/index.html', { force: true })
await rm('dist/logo-options/parallel-delta.svg', { force: true })
await writeFile('dist/.nojekyll', '')

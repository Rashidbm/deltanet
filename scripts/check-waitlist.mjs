import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import worker from '../worker/index.js'
const sqlite = new DatabaseSync(':memory:')
sqlite.exec(readFileSync('drizzle/0000_married_jack_power.sql','utf8'))
const DB = { prepare(sql) { return { bind(...args) { return { async run() { return sqlite.prepare(sql).run(...args) } } } } } }
const request = (body, extra = {}) => new Request('https://deltanet.example/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://deltanet.example', ...extra }, body: JSON.stringify(body) })
assert.equal((await worker.fetch(request({email:'not-an-email'}),{DB})).status,400)
assert.equal((await worker.fetch(request({email:'test@example.com'},{Origin:'https://other.example'}),{DB})).status,403)
assert.equal((await worker.fetch(request({email:' Test@Example.com '}),{DB})).status,200)
assert.equal((await worker.fetch(request({email:'test@example.com'}),{DB})).status,200)
assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM waitlist').get().count,1)
assert.equal(sqlite.prepare('SELECT email FROM waitlist').get().email,'test@example.com')
assert.equal((await worker.fetch(request({email:'retry@example.com'}),{})).status,503)
assert.equal((await worker.fetch(new Request('https://deltanet.example/api/waitlist'),{DB})).status,405)
sqlite.close()
console.log('Waitlist checks passed: validation, origin, persistence, normalization, deduplication, unavailable storage, read protection.')
const preflight = await worker.fetch(new Request('https://deltanet.example/api/waitlist', { method: 'OPTIONS', headers: { Origin: 'https://rashidbm.github.io', 'Access-Control-Request-Method': 'POST' } }), {})
assert.equal(preflight.status,204)
assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),'https://rashidbm.github.io')
const blockedPreflight = await worker.fetch(new Request('https://deltanet.example/api/waitlist', { method: 'OPTIONS', headers: { Origin: 'https://unrelated.example' } }), {})
assert.equal(blockedPreflight.status,403)
assert.equal(blockedPreflight.headers.get('Access-Control-Allow-Origin'),null)
console.log('GitHub Pages CORS checks passed.')

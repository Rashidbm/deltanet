const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
async function saveEmail(db, email) {
  if (!db) throw new Error('Waitlist database unavailable')
  await db.prepare('INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING').bind(email).run()
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/waitlist') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
      const origin = request.headers.get('Origin')
      if (origin && origin !== url.origin) return json({ error: 'Invalid origin' }, 403)
      if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ error: 'JSON required' }, 415)
      if (Number(request.headers.get('Content-Length') || 0) > 2048) return json({ error: 'Request too large' }, 413)
      let body
      try {
        const raw = await request.text()
        if (raw.length > 2048) return json({ error: 'Request too large' }, 413)
        body = JSON.parse(raw)
      } catch { return json({ error: 'Invalid request' }, 400) }
      const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email' }, 400)
      try { await saveEmail(env.DB, email); return json({ ok: true }) }
      catch { console.error('Waitlist storage unavailable'); return json({ error: 'Please try again shortly' }, 503) }
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404)
    return env.ASSETS.fetch(request)
  },
}

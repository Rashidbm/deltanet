async function saveEmail(db, email) {
  if (!db) throw new Error('Waitlist database unavailable')
  await db.prepare('INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING').bind(email).run()
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin')
    const allowed = !origin || origin === url.origin || origin === 'https://rashidbm.github.io'
    const cors = origin && allowed ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : {}
    const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...cors } })
    if (url.pathname === '/api/waitlist') {
      if (!allowed) return json({ error: 'Invalid origin' }, 403)
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: {
        ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400',
      } })
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
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

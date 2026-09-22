import { WEBHOOK_URL, TIMEOUT_MS, APP_VERSION, BLOCCO, GIORNI_OK, GIORNI_AVVISO } from './config.js'

// Invio come form-urlencoded: richiesta "semplice", nessun preflight CORS.
async function chiama(dati) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: new URLSearchParams({ ...dati, versione: APP_VERSION }),
      signal: ctrl.signal,
    })
    const testo = await res.text()
    let json
    try { json = JSON.parse(testo) } catch { json = null }
    if (!res.ok || !json || json.ok !== true) {
      throw new Error('Il registro non ha confermato l\u2019operazione.')
    }
    return json
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Nessuna risposta dal registro entro 25 secondi.')
    if (e instanceof TypeError) throw new Error('Connessione assente o registro non raggiungibile.')
    throw e
  } finally {
    clearTimeout(timer)
  }
}

// Elenco condomini (tabella Chiavi, sincronizzata da Dropbox) unito all'ultima riconciliazione di ciascuno.
export async function caricaElenco() {
  const json = await chiama({ azione: 'elenco' })
  const ultime = new Map()
  for (const r of json.riconciliazioni || []) {
    const id = r.fields?.['Dropbox ID']
    if (id) ultime.set(id, { ultima: r.fields?.['Ultima riconciliazione'] || null, operatore: r.fields?.Operatore || '' })
  }
  const condomini = (json.condomini || [])
    .filter((r) => r.fields?.['Dropbox ID'])
    .map((r) => {
      const id = r.fields['Dropbox ID']
      const u = ultime.get(id) || { ultima: null, operatore: '' }
      return { id, condominio: r.fields?.Condominio || '(senza nome)', ...u }
    })
  return { condomini, incompleto: json.incompleto === true }
}

// Registra la riconciliazione per i condomini scelti, a blocchi da 10.
// onBlocco(n) viene chiamata dopo ogni blocco confermato con il numero di condomini registrati fin lì.
export async function registra(condomini, operatore, quando, onBlocco) {
  const iso = quando.toISOString()
  let fatti = 0
  for (let i = 0; i < condomini.length; i += BLOCCO) {
    const blocco = condomini.slice(i, i + BLOCCO)
    const records = blocco.map((c) => ({
      fields: {
        'Dropbox ID': c.id,
        Condominio: c.condominio,
        'Ultima riconciliazione': iso,
        Operatore: operatore,
      },
    }))
    await chiama({ azione: 'registra', n: String(records.length), records: JSON.stringify(records) })
    fatti += blocco.length
    onBlocco?.(fatti)
  }
  return fatti
}

export function giorniDa(data) {
  if (!data) return null
  const d = new Date(data)
  const oggi = new Date()
  const g0 = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())
  const g1 = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.max(0, Math.round((g0 - g1) / 86400000))
}

// Livello del badge: ok | avviso | ritardo | mai
export function livello(data) {
  const g = giorniDa(data)
  if (g === null) return 'mai'
  if (g <= GIORNI_OK) return 'ok'
  if (g <= GIORNI_AVVISO) return 'avviso'
  return 'ritardo'
}

export function quandoBreve(data) {
  const g = giorniDa(data)
  if (g === null) return 'mai'
  const ora = new Date(data).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  if (g === 0) return `oggi ${ora}`
  if (g === 1) return `ieri ${ora}`
  return `${g} gg fa`
}

export const dataOraEstesa = (d) =>
  new Date(d).toLocaleString('it-IT', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const normalizza = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')

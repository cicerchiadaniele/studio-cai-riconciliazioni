import { useMemo, useState } from 'react'
import Schermata, { Badge, CAMPO, TASTO_PRIMARIO } from './Schermata.jsx'
import { livello, normalizza, quandoBreve } from '../api.js'

export default function SceltaCondomini({ elenco, selezionati, onIndietro, onAvanti }) {
  const [q, setQ] = useState('')
  const [scelti, setScelti] = useState(() => new Set(selezionati.map((c) => c.id)))

  const filtrati = useMemo(() => {
    const n = normalizza(q)
    return n ? elenco.filter((c) => normalizza(c.condominio).includes(n)) : elenco
  }, [q, elenco])

  const inverti = (id) =>
    setScelti((s) => {
      const t = new Set(s)
      t.has(id) ? t.delete(id) : t.add(id)
      return t
    })

  const avanti = () => onAvanti(elenco.filter((c) => scelti.has(c.id)))

  return (
    <Schermata titolo="Quali conti hai riconciliato?" sotto="Puoi sceglierne più di uno." onIndietro={onIndietro}>
      <label className="block">
        <span className="sr-only">Cerca condominio</span>
        <input
          autoFocus
          type="search"
          inputMode="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && filtrati.length === 1) { inverti(filtrati[0].id); setQ('') }
          }}
          placeholder="Scrivi la via, es. rua"
          className={CAMPO}
        />
      </label>

      <ul className="mt-4 flex flex-col gap-2 pb-28" role="group" aria-label="Condomini">
        {filtrati.map((c) => {
          const on = scelti.has(c.id)
          return (
            <li key={c.id}>
              <button
                role="checkbox"
                aria-checked={on}
                onClick={() => inverti(c.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition ${on ? 'border-brand bg-brand/8' : 'border-neutral-200 bg-white'}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-brand bg-brand text-white' : 'border-neutral-300 bg-white'}`}
                  aria-hidden="true"
                >
                  {on && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                  )}
                </span>
                <span className="flex-1 text-[1.05rem] font-semibold">{c.condominio}</span>
                <Badge livello={livello(c.ultima)}>{quandoBreve(c.ultima)}</Badge>
              </button>
            </li>
          )
        })}
      </ul>
      {filtrati.length === 0 && <p className="mt-2 text-center text-neutral-500">Nessun condominio trovato con questo nome.</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-crema via-crema to-crema/0 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6">
        <button
          onClick={avanti}
          disabled={scelti.size === 0}
          className={`mx-auto block max-w-lg ${TASTO_PRIMARIO}`}
        >
          {scelti.size === 0 ? 'Scegli almeno un condominio' : `Avanti · ${scelti.size} ${scelti.size === 1 ? 'condominio' : 'condomini'}`}
        </button>
      </div>
    </Schermata>
  )
}

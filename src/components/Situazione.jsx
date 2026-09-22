import { useMemo, useState } from 'react'
import Schermata, { Indietro, Badge } from './Schermata.jsx'
import { livello, normalizza, quandoBreve } from '../api.js'
import { GIORNI_OK, GIORNI_AVVISO } from '../config.js'

const dataOra = (d) =>
  new Date(d).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function Situazione({ elenco, onIndietro }) {
  const [q, setQ] = useState('')

  // Prima i mai riconciliati, poi dal più vecchio al più recente
  const ordinati = useMemo(
    () => [...elenco].sort((a, b) => {
      if (!a.ultima && !b.ultima) return a.condominio.localeCompare(b.condominio, 'it')
      if (!a.ultima) return -1
      if (!b.ultima) return 1
      return new Date(a.ultima) - new Date(b.ultima)
    }),
    [elenco]
  )
  const filtrati = useMemo(() => {
    const n = normalizza(q)
    return n ? ordinati.filter((c) => normalizza(c.condominio).includes(n)) : ordinati
  }, [q, ordinati])

  return (
    <Schermata>
      <Indietro onClick={onIndietro} />
      <h2 className="font-display text-3xl font-bold leading-tight">Situazione dei conti</h2>
      <p className="mt-1 text-sm text-inchiostro/60">
        Verde fino a {GIORNI_OK} giorni, ocra fino a {GIORNI_AVVISO}, rosso oltre.
      </p>

      <label className="mt-5 block">
        <span className="sr-only">Cerca condominio</span>
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca condominio"
          className="w-full rounded-2xl border-2 border-inchiostro/10 bg-carta px-4 py-3.5 text-base outline-none placeholder:text-inchiostro/35 focus:border-bordeaux"
        />
      </label>

      <ul className="mt-4 flex flex-col gap-2">
        {filtrati.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-carta px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{c.condominio}</p>
              <p className="text-xs text-inchiostro/55">
                {c.ultima ? `${dataOra(c.ultima)}${c.operatore ? ` · ${c.operatore}` : ''}` : 'Nessuna riconciliazione registrata'}
              </p>
            </div>
            <Badge livello={livello(c.ultima)}>{quandoBreve(c.ultima)}</Badge>
          </li>
        ))}
      </ul>
      {filtrati.length === 0 && <p className="mt-6 text-center text-inchiostro/60">Nessun condominio trovato con questo nome.</p>}
    </Schermata>
  )
}

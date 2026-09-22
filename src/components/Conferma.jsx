import { useState } from 'react'
import Schermata, { Indietro } from './Schermata.jsx'
import { dataOraEstesa } from '../api.js'
import { GIORNI_RETRO_MAX } from '../config.js'

// Valore per <input type="datetime-local"> nell'ora locale del dispositivo
const perInput = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Conferma({ selezionati, operatore, onIndietro, onConferma }) {
  const [altra, setAltra] = useState(false)
  const [valore, setValore] = useState(() => perInput(new Date()))

  const ora = new Date()
  const minimo = new Date(ora.getTime() - GIORNI_RETRO_MAX * 86400000)
  const scelta = altra ? new Date(valore) : null
  let errore = ''
  if (altra) {
    if (!valore || Number.isNaN(scelta.getTime())) errore = 'Indica giorno e ora.'
    else if (scelta.getTime() > ora.getTime() + 60000) errore = 'La data non può essere nel futuro.'
    else if (scelta < minimo) errore = `Al massimo ${GIORNI_RETRO_MAX} giorni fa.`
  }

  const conferma = () => {
    if (errore) return
    onConferma(altra ? scelta : new Date())
  }

  return (
    <Schermata>
      <Indietro onClick={onIndietro} />
      <p className="text-sm font-semibold text-bordeaux">{operatore}</p>
      <h2 className="font-display text-3xl font-bold leading-tight">Confermi la riconciliazione?</h2>

      <ul className="mt-5 flex flex-wrap gap-2">
        {selezionati.map((c) => (
          <li key={c.id} className="rounded-full bg-carta px-3.5 py-2 text-sm font-semibold ring-1 ring-inchiostro/10">
            {c.condominio}
          </li>
        ))}
      </ul>

      <fieldset className="mt-7">
        <legend className="mb-2 text-sm font-medium text-inchiostro/70">Quando</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup">
          <button
            role="radio"
            aria-checked={!altra}
            onClick={() => setAltra(false)}
            className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${!altra ? 'border-bordeaux bg-bordeaux text-white' : 'border-inchiostro/10 bg-carta'}`}
          >
            Adesso
          </button>
          <button
            role="radio"
            aria-checked={altra}
            onClick={() => setAltra(true)}
            className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${altra ? 'border-bordeaux bg-bordeaux text-white' : 'border-dashed border-inchiostro/25 bg-transparent'}`}
          >
            Altra data e ora
          </button>
        </div>
        {altra && (
          <label className="mt-3 block">
            <span className="sr-only">Data e ora della riconciliazione</span>
            <input
              type="datetime-local"
              value={valore}
              max={perInput(ora)}
              min={perInput(minimo)}
              onChange={(e) => setValore(e.target.value)}
              className="w-full rounded-2xl border-2 border-inchiostro/10 bg-carta px-4 py-4 text-lg outline-none focus:border-bordeaux"
            />
          </label>
        )}
        <p className={`mt-2 text-sm ${errore ? 'text-errore' : 'text-inchiostro/60'}`} role={errore ? 'alert' : undefined}>
          {errore || (altra && scelta ? dataOraEstesa(scelta) : 'Verrà registrata l’ora dell’invio.')}
        </p>
      </fieldset>

      <button
        onClick={conferma}
        disabled={!!errore}
        className="mt-8 w-full rounded-2xl bg-bordeaux py-5 text-lg font-bold text-white transition active:scale-[0.98] disabled:bg-inchiostro/15 disabled:text-inchiostro/40"
      >
        Registra {selezionati.length === 1 ? 'riconciliazione' : `${selezionati.length} riconciliazioni`}
      </button>
    </Schermata>
  )
}

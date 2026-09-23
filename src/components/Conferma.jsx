import { useState } from 'react'
import Schermata, { CAMPO, TASTO_PRIMARIO } from './Schermata.jsx'
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
    <Schermata titolo="Confermi la riconciliazione?" sopra={operatore} onIndietro={onIndietro}>
      <ul className="flex flex-wrap gap-2">
        {selezionati.map((c) => (
          <li key={c.id} className="rounded-full bg-brand/8 px-3.5 py-2 text-sm font-semibold text-brand-deep ring-1 ring-brand/20">
            {c.condominio}
          </li>
        ))}
      </ul>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-semibold text-neutral-700">Quando</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup">
          <button
            role="radio"
            aria-checked={!altra}
            onClick={() => setAltra(false)}
            className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${!altra ? 'border-brand bg-brand text-white' : 'border-neutral-200 bg-white'}`}
          >
            Adesso
          </button>
          <button
            role="radio"
            aria-checked={altra}
            onClick={() => setAltra(true)}
            className={`rounded-2xl border-2 px-4 py-4 text-base font-semibold transition ${altra ? 'border-brand bg-brand text-white' : 'border-dashed border-neutral-300 bg-white'}`}
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
              className={CAMPO}
            />
          </label>
        )}
        <p className={`mt-2 text-sm ${errore ? 'text-red-600' : 'text-neutral-500'}`} role={errore ? 'alert' : undefined}>
          {errore || (altra && scelta ? dataOraEstesa(scelta) : 'Verrà registrata l’ora dell’invio.')}
        </p>
      </fieldset>

      <button onClick={conferma} disabled={!!errore} className={`mt-6 ${TASTO_PRIMARIO}`}>
        Registra {selezionati.length === 1 ? 'riconciliazione' : `${selezionati.length} riconciliazioni`}
      </button>
    </Schermata>
  )
}

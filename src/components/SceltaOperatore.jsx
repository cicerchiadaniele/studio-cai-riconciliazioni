import Schermata, { Indietro } from './Schermata.jsx'
import { OPERATORI } from '../config.js'

export default function SceltaOperatore({ attuale, onIndietro, onScegli }) {
  return (
    <Schermata>
      <Indietro onClick={onIndietro} />
      <h2 className="font-display text-3xl font-bold leading-tight">Chi sei?</h2>
      <p className="mt-2 text-sm text-inchiostro/60">Resta memorizzato su questo dispositivo.</p>
      <div className="mt-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Operatore">
        {OPERATORI.map((o) => {
          const on = attuale === o
          return (
            <button
              key={o}
              role="radio"
              aria-checked={on}
              onClick={() => onScegli(o)}
              className={`rounded-2xl border-2 px-4 py-6 text-lg font-bold transition active:scale-[0.98] ${on ? 'border-bordeaux bg-bordeaux text-white' : 'border-inchiostro/10 bg-carta'}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </Schermata>
  )
}

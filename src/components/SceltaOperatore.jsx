import Schermata from './Schermata.jsx'
import { OPERATORI } from '../config.js'

export default function SceltaOperatore({ attuale, onIndietro, onScegli }) {
  return (
    <Schermata titolo="Chi sei?" sotto="Resta memorizzato su questo dispositivo." onIndietro={onIndietro}>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Operatore">
        {OPERATORI.map((o) => {
          const on = attuale === o
          return (
            <button
              key={o}
              role="radio"
              aria-checked={on}
              onClick={() => onScegli(o)}
              className={`rounded-2xl border-2 px-4 py-6 text-lg font-bold transition active:scale-[0.98] ${on ? 'border-brand bg-brand text-white' : 'border-neutral-200 bg-white hover:border-neutral-300'}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </Schermata>
  )
}

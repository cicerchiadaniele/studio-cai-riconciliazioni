import Schermata from './Schermata.jsx'
import { giorniDa } from '../api.js'
import { GIORNI_AVVISO } from '../config.js'

function Frecce({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22h36m-9-9 9 9-9 9M52 42H16m9-9-9 9 9 9" />
    </svg>
  )
}

export default function Home({ caricamento, condomini, incompleto, operatore, onRegistra, onSituazione, onCambiaOperatore, onRiprova }) {
  const pronto = caricamento === 'pronto'
  const oggi = condomini.filter((c) => giorniDa(c.ultima) === 0).length
  const indietro = condomini.filter((c) => { const g = giorniDa(c.ultima); return g === null || g > GIORNI_AVVISO }).length

  return (
    <Schermata>
      <button
        onClick={onCambiaOperatore}
        className="mb-4 flex w-full items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 text-left ring-1 ring-neutral-200 transition active:bg-neutral-100"
      >
        <span className="text-sm text-neutral-600">Operatore</span>
        <span className="flex items-center gap-2 font-semibold">
          {operatore || <span className="text-brand">Scegli</span>}
          <span className="text-xs font-semibold text-brand underline underline-offset-2">{operatore ? 'cambia' : ''}</span>
        </span>
      </button>

      {caricamento === 'attesa' && (
        <p className="mb-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600 ring-1 ring-neutral-200" role="status">
          Carico l’elenco dei condomini…
        </p>
      )}
      {caricamento === 'errore' && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200" role="alert">
          Elenco non disponibile: controlla la connessione.
          <button onClick={onRiprova} className="ml-2 font-bold underline">Riprova</button>
        </div>
      )}
      {pronto && incompleto && (
        <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200" role="alert">
          Elenco oltre 100 condomini: alcuni potrebbero mancare. Avvisa Daniele.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={onRegistra}
          disabled={!pronto}
          className="relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand-dark to-brand-deep p-6 text-left text-white shadow-[0_10px_24px_-10px_rgba(139,21,56,0.6)] transition active:scale-[0.98] disabled:opacity-50"
        >
          <Frecce className="absolute -right-3 -top-1 h-28 w-28 text-white/10" />
          <span className="text-sm font-medium text-white/85">Conto e gestionale allineati</span>
          <span className="font-display text-3xl font-semibold">Ho riconciliato</span>
        </button>

        <button
          onClick={onSituazione}
          disabled={!pronto}
          className="flex min-h-[8rem] flex-col justify-between rounded-3xl bg-white p-6 text-left ring-1 ring-brand/30 transition active:scale-[0.98] active:bg-brand/5 disabled:opacity-50"
        >
          <span className="text-sm font-medium text-neutral-600">
            {pronto
              ? `${oggi === 1 ? '1 riconciliato' : `${oggi} riconciliati`} oggi · ${indietro} oltre ${GIORNI_AVVISO} gg o mai`
              : 'Stato dei conti'}
          </span>
          <span className="font-display text-3xl font-semibold text-brand">Situazione</span>
        </button>
      </div>
    </Schermata>
  )
}

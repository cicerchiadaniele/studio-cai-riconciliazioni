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
      <header className="mb-6 mt-4">
        <p className="text-sm font-semibold text-bordeaux">Studio CAI</p>
        <h1 className="mt-1 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight">
          Registro<br />riconciliazioni
        </h1>
        <p className="mt-2 text-sm text-inchiostro/60">Conti condominiali allineati al gestionale</p>
      </header>

      <button
        onClick={onCambiaOperatore}
        className="mb-5 flex w-full items-center justify-between rounded-2xl bg-carta px-4 py-3 text-left"
      >
        <span className="text-sm text-inchiostro/60">Operatore</span>
        <span className="flex items-center gap-2 font-semibold">
          {operatore || <span className="text-bordeaux">Scegli</span>}
          <span className="text-xs font-semibold text-bordeaux underline underline-offset-2">{operatore ? 'cambia' : ''}</span>
        </span>
      </button>

      {caricamento === 'attesa' && (
        <p className="mb-4 rounded-xl bg-carta px-4 py-3 text-sm text-inchiostro/70" role="status">
          Carico l’elenco dei condomini…
        </p>
      )}
      {caricamento === 'errore' && (
        <div className="mb-4 rounded-xl bg-errore-soft px-4 py-3 text-sm text-errore" role="alert">
          Elenco non disponibile: controlla la connessione.
          <button onClick={onRiprova} className="ml-2 font-bold underline">Riprova</button>
        </div>
      )}
      {pronto && incompleto && (
        <p className="mb-4 rounded-xl bg-ottone-soft px-4 py-3 text-sm text-[#6B4E1C]" role="alert">
          Elenco oltre 100 condomini: alcuni potrebbero mancare. Avvisa Daniele.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <button
          onClick={onRegistra}
          disabled={!pronto}
          className="relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-bordeaux p-6 text-left text-white shadow-[0_10px_30px_-12px_rgba(139,21,56,0.6)] transition active:scale-[0.98] disabled:opacity-50"
        >
          <Frecce className="absolute -right-3 -top-1 h-28 w-28 text-white/10" />
          <span className="text-sm font-medium text-white/80">Conto e gestionale allineati</span>
          <span className="font-display text-3xl font-bold">Ho riconciliato</span>
        </button>

        <button
          onClick={onSituazione}
          disabled={!pronto}
          className="flex min-h-[8rem] flex-col justify-between rounded-[1.75rem] border-2 border-bordeaux/25 bg-carta p-6 text-left transition active:scale-[0.98] disabled:opacity-50"
        >
          <span className="text-sm font-medium text-inchiostro/60">
            {pronto
              ? `${oggi === 1 ? '1 riconciliato' : `${oggi} riconciliati`} oggi · ${indietro} oltre ${GIORNI_AVVISO} gg o mai`
              : 'Stato dei conti'}
          </span>
          <span className="font-display text-3xl font-bold text-bordeaux">Situazione</span>
        </button>
      </div>
    </Schermata>
  )
}

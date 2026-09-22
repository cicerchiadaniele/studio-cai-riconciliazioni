import { motion } from 'framer-motion'
import Schermata from './Schermata.jsx'
import { dataOraEstesa } from '../api.js'

function Timbro({ n, quando, operatore }) {
  // Il timbro "RICONCILIATO" che si imprime sul foglio: conferma solo dopo esito positivo su Airtable.
  return (
    <div className="relative mx-auto mt-2 w-72 rounded-2xl bg-carta px-6 pb-7 pt-8 text-center shadow-[0_14px_30px_-16px_rgba(42,31,34,0.35)] ring-1 ring-inchiostro/10">
      <div className="absolute inset-x-6 top-4 space-y-2" aria-hidden="true">
        <div className="h-1.5 w-2/3 rounded bg-inchiostro/5" />
        <div className="h-1.5 w-1/2 rounded bg-inchiostro/5" />
      </div>
      <motion.div
        initial={{ scale: 1.9, rotate: -24, opacity: 0 }}
        animate={{ scale: 1, rotate: -8, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.1 }}
        className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full border-[5px] border-double border-verde text-verde"
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <span className="mt-1 text-[0.7rem] font-extrabold uppercase tracking-[0.18em]">Riconciliato</span>
      </motion.div>
      <p className="mt-5 font-display text-2xl font-bold leading-tight">
        {n === 1 ? '1 conto registrato' : `${n} conti registrati`}
      </p>
      <p className="mt-2 text-sm text-inchiostro/70">{dataOraEstesa(quando)}</p>
      <p className="text-sm text-inchiostro/70">{operatore}</p>
    </div>
  )
}

export default function Esito({ invio, onRiprova, onFatto, onAncora }) {
  const { stato, totale, fatti, quando, operatore, messaggio, nomi } = invio

  if (stato === 'attesa') {
    return (
      <Schermata className="items-center justify-center text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-bordeaux/20 border-t-bordeaux" aria-hidden="true" />
        <p className="mt-6 font-display text-2xl font-bold" role="status">Registrazione in corso</p>
        <p className="mt-2 text-inchiostro/60">
          {totale > 10 ? `${fatti} di ${totale} registrati – ` : ''}attendi la conferma, non chiudere la pagina.
        </p>
      </Schermata>
    )
  }

  if (stato === 'errore') {
    return (
      <Schermata className="justify-center">
        <div className="rounded-3xl bg-errore-soft p-6" role="alert">
          <p className="font-display text-2xl font-bold text-errore">
            {fatti > 0 ? 'Registrazione incompleta' : 'Riconciliazione non registrata'}
          </p>
          <p className="mt-2 text-inchiostro">{messaggio}</p>
          <p className="mt-2 text-sm text-inchiostro/70">
            {fatti > 0 ? `Registrati ${fatti} su ${totale}. Mancano: ` : 'Non risultano nel registro: '}
            <strong>{nomi.join(', ')}</strong>. Riprova; se l’errore continua, avvisa lo studio.
          </p>
        </div>
        <button onClick={onRiprova} className="mt-6 w-full rounded-2xl bg-bordeaux py-5 text-lg font-bold text-white active:scale-[0.98]">
          Riprova
        </button>
        <button onClick={onFatto} className="mt-3 w-full rounded-2xl py-4 font-semibold text-inchiostro/70">
          Annulla
        </button>
      </Schermata>
    )
  }

  return (
    <Schermata className="justify-center">
      <Timbro n={totale} quando={quando} operatore={operatore} />
      <button onClick={onFatto} className="mt-10 w-full rounded-2xl bg-bordeaux py-5 text-lg font-bold text-white active:scale-[0.98]">
        Fatto
      </button>
      <button onClick={onAncora} className="mt-3 w-full rounded-2xl py-4 font-semibold text-bordeaux">
        Registra un altro conto
      </button>
    </Schermata>
  )
}

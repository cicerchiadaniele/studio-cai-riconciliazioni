import { motion } from 'framer-motion'
import Schermata, { TASTO_PRIMARIO, TASTO_SECONDARIO } from './Schermata.jsx'
import { dataOraEstesa } from '../api.js'

function Timbro({ n, quando, operatore }) {
  // Il timbro "RICONCILIATO" che si imprime sul foglio: conferma solo dopo esito positivo su Airtable.
  return (
    <div className="relative mx-auto mt-2 w-full max-w-xs rounded-3xl bg-gradient-to-br from-brand/8 to-white px-6 pb-7 pt-8 text-center ring-1 ring-brand/30">
      <div className="absolute inset-x-6 top-4 space-y-2" aria-hidden="true">
        <div className="h-1.5 w-2/3 rounded bg-brand/8" />
        <div className="h-1.5 w-1/2 rounded bg-brand/8" />
      </div>
      <motion.div
        initial={{ scale: 1.9, rotate: -24, opacity: 0 }}
        animate={{ scale: 1, rotate: -8, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.1 }}
        className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full border-[5px] border-double border-brand-dark text-brand-dark"
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <span className="mt-1 text-[0.7rem] font-extrabold uppercase tracking-[0.18em]">Riconciliato</span>
      </motion.div>
      <p className="mt-5 font-display text-2xl font-semibold leading-tight text-brand-deep">
        {n === 1 ? '1 conto registrato' : `${n} conti registrati`}
      </p>
      <p className="mt-2 text-sm text-neutral-600">{dataOraEstesa(quando)}</p>
      <p className="text-sm text-neutral-600">{operatore}</p>
    </div>
  )
}

export default function Esito({ invio, onRiprova, onFatto, onAncora }) {
  const { stato, totale, fatti, quando, operatore, messaggio, nomi } = invio

  if (stato === 'attesa') {
    return (
      <Schermata className="min-h-[50vh] items-center justify-center text-center">
        <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-brand/20 border-t-brand" aria-hidden="true" />
        <p className="mt-6 font-display text-2xl font-semibold" role="status">Registrazione in corso</p>
        <p className="mt-2 text-neutral-600">
          {totale > 10 ? `${fatti} di ${totale} registrati – ` : ''}attendi la conferma, non chiudere la pagina.
        </p>
      </Schermata>
    )
  }

  if (stato === 'errore') {
    return (
      <Schermata>
        <div className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-200" role="alert">
          <p className="font-display text-2xl font-semibold text-red-700">
            {fatti > 0 ? 'Registrazione incompleta' : 'Riconciliazione non registrata'}
          </p>
          <p className="mt-2 text-neutral-900">{messaggio}</p>
          <p className="mt-2 text-sm text-neutral-600">
            {fatti > 0 ? `Registrati ${fatti} su ${totale}. Mancano: ` : 'Non risultano nel registro: '}
            <strong>{nomi.join(', ')}</strong>. Riprova; se l’errore continua, avvisa lo studio.
          </p>
        </div>
        <button onClick={onRiprova} className={`mt-6 ${TASTO_PRIMARIO}`}>
          Riprova
        </button>
        <button onClick={onFatto} className="mt-3 w-full rounded-2xl py-4 font-semibold text-neutral-600">
          Annulla
        </button>
      </Schermata>
    )
  }

  return (
    <Schermata>
      <Timbro n={totale} quando={quando} operatore={operatore} />
      <button onClick={onFatto} className={`mt-8 ${TASTO_PRIMARIO}`}>
        Fatto
      </button>
      <button onClick={onAncora} className={`mt-3 ${TASTO_SECONDARIO}`}>
        Registra un altro conto
      </button>
    </Schermata>
  )
}

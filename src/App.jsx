import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { caricaElenco, registra } from './api.js'
import { APP_VERSION, OPERATORI } from './config.js'
import Home from './components/Home.jsx'
import SceltaOperatore from './components/SceltaOperatore.jsx'
import SceltaCondomini from './components/SceltaCondomini.jsx'
import Conferma from './components/Conferma.jsx'
import Esito from './components/Esito.jsx'
import Situazione from './components/Situazione.jsx'

const CHIAVE_OPERATORE = 'registro-riconciliazioni:operatore'

function leggiOperatore() {
  try {
    const v = localStorage.getItem(CHIAVE_OPERATORE) || ''
    return OPERATORI.includes(v) ? v : ''
  } catch { return '' }
}

export default function App() {
  const [dati, setDati] = useState({ condomini: [], incompleto: false })
  const [caricamento, setCaricamento] = useState('attesa') // attesa | pronto | errore
  const [schermata, setSchermata] = useState('home')
  const [dopoOperatore, setDopoOperatore] = useState('home')
  const [operatore, setOperatore] = useState(leggiOperatore)
  const [selezionati, setSelezionati] = useState([])
  const [invio, setInvio] = useState(null)

  const ricarica = useCallback(async () => {
    setCaricamento((c) => (c === 'pronto' ? c : 'attesa'))
    try {
      setDati(await caricaElenco())
      setCaricamento('pronto')
    } catch {
      setCaricamento('errore')
    }
  }, [])

  useEffect(() => { ricarica() }, [ricarica])

  const tornaHome = () => {
    setSelezionati([])
    setInvio(null)
    setSchermata('home')
  }

  const scegliOperatore = (o) => {
    setOperatore(o)
    try { localStorage.setItem(CHIAVE_OPERATORE, o) } catch { /* facoltativo */ }
    setSchermata(dopoOperatore)
  }

  const iniziaRegistrazione = () => {
    setSelezionati([])
    if (!operatore) {
      setDopoOperatore('scelta')
      setSchermata('operatore')
    } else {
      setSchermata('scelta')
    }
  }

  // Invia i condomini ancora da registrare; in caso di errore a metà, "Riprova" riparte solo dai mancanti.
  const esegui = async (daInviare, quando, totale, giaFatti) => {
    setSchermata('invio')
    const base = { totale, quando, operatore }
    setInvio({ ...base, stato: 'attesa', fatti: giaFatti })
    let fatti = 0
    try {
      await registra(daInviare, operatore, quando, (n) => {
        fatti = n
        setInvio({ ...base, stato: 'attesa', fatti: giaFatti + n })
      })
      setInvio({ ...base, stato: 'ok', fatti: totale })
      ricarica()
    } catch (e) {
      const mancanti = daInviare.slice(fatti)
      setInvio({
        ...base,
        stato: 'errore',
        fatti: giaFatti + fatti,
        messaggio: e.message,
        nomi: mancanti.map((c) => c.condominio),
        riprova: () => esegui(mancanti, quando, totale, giaFatti + fatti),
      })
      if (fatti > 0) ricarica()
    }
  }

  const conferma = (quando) => esegui(selezionati, quando, selezionati.length, 0)

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <AnimatePresence mode="wait">
        {schermata === 'home' && (
          <Home
            key="home"
            caricamento={caricamento}
            condomini={dati.condomini}
            incompleto={dati.incompleto}
            operatore={operatore}
            onRegistra={iniziaRegistrazione}
            onSituazione={() => setSchermata('situazione')}
            onCambiaOperatore={() => { setDopoOperatore('home'); setSchermata('operatore') }}
            onRiprova={ricarica}
          />
        )}
        {schermata === 'operatore' && (
          <SceltaOperatore key="op" attuale={operatore} onIndietro={tornaHome} onScegli={scegliOperatore} />
        )}
        {schermata === 'scelta' && (
          <SceltaCondomini
            key="sc"
            elenco={dati.condomini}
            selezionati={selezionati}
            onIndietro={tornaHome}
            onAvanti={(scelti) => { setSelezionati(scelti); setSchermata('conferma') }}
          />
        )}
        {schermata === 'conferma' && selezionati.length > 0 && (
          <Conferma
            key="co"
            selezionati={selezionati}
            operatore={operatore}
            onIndietro={() => setSchermata('scelta')}
            onConferma={conferma}
          />
        )}
        {schermata === 'invio' && invio && (
          <Esito
            key="es"
            invio={invio}
            onRiprova={() => invio.riprova?.()}
            onFatto={tornaHome}
            onAncora={() => { setSelezionati([]); setInvio(null); setSchermata('scelta') }}
          />
        )}
        {schermata === 'situazione' && (
          <Situazione key="si" elenco={dati.condomini} onIndietro={tornaHome} />
        )}
      </AnimatePresence>
      {schermata !== 'scelta' && (
        <p className="mt-auto pt-8 text-center text-xs text-inchiostro/40">Studio CAI · Registro Riconciliazioni v{APP_VERSION}</p>
      )}
    </div>
  )
}

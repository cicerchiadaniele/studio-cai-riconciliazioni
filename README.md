# Studio CAI – Registro Riconciliazioni (v1.1.0)

Webapp interna per registrare giorno e ora dell'ultima riconciliazione bancaria tra conto condominiale e gestionale (CED House Suite). Serve a far lavorare il briefing solleciti solo sui condomini con conto aggiornato.

## Uso
1. Alla prima apertura si sceglie l'operatore (Daniele, Marco, Paolo, Simone): resta memorizzato sul dispositivo.
2. "Ho riconciliato" → si spuntano uno o più condomini → "Adesso" oppure "Altra data e ora" (max 60 giorni indietro) → Registra.
3. Il timbro "Riconciliato" compare solo se Airtable conferma tutti i record. In caso di errore a metà, "Riprova" invia solo i mancanti.
4. "Situazione" mostra tutti i condomini dal più indietro al più aggiornato (verde ≤ 7 gg, ambra ≤ 30, rosso oltre o mai).

## Pubblicazione su Vercel
Importa la cartella come nuovo progetto (framework: Vite, build `npm run build`, output `dist`).
Il logo dello studio va in `public/logo.jpg` (usato da intestazione e icona della pagina).

## Collegamenti
- Webhook Make: `src/config.js` → scenario "Studio CAI – WebApp Registro Riconciliazioni" (ID 7544086, hook 3765793)
- Airtable, base dedicata **Registro Riconciliazioni** (appXiEb3IL2sjtbPs), tabella Riconciliazioni (tbl5pfmGh7d9u4OEs): una riga per condominio, upsert su "Dropbox ID"
- Elenco condomini mostrato in webapp: letto in sola lettura dalla tabella Chiavi della base Registro Chiavi (sincronizzata ogni mese da Dropbox `/STUDIO CAI/scritti_cai`, scenario 7434508). Un condominio nuovo compare in webapp dopo la sync mensile e la sua riga in Registro Riconciliazioni si crea alla prima registrazione.

## Tabella Riconciliazioni
| Campo | Note |
|---|---|
| Condominio | nome cartella Dropbox |
| Ultima riconciliazione | giorno e ora indicati in webapp (Europe/Rome) |
| Operatore | chi ha riconciliato |
| Ultimo briefing | timbrato dal Briefing Solleciti dopo aver salvato il PDF |
| Dropbox ID | chiave di collegamento, non modificare |

## Briefing Solleciti (attività programmata, lun–ven 13:00)
Oltre alla rotazione, elabora i condomini con "Ultima riconciliazione" nel giorno precedente (di lunedì: da venerdì a domenica), escluse le riconciliazioni già briefate. Dopo il salvataggio del PDF scrive "Ultimo briefing".

## Note
- Nessuno storico: conta solo l'ultima riconciliazione per condominio.
- Limite attuale: 100 condomini per chiamata (oggi 75); oltre, la webapp mostra un avviso.
- Airtable accetta 10 record per chiamata: selezioni più ampie partono a blocchi (1 operazione Make ogni 10 condomini).
- package-lock.json non è incluso: Vercel lo rigenera da package.json durante la build.

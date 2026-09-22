// Webhook Make: scenario "Studio CAI – WebApp Registro Riconciliazioni" (ID 7544086)
export const WEBHOOK_URL = 'https://hook.eu1.make.com/qxsijro6lfjm7mc8emi5h95adbiz1iu1'
export const APP_VERSION = '1.0.0'
export const TIMEOUT_MS = 25000

// Personale dello studio, in ordine alfabetico (devono coincidere con le opzioni del campo Operatore su Airtable)
export const OPERATORI = ['Daniele', 'Marco', 'Paolo', 'Simone']

// Soglie dei badge: fino a GIORNI_OK verde, fino a GIORNI_AVVISO ottone, oltre rosso
export const GIORNI_OK = 7
export const GIORNI_AVVISO = 30

// Airtable accetta al massimo 10 record per chiamata: selezioni più ampie vengono inviate a blocchi
export const BLOCCO = 10

// Retrodatazione massima consentita per "Altra data e ora"
export const GIORNI_RETRO_MAX = 60

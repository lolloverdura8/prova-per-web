import { preferenceCookies } from './cookieUtils';
// Importa le utility per i cookie di preferenze

/**
 * Tipo di preferenze che possono essere salvate
 */
const PREFERENCE_TYPES = {
  // Oggetto costante che enumera i tipi di preferenze supportati

  THEME: 'theme',
  // Tipo di preferenza per il tema (chiaro/scuro)

  LANGUAGE: 'language',
  // Tipo di preferenza per la lingua

  NOTIFICATION: 'notification',
  // Tipo di preferenza per le notifiche

  LAYOUT: 'layout'
  // Tipo di preferenza per il layout
};

/**
 * Ottiene tutte le preferenze dell'utente
 * @returns {Object} Oggetto con tutte le preferenze dell'utente
 */
export const getUserPreferences = () => {
  // Funzione per ottenere tutte le preferenze dell'utente

  const defaultPreferences = {
    // Definisce le preferenze predefinite

    theme: 'dark',
    // Tema predefinito: scuro

    language: 'it',
    // Lingua predefinita: italiano

    notification: true,
    // Notifiche predefinite: attive

    layout: 'standard'
    // Layout predefinito: standard
  };

  const savedPreferences = preferenceCookies.getPreferences();
  // Ottiene le preferenze salvate dai cookie

  if (!savedPreferences) {
    // Se non ci sono preferenze salvate

    return defaultPreferences;
    // Restituisce le preferenze predefinite
  }

  return { ...defaultPreferences, ...savedPreferences };
  // Unisce le preferenze predefinite con quelle salvate
  // Le preferenze salvate sovrascrivono quelle predefinite quando esistono
};

/**
 * Salva una preferenza specifica dell'utente
 * @param {string} key - Chiave della preferenza (usa PREFERENCE_TYPES)
 * @param {any} value - Valore della preferenza
 */
export const saveUserPreference = (key, value) => {
  // Funzione per salvare una specifica preferenza dell'utente

  const currentPreferences = getUserPreferences();
  // Ottiene le preferenze correnti

  const updatedPreferences = { ...currentPreferences, [key]: value };
  // Crea un nuovo oggetto con tutte le preferenze correnti e aggiorna la specifica chiave
  // La sintassi [key] permette di usare il valore di key come nome della proprietà

  preferenceCookies.savePreferences(updatedPreferences);
  // Salva le preferenze aggiornate nei cookie

  return updatedPreferences;
  // Restituisce l'oggetto preferenze aggiornato
};

/**
 * Ottiene una preferenza specifica dell'utente
 * @param {string} key - Chiave della preferenza
 * @returns {any} Valore della preferenza
 */
export const getUserPreference = (key) => {
  // Funzione per ottenere una specifica preferenza dell'utente

  const preferences = getUserPreferences();
  // Ottiene tutte le preferenze

  return preferences[key];
  // Restituisce il valore della specifica chiave
};

/**
 * Tipi di preferenze disponibili
 */
export { PREFERENCE_TYPES };
// Esporta la costante PREFERENCE_TYPES per poterla utilizzare in altri file
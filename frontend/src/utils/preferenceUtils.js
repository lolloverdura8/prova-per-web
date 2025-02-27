import { preferenceCookies } from './cookieUtils';

/**
 * Tipo di preferenze che possono essere salvate
 */
const PREFERENCE_TYPES = {
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATION: 'notification',
  LAYOUT: 'layout'
};

/**
 * Ottiene tutte le preferenze dell'utente
 * @returns {Object} Oggetto con tutte le preferenze dell'utente
 */
export const getUserPreferences = () => {
  const defaultPreferences = {
    theme: 'dark',
    language: 'it',
    notification: true,
    layout: 'standard'
  };

  const savedPreferences = preferenceCookies.getPreferences();
  
  if (!savedPreferences) {
    return defaultPreferences;
  }
  
  return { ...defaultPreferences, ...savedPreferences };
};

/**
 * Salva una preferenza specifica dell'utente
 * @param {string} key - Chiave della preferenza (usa PREFERENCE_TYPES)
 * @param {any} value - Valore della preferenza
 */
export const saveUserPreference = (key, value) => {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = { ...currentPreferences, [key]: value };
  preferenceCookies.savePreferences(updatedPreferences);
  return updatedPreferences;
};

/**
 * Ottiene una preferenza specifica dell'utente
 * @param {string} key - Chiave della preferenza
 * @returns {any} Valore della preferenza
 */
export const getUserPreference = (key) => {
  const preferences = getUserPreferences();
  return preferences[key];
};

/**
 * Tipi di preferenze disponibili
 */
export { PREFERENCE_TYPES };
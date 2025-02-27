// Utility per la gestione dei cookie

/**
 * Imposta un cookie
 * @param {string} name - Nome del cookie
 * @param {string} value - Valore del cookie
 * @param {number} days - Numero di giorni prima della scadenza del cookie
 */
export const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

/**
 * Ottiene il valore di un cookie specifico
 * @param {string} name - Nome del cookie da cercare
 * @returns {string|null} - Valore del cookie o null se non trovato
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

/**
 * Elimina un cookie specifico
 * @param {string} name - Nome del cookie da eliminare
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
};

/**
 * Verifica se il consenso ai cookie è stato dato
 * @returns {boolean} - True se il consenso è stato dato, altrimenti false
 */
export const hasCookieConsent = () => {
  return getCookie('cookie_consent') === 'true';
};

/**
 * Salva il consenso ai cookie
 * @param {boolean} consent - True se l'utente ha accettato i cookie
 */
export const saveCookieConsent = (consent) => {
  setCookie('cookie_consent', consent ? 'true' : 'false', 365); // Conserva per un anno
};

/**
 * Gestisce il token di autenticazione nei cookie
 */
export const authCookies = {
  /**
   * Imposta il token di autenticazione come cookie
   * @param {string} token - Token JWT
   * @param {number} days - Durata del cookie in giorni
   */
  setAuthToken: (token, days = 7) => {
    setCookie('auth_token', token, days);
  },

  /**
   * Ottiene il token di autenticazione dai cookie
   * @returns {string|null} - Token JWT o null se non presente
   */
  getAuthToken: () => {
    return getCookie('auth_token');
  },

  /**
   * Elimina il token di autenticazione
   */
  removeAuthToken: () => {
    deleteCookie('auth_token');
  }
};

/**
 * Gestisce le preferenze utente nei cookie
 */
export const preferenceCookies = {
  /**
   * Salva le preferenze utente
   * @param {Object} preferences - Oggetto contenente le preferenze
   */
  savePreferences: (preferences) => {
    setCookie('user_preferences', JSON.stringify(preferences), 90); // Conserva per 3 mesi
  },

  /**
   * Ottiene le preferenze utente
   * @returns {Object|null} - Oggetto preferenze o null se non presente
   */
  getPreferences: () => {
    const prefs = getCookie('user_preferences');
    return prefs ? JSON.parse(prefs) : null;
  }
};
// Utility per la gestione dei cookie

/**
 * Imposta un cookie
 * @param {string} name - Nome del cookie
 * @param {string} value - Valore del cookie
 * @param {number} days - Numero di giorni prima della scadenza del cookie
 */
export const setCookie = (name, value, days = 7) => {
  // Funzione per impostare un cookie con scadenza

  const date = new Date();
  // Crea un nuovo oggetto data

  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  // Imposta la data di scadenza (data corrente + giorni in millisecondi)

  const expires = `expires=${date.toUTCString()}`;
  // Formatta la data di scadenza nel formato richiesto per i cookie

  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  // Imposta il cookie con nome, valore, scadenza, path e SameSite
  // SameSite=Strict migliora la sicurezza impedendo l'invio del cookie in richieste cross-site
};

/**
 * Ottiene il valore di un cookie specifico
 * @param {string} name - Nome del cookie da cercare
 * @returns {string|null} - Valore del cookie o null se non trovato
 */
export const getCookie = (name) => {
  // Funzione per recuperare il valore di un cookie specifico

  const nameEQ = `${name}=`;
  // Stringa da cercare (nome del cookie seguito da '=')

  const cookies = document.cookie.split(';');
  // Divide la stringa dei cookie in un array di singoli cookie

  for (let i = 0; i < cookies.length; i++) {
    // Itera su ogni cookie

    let cookie = cookies[i];
    // Estrae il cookie corrente

    while (cookie.charAt(0) === ' ') {
      // Rimuove eventuali spazi iniziali

      cookie = cookie.substring(1);
      // Prende la sottostringa dal carattere 1 in poi
    }

    if (cookie.indexOf(nameEQ) === 0) {
      // Se il cookie inizia con nameEQ (nome=)

      return cookie.substring(nameEQ.length);
      // Restituisce il valore dopo "nome="
    }
  }

  return null;
  // Se il cookie non viene trovato, restituisce null
};

/**
 * Elimina un cookie specifico
 * @param {string} name - Nome del cookie da eliminare
 */
export const deleteCookie = (name) => {
  // Funzione per eliminare un cookie

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
  // Sovrascrive il cookie con una data di scadenza nel passato
  // Questo fa sì che il browser lo elimini immediatamente
};

/**
 * Verifica se il consenso ai cookie è stato dato
 * @returns {boolean} - True se il consenso è stato dato, altrimenti false
 */
export const hasCookieConsent = () => {
  // Funzione per verificare se l'utente ha dato consenso ai cookie

  return getCookie('cookie_consent') === 'true';
  // Verifica se esiste un cookie 'cookie_consent' con valore 'true'
};

/**
 * Salva il consenso ai cookie
 * @param {boolean} consent - True se l'utente ha accettato i cookie
 */
export const saveCookieConsent = (consent) => {
  // Funzione per salvare il consenso ai cookie

  setCookie('cookie_consent', consent ? 'true' : 'false', 365); // Conserva per un anno
  // Imposta il cookie 'cookie_consent' con il valore appropriato, con durata di un anno
};

/**
 * Gestisce il token di autenticazione nei cookie
 */
export const authCookies = {
  // Oggetto che fornisce metodi specifici per i cookie di autenticazione

  /**
   * Imposta il token di autenticazione come cookie
   * @param {string} token - Token JWT
   * @param {number} days - Durata del cookie in giorni
   */
  setAuthToken: (token, days = 7) => {
    // Metodo per impostare il token di autenticazione

    setCookie('auth_token', token, days);
    // Utilizza setCookie per impostare il cookie 'auth_token'
  },

  /**
   * Ottiene il token di autenticazione dai cookie
   * @returns {string|null} - Token JWT o null se non presente
   */
  getAuthToken: () => {
    // Metodo per recuperare il token di autenticazione

    return getCookie('auth_token');
    // Utilizza getCookie per ottenere il valore del cookie 'auth_token'
  },

  /**
   * Elimina il token di autenticazione
   */
  removeAuthToken: () => {
    // Metodo per rimuovere il token di autenticazione

    deleteCookie('auth_token');
    // Utilizza deleteCookie per eliminare il cookie 'auth_token'
  }
};

/**
 * Gestisce le preferenze utente nei cookie
 */
export const preferenceCookies = {
  // Oggetto che fornisce metodi specifici per i cookie di preferenze

  /**
   * Salva le preferenze utente
   * @param {Object} preferences - Oggetto contenente le preferenze
   */
  savePreferences: (preferences) => {
    // Metodo per salvare le preferenze dell'utente

    setCookie('user_preferences', JSON.stringify(preferences), 90); // Conserva per 3 mesi
    // Converte l'oggetto preferenze in stringa JSON e lo salva come cookie per 3 mesi
  },

  /**
   * Ottiene le preferenze utente
   * @returns {Object|null} - Oggetto preferenze o null se non presente
   */
  getPreferences: () => {
    // Metodo per recuperare le preferenze dell'utente

    const prefs = getCookie('user_preferences');
    // Ottiene il valore del cookie 'user_preferences'

    return prefs ? JSON.parse(prefs) : null;
    // Se esiste, lo converte da stringa JSON a oggetto, altrimenti restituisce null
  }
};
import React, { useState, useEffect } from 'react';
// Importa React e gli hook useState e useEffect

import { FaCog, FaMoon, FaSun, FaBell, FaBellSlash } from 'react-icons/fa';
// Importa diverse icone dalla libreria react-icons/fa (Font Awesome)

import { getUserPreferences, saveUserPreference, PREFERENCE_TYPES } from '../utils/preferenceUtils';
// Importa utility per gestire le preferenze utente

import '../styles/UserSettings.css';
// Importa gli stili CSS per questo componente

const UserSettings = () => {
  // Definizione del componente UserSettings

  const [showSettings, setShowSettings] = useState(false);
  // Stato per controllare la visibilità del pannello impostazioni

  const [preferences, setPreferences] = useState({});
  // Stato per memorizzare le preferenze dell'utente

  useEffect(() => {
    // Effetto che si attiva quando il componente si monta

    // Carica le preferenze dai cookie
    setPreferences(getUserPreferences());
    // Inizializza lo stato delle preferenze con quelle salvate
  }, []);
  // L'array vuoto di dipendenze indica che questo effetto viene eseguito solo al montaggio

  const toggleSettings = () => {
    // Funzione per mostrare/nascondere il pannello impostazioni

    setShowSettings(!showSettings);
    // Inverte lo stato corrente
  };

  const updatePreference = (key, value) => {
    // Funzione per aggiornare una preferenza specifica

    const updated = saveUserPreference(key, value);
    // Salva la preferenza e ottiene l'oggetto preferenze aggiornato

    setPreferences(updated);
    // Aggiorna lo stato delle preferenze

    // Se l'impostazione è per il tema, applicalo immediatamente
    if (key === PREFERENCE_TYPES.THEME) {
      // Se stiamo cambiando il tema

      document.documentElement.setAttribute('data-theme', value);
      // Applica il tema all'elemento HTML root attraverso l'attributo data-theme
    }
  };

  const toggleTheme = () => {
    // Funzione per cambiare il tema (chiaro/scuro)

    const newTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    // Se il tema corrente è 'dark', passa a 'light', altrimenti passa a 'dark'

    updatePreference(PREFERENCE_TYPES.THEME, newTheme);
    // Aggiorna la preferenza del tema
  };

  const toggleNotifications = () => {
    // Funzione per attivare/disattivare le notifiche

    updatePreference(PREFERENCE_TYPES.NOTIFICATION, !preferences.notification);
    // Inverte lo stato corrente delle notifiche
  };

  return (
    <div className="user-settings">
      {/* Contenitore principale per le impostazioni utente */}

      <button
        className="settings-button"
        onClick={toggleSettings}
        aria-label="Impostazioni utente"
      // Etichetta per lettori di schermo
      >
        <FaCog />
        {/* Icona ingranaggio per le impostazioni */}
      </button>

      {showSettings && (
        // Se showSettings è true, mostra il pannello delle impostazioni

        <div className="settings-panel">
          {/* Pannello delle impostazioni */}

          <h3>Impostazioni</h3>
          {/* Titolo del pannello */}

          <div className="settings-group">
            {/* Gruppo di impostazioni */}

            <div className="settings-item">
              {/* Impostazione per il tema */}

              <span>Tema</span>
              {/* Etichetta dell'impostazione */}

              <button
                className="icon-button"
                onClick={toggleTheme}
                aria-label={`Passa al tema ${preferences.theme === 'dark' ? 'chiaro' : 'scuro'}`}
              // Etichetta accessibile che cambia in base al tema corrente
              >
                {preferences.theme === 'dark' ? <FaSun /> : <FaMoon />}
                {/* Mostra l'icona sole se il tema è scuro, altrimenti l'icona luna */}
              </button>
            </div>

            <div className="settings-item">
              {/* Impostazione per le notifiche */}

              <span>Notifiche</span>
              {/* Etichetta dell'impostazione */}

              <button
                className="icon-button"
                onClick={toggleNotifications}
                aria-label={`${preferences.notification ? 'Disattiva' : 'Attiva'} notifiche`}
              // Etichetta accessibile che cambia in base allo stato delle notifiche
              >
                {preferences.notification ? <FaBell /> : <FaBellSlash />}
                {/* Mostra l'icona campana se le notifiche sono attive, altrimenti l'icona campana barrata */}
              </button>
            </div>
          </div>

          <div className="cookie-management">
            {/* Sezione per la gestione dei cookie */}

            <h4>Gestione Cookie</h4>
            {/* Titolo della sezione */}

            <p>Le tue preferenze vengono salvate nei cookie di questo sito.</p>
            {/* Descrizione informativa */}

            <button
              className="clear-cookies-btn"
              onClick={() => {
                // Funzione anonima eseguita al click

                // Rimuovi i cookie di preferenza e ricarica le impostazioni predefinite
                document.cookie = "user_preferences=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                // Imposta una data di scadenza nel passato per eliminare il cookie

                setPreferences(getUserPreferences());
                // Aggiorna lo stato con le preferenze predefinite
              }}
            >
              Cancella preferenze
              {/* Testo del pulsante */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
// Esporta il componente UserSettings per poterlo utilizzare in altri file
import React, { useState, useEffect } from 'react';
import { FaCog, FaMoon, FaSun, FaBell, FaBellSlash } from 'react-icons/fa';
import { getUserPreferences, saveUserPreference, PREFERENCE_TYPES } from '../utils/preferenceUtils';
import '../styles/UserSettings.css';

const UserSettings = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({});
  
  useEffect(() => {
    // Carica le preferenze dai cookie
    setPreferences(getUserPreferences());
  }, []);
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  const updatePreference = (key, value) => {
    const updated = saveUserPreference(key, value);
    setPreferences(updated);
    
    // Se l'impostazione è per il tema, applicalo immediatamente
    if (key === PREFERENCE_TYPES.THEME) {
      document.documentElement.setAttribute('data-theme', value);
    }
  };
  
  const toggleTheme = () => {
    const newTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreference(PREFERENCE_TYPES.THEME, newTheme);
  };
  
  const toggleNotifications = () => {
    updatePreference(PREFERENCE_TYPES.NOTIFICATION, !preferences.notification);
  };
  
  return (
    <div className="user-settings">
      <button 
        className="settings-button" 
        onClick={toggleSettings}
        aria-label="Impostazioni utente"
      >
        <FaCog />
      </button>
      
      {showSettings && (
        <div className="settings-panel">
          <h3>Impostazioni</h3>
          
          <div className="settings-group">
            <div className="settings-item">
              <span>Tema</span>
              <button 
                className="icon-button" 
                onClick={toggleTheme}
                aria-label={`Passa al tema ${preferences.theme === 'dark' ? 'chiaro' : 'scuro'}`}
              >
                {preferences.theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            
            <div className="settings-item">
              <span>Notifiche</span>
              <button 
                className="icon-button" 
                onClick={toggleNotifications}
                aria-label={`${preferences.notification ? 'Disattiva' : 'Attiva'} notifiche`}
              >
                {preferences.notification ? <FaBell /> : <FaBellSlash />}
              </button>
            </div>
          </div>
          
          <div className="cookie-management">
            <h4>Gestione Cookie</h4>
            <p>Le tue preferenze vengono salvate nei cookie di questo sito.</p>
            <button 
              className="clear-cookies-btn"
              onClick={() => {
                // Rimuovi i cookie di preferenza e ricarica le impostazioni predefinite
                document.cookie = "user_preferences=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setPreferences(getUserPreferences());
              }}
            >
              Cancella preferenze
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
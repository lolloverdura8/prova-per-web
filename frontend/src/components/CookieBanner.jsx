import React, { useEffect, useState } from "react";
import {
  hasCookieConsent,
  saveCookieConsent,
  preferenceCookies,
} from "../utils/cookieUtils";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // obbligatori, non modificabili
    analytics: false,
    marketing: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (!hasCookieConsent()) {
      setShowBanner(true);
    } else {
      const savedPrefs = preferenceCookies.getPreferences();
      if (savedPrefs) {
        setPreferences(savedPrefs);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent(true);
    const allPrefs = { necessary: true, analytics: true, marketing: true };
    preferenceCookies.savePreferences(allPrefs);
    setPreferences(allPrefs);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    saveCookieConsent(false);
    const rejectPrefs = { necessary: true, analytics: false, marketing: false };
    preferenceCookies.savePreferences(rejectPrefs);
    setPreferences(rejectPrefs);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    saveCookieConsent(true);
    preferenceCookies.savePreferences(preferences);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#1c1c1c",
        color: "white",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      {!showPreferences ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <p style={{ margin: 0, maxWidth: "70%" }}>
            Usiamo cookie per migliorare la tua esperienza. Puoi accettare,
            rifiutare o gestire le preferenze.
          </p>
          <div>
            <button onClick={handleRejectAll} style={{ marginRight: "8px" }}>
              Rifiuta
            </button>
            <button onClick={() => setShowPreferences(true)} style={{ marginRight: "8px" }}>
              Gestisci
            </button>
            <button onClick={handleAcceptAll}>Accetta</button>
          </div>
        </div>
      ) : (
        <div>
          <h4>Preferenze cookie</h4>
          <label>
            <input type="checkbox" checked disabled /> Necessari (sempre attivi)
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) =>
                setPreferences((p) => ({ ...p, analytics: e.target.checked }))
              }
            />{" "}
            Analytics
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) =>
                setPreferences((p) => ({ ...p, marketing: e.target.checked }))
              }
            />{" "}
            Marketing
          </label>
          <br />
          <button onClick={() => setShowPreferences(false)} style={{ marginRight: "8px" }}>
            Indietro
          </button>
          <button onClick={handleSavePreferences}>Salva preferenze</button>
        </div>
      )}
    </div>
  );
};

export default CookieBanner;

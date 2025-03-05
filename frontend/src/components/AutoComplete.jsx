import React, { useState, useEffect, useRef } from "react";
// Importa React e gli hook useState, useEffect e useRef

const Autocomplete = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  id
}) => {
  // Definizione del componente Autocomplete che accetta diverse props:
  // - options: array di opzioni disponibili per l'autocompletamento
  // - value: valore corrente dell'input
  // - onChange: funzione da chiamare quando il valore cambia
  // - placeholder: testo segnaposto per l'input
  // - label: etichetta per l'input
  // - id: identificativo unico per l'input

  const [inputValue, setInputValue] = useState(value || '');
  // Stato per il valore dell'input, inizializzato con il value passato o stringa vuota

  const [showSuggestions, setShowSuggestions] = useState(false);
  // Stato per controllare se mostrare il menu dei suggerimenti

  const [filteredOptions, setFilteredOptions] = useState([]);
  // Stato per memorizzare le opzioni filtrate in base all'input

  const [highlightedIndex, setHighlightedIndex] = useState(0);
  // Stato per tenere traccia dell'indice dell'opzione evidenziata

  const inputRef = useRef(null);
  // Riferimento al DOM per l'elemento input

  const suggestionsRef = useRef(null);
  // Riferimento al DOM per il menu dei suggerimenti

  useEffect(() => {
    // Aggiorna il valore visualizzato quando la prop value cambia
    setInputValue(value || '');
  }, [value]);
  // L'effetto si riattiva quando value cambia

  useEffect(() => {
    // Filter options based on input
    if (inputValue.trim() === '') {
      // Se l'input è vuoto o contiene solo spazi

      setFilteredOptions([]);
      // Resetta le opzioni filtrate a un array vuoto
    } else {
      // Se c'è del testo nell'input

      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
        // Filtra le opzioni che contengono il testo dell'input (case-insensitive)
      );

      setFilteredOptions(filtered);
      // Aggiorna le opzioni filtrate

      setHighlightedIndex(0);
      // Resetta l'indice evidenziato alla prima opzione
    }
  }, [inputValue, options]);
  // L'effetto si riattiva quando inputValue o options cambiano

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (e) => {
      // Funzione per gestire i click all'esterno del componente

      if (inputRef.current && !inputRef.current.contains(e.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        // Se il click è avvenuto fuori sia dall'input che dal menu dei suggerimenti

        setShowSuggestions(false);
        // Nasconde il menu dei suggerimenti
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // Aggiunge un event listener per i click sul documento

    return () => {
      // Funzione di pulizia

      document.removeEventListener('mousedown', handleClickOutside);
      // Rimuove l'event listener per evitare memory leak
    };
  }, []);
  // L'effetto si esegue solo al montaggio e smontaggio del componente

  const handleInputChange = (e) => {
    // Funzione per gestire il cambiamento del valore dell'input

    const value = e.target.value;
    // Estrae il nuovo valore dall'evento

    setInputValue(value);
    // Aggiorna lo stato del valore dell'input

    setShowSuggestions(true);
    // Mostra il menu dei suggerimenti
  };

  const handleSelectOption = (option) => {
    // Funzione per gestire la selezione di un'opzione

    setInputValue(option);
    // Imposta il valore dell'input all'opzione selezionata

    onChange(option);
    // Chiama la funzione onChange passata come prop

    setShowSuggestions(false);
    // Nasconde il menu dei suggerimenti
  };

  const handleKeyDown = (e) => {
    // Funzione per gestire la navigazione con tastiera

    // Allow navigation through the suggestions with keyboard
    if (filteredOptions.length === 0) return;
    // Se non ci sono opzioni filtrate, esce dalla funzione

    // Arrow down
    if (e.key === 'ArrowDown') {
      // Se viene premuto il tasto freccia giù

      e.preventDefault();
      // Previene il comportamento predefinito (scorrimento pagina)

      setHighlightedIndex(prev =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
        // Incrementa l'indice evidenziato se non è già sull'ultima opzione
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      // Se viene premuto il tasto freccia su

      e.preventDefault();
      // Previene il comportamento predefinito (scorrimento pagina)

      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
      // Decrementa l'indice evidenziato se non è già sulla prima opzione
    }
    // Enter
    else if (e.key === 'Enter' && showSuggestions) {
      // Se viene premuto il tasto Enter e il menu dei suggerimenti è visibile

      e.preventDefault();
      // Previene il comportamento predefinito (invio form)

      handleSelectOption(filteredOptions[highlightedIndex]);
      // Seleziona l'opzione attualmente evidenziata
    }
    // Escape
    else if (e.key === 'Escape') {
      // Se viene premuto il tasto Escape

      setShowSuggestions(false);
      // Nasconde il menu dei suggerimenti
    }
  };

  return (
    <div className="filter-group">
      {/* Contenitore del gruppo di filtro */}

      {label && <label htmlFor={id}>{label}</label>}
      {/* Renderizza l'etichetta solo se fornita */}

      <input
        ref={inputRef}
        // Collega il riferimento inputRef a questo elemento DOM

        id={id}
        // ID dell'input per il collegamento con l'etichetta

        type="text"
        // Tipo di input

        value={inputValue}
        // Valore controllato dal React state

        onChange={handleInputChange}
        // Associa la funzione handleInputChange all'evento change

        onFocus={() => setShowSuggestions(true)}
        // Mostra i suggerimenti quando l'input riceve il focus

        onKeyDown={handleKeyDown}
        // Associa la funzione handleKeyDown all'evento keydown

        placeholder={placeholder}
        // Testo segnaposto

        autoComplete="off"
      // Disabilita l'autocompletamento nativo del browser
      />

      {showSuggestions && filteredOptions.length > 0 && (
        // Se showSuggestions è true e ci sono opzioni filtrate, mostra il menu dei suggerimenti

        <div
          className="autocomplete-dropdown"
          // Classe CSS per il menu a discesa

          ref={suggestionsRef}
        // Collega il riferimento suggestionsRef a questo elemento DOM
        >
          {filteredOptions.map((option, index) => (
            // Itera su ogni opzione filtrata

            <div
              key={index}
              // Key unica per React

              className={`autocomplete-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              // Classe CSS condizionale: aggiunge 'highlighted' se l'opzione è evidenziata

              onClick={() => handleSelectOption(option)}
            // Associa la funzione handleSelectOption all'evento click
            >
              {option}
              {/* Testo dell'opzione */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
// Esporta il componente Autocomplete per poterlo utilizzare in altri file
import React, { useState, useEffect, useRef } from "react";

const Autocomplete = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  label,
  id
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Aggiorna il valore visualizzato quando la prop value cambia
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    // Filter options based on input
    if (inputValue.trim() === '') {
      setFilteredOptions([]);
    } else {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setHighlightedIndex(0);
    }
  }, [inputValue, options]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target) && 
          suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };

  const handleSelectOption = (option) => {
    setInputValue(option);
    onChange(option);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    // Allow navigation through the suggestions with keyboard
    if (filteredOptions.length === 0) return;
    
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } 
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
    } 
    // Enter
    else if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      handleSelectOption(filteredOptions[highlightedIndex]);
    }
    // Escape
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="filter-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {showSuggestions && filteredOptions.length > 0 && (
        <div 
          className="autocomplete-dropdown" 
          ref={suggestionsRef}
        >
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className={`autocomplete-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
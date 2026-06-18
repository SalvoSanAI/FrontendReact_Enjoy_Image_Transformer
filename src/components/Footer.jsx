import React from 'react';
import Select from 'react-select';
import './Footer.css';

const SUPERHEROES = [
  { value: 'spider-man', label: '🕷️ Spider-Man' },
  { value: 'joker', label: '🤡 Joker' },
  { value: 'race-driver', label: '🏎️ Pilota di Macchine' },
  { value: 'motocross', label: '🏍️ Pilota Motocross' },
  { value: 'mario', label: '🍄 Super Mario' },
  { value: 'luigi', label: '🟢 Luigi' },
  { value: 'hulk', label: '💚 Hulk' },
  { value: 'aladdin', label: '🕌 Aladdino' },
  { value: 'fitness-athlete', label: '💪 Palestrato' },
  { value: 'superman', label: '🦸 Superman' },
  { value: 'pop-star', label: '🎤 Michael Jackson' },
  { value: 'cartoon-mouse', label: '🐭 Topo Gigio' },
  { value: 'luffy', label: '🏴‍☠️ Luffy' },
  { value: 'dark-knight', label: '⚫ Cavaliere Mascherato Nero' },
  { value: 'robin', label: '🐦 Robin' },
  { value: 'batman', label: '🦇 Batman' },
  { value: 'flash', label: '⚡ Flash' },
  { value: 'sponge-char', label: '🧽 Mr. Spugna' },
  { value: 'crazy-doc', label: '🩺 Dottore Matto' },
  { value: 'mad-scientist', label: '🧪 Scienziato Pazzo' },
  { value: 'raven', label: '🟣 Corvina' }
];

const selectStyles = {
  container: (base) => ({ ...base, flex: 1, minWidth: 220 }),
  control: (base, state) => ({
    ...base,
    background: '#12122a',
    border: `2px solid ${state.isFocused ? '#f7c948' : '#2e2e60'}`,
    borderRadius: 10,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(247,201,72,0.2)' : 'none',
    minHeight: 46,
    cursor: 'pointer',
    '&:hover': { borderColor: '#f7c948' },
  }),
  placeholder: (base) => ({ ...base, color: '#6060a0', fontWeight: 600, fontSize: 14 }),
  singleValue: (base) => ({ ...base, color: '#f0f0f8', fontWeight: 700, fontSize: 15 }),
  input: (base) => ({ ...base, color: '#f0f0f8' }),
  menu: (base) => ({
    ...base,
    background: '#1a1a35',
    border: '2px solid #2e2e60',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 1000,
  }),
  menuList: (base) => ({ ...base, padding: 4 }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? 'rgba(247,201,72,0.15)'
      : state.isFocused
      ? 'rgba(76, 201, 240, 0.1)'
      : 'transparent',
    color: state.isSelected ? '#f7c948' : '#f0f0f8',
    fontWeight: state.isSelected ? 700 : 600,
    fontSize: 14,
    borderRadius: 8,
    cursor: 'pointer',
    padding: '8px 12px',
    '&:active': { background: 'rgba(247,201,72,0.2)' },
  }),
  noOptionsMessage: (base) => ({ ...base, color: '#6060a0' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: '#f7c948' }),
  clearIndicator: (base) => ({ ...base, color: '#9090b8' }),
};

function Footer({ selectedHero, onHeroChange, onTransform, onReset, isLoading, hasImage }) {
  // Sicurezza per react-select: se passiamo una stringa invece dell'oggetto, cerchiamo il match corretto
  const currentOption = typeof selectedHero === 'string' 
    ? SUPERHEROES.find(opt => opt.value === selectedHero) 
    : selectedHero;

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-selector">
          <label className="selector-label">
            <span>🎭</span> Scegli il tuo personaggio
          </label>
          <Select
            options={SUPERHEROES}
            value={currentOption}
            onChange={onHeroChange}
            placeholder="Cerca personaggio..."
            isSearchable
            isClearable
            styles={selectStyles}
            noOptionsMessage={() => 'Nessun personaggio trovato'}
            menuPlacement="top"
          />
        </div>

        <div className="footer-actions">
          <button
            className={`btn btn-transform ${isLoading ? 'loading' : ''}`}
            onClick={onTransform}
            disabled={isLoading || !hasImage || !selectedHero}
            title={!hasImage ? 'Carica prima un\'immagine' : !selectedHero ? 'Scegli un personaggio' : 'Trasforma!'}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                <span>In elaborazione...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                <span>TRASFORMA!</span>
              </>
            )}
          </button>

          <button
            className="btn btn-reset"
            onClick={onReset}
            disabled={isLoading}
            title="Reset"
          >
            <span className="btn-icon">🗑️</span>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
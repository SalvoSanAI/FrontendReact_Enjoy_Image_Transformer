import React from 'react';
import Select from 'react-select';
import './Footer.css';

// 10 personaggi epici e divertenti liberi da copyright, ottimizzati per FLUX.2
// const SUPERHEROES = [
//   { value: 'galactic space knight with a glowing laser sword and neon armor', label: '⚔️ Cavaliere Spaziale' },
//   { value: 'retro futuristic cyberpunk hacker with neon glasses and tech jacket', label: '🌐 Hacker Cyberpunk' },
//   { value: 'ancient majestic pharaoh with a golden crown and jeweled collar', label: '👑 Faraone Egizio' },
//   { value: 'mystical fantasy wizard with a glowing staff and embroidered velvet robes', label: '🔮 Mago Supremo' },
//   { value: 'steampunk inventor with brass goggles, gears, and a leather vest', label: '⚙️ Inventore Steampunk' },
//   { value: 'legendary Norse viking warrior with a fur cape and detailed armor', label: '🪓 Guerriero Vichingo' },
//   { value: 'interstellar astronaut in a sleek modern spacesuit with patch details', label: '🚀 Astronauta Esploratore' },
//   { value: 'funny retro cooking chef with a tall white hat and a kitchen apron', label: '👨‍🍳 Chef Stellato' },
//   { value: 'classic elegant royalty king with a velvet red cape and a shiny crown', label: '👑 Re Medievale' },
//   { value: 'cybernetic ninja assassin with sleek carbon fiber armor and glowing mask', label: '🥷 Ninja del Futuro' },
// ];

const SUPERHEROES = [
  { value: 'friendly neighborhood spider hero in a red and blue web-pattern suit with agile pose', label: '🕷️ Spider-Man' },
  { value: 'professional race car driver wearing a modern racing suit, sponsor patches, and helmet', label: '🏎️ Pilota di Macchine' },
  { value: 'extreme motocross rider with protective gear, dirt bike helmet, and action pose', label: '🏍️ Pilota Motocross' },
  { value: 'cheerful video game plumber with red cap, blue overalls, and iconic mustache', label: '🍄 Super Mario' },
  { value: 'tall friendly plumber with green cap, blue overalls, and classic mustache', label: '🟢 Luigi' },
  { value: 'massive green super strong hero with muscular physique and powerful stance', label: '💚 Hulk' },
  { value: 'adventurous desert prince with exotic robes, magic lamp, and Arabian style', label: '🕌 Aladdino' },
  { value: 'extremely muscular fitness athlete with defined physique and gym outfit', label: '💪 Palestrato' },
  { value: 'legendary flying superhero with blue suit, red cape, and heroic pose', label: '🦸 Superman' },
  { value: 'iconic pop music performer with sparkling stage outfit and dance pose', label: '🎤 Michael Jackson' },
  { value: 'cute talking mouse character with friendly smile and classic style', label: '🐭 Topo Gigio' },
  { value: 'young pirate adventurer with straw hat, red vest, and energetic expression', label: '🏴‍☠️ Luffy' },
  { value: 'mysterious dark masked knight wearing black armor, cape, and intimidating presence', label: '⚫ Cavaliere Mascherato Nero' },
  { value: 'young acrobatic superhero sidekick with colorful costume and confident stance', label: '🐦 Robin' },
  { value: 'dark vigilante hero with bat-inspired suit, cape, and utility belt', label: '🦇 Batman' },
  { value: 'super fast hero in a red lightning-themed suit with dynamic running pose', label: '⚡ Flash' },
  { value: 'funny yellow sea sponge character with square shape and cheerful smile', label: '🧽 Mr. Spugna' },
  { value: 'eccentric crazy doctor with wild hair, lab coat, and strange inventions', label: '🩺 Dottore Matto' },
  { value: 'mad scientist with messy hair, futuristic laboratory gadgets, and crazy experiments', label: '🧪 Scienziato Pazzo' },
  { value: 'mysterious dark empath heroine with purple cloak, magical powers, and gothic style', label: '🟣 Corvina' },
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
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        {/* Selector di Personaggi */}
        <div className="footer-selector">
          <label className="selector-label">
            <span>🎭</span> Scegli il tuo personaggio
          </label>
          <Select
            options={SUPERHEROES}
            value={selectedHero}
            onChange={onHeroChange}
            placeholder="Cerca personaggio..."
            isSearchable
            isClearable
            styles={selectStyles}
            noOptionsMessage={() => 'Nessun personaggio trovato'}
            menuPlacement="top"
          />
        </div>

        {/* Action buttons */}
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
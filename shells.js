const SHELLS = [
  { name: 'Scallop', img: 'assets/shells/scallop.png', note: 'Scallops swim by clapping. This one has retired.' },
  { name: 'Sand Dollar', img: 'assets/shells/sand-dollar.png', note: 'Completely intact. Do not ask about the others.' },
  { name: 'Cowrie', img: 'assets/shells/cowrie.png', note: 'These were once used as real money. She is aware of this.' },
  { name: 'Nautilus', img: 'assets/shells/nautilus.png', note: 'A flawless spiral. She will not explain how she found it so fast.' },
  { name: 'Super Extra Rare Mell Shell', img: 'assets/shells/moon-snail.png', note: 'Named after herself. She insists this is standard practice.' },
  { name: 'Auger', img: 'assets/shells/auger.png', note: 'Long, pointy, and somehow unbroken. She carried it very carefully.' },
  { name: 'Tulip Shell', img: 'assets/shells/tulip.png', note: 'A flower that lives in the ocean and refuses to explain itself.' },
  { name: 'Clam', img: 'assets/shells/clam.png', note: 'Sealed shut. Melly tried. Melly will not admit she tried.' },
  { name: 'Starfish', img: 'assets/shells/starfish.png', note: 'Not technically a shell. She is not accepting feedback on this.' }
];

const SAND_CHANCE = 0.2;

const SAND_NOTES = [
  'She’s keeping the good ones today.',
  'She looked right at you when she picked it, too.',
  'She has no further comment.',
  'A generous handful. She seems pleased with herself.',
  'She insists this is fair.'
];

const STORAGE_KEY = 'yariya-bag';

const pick = (list) => list[Math.floor(Math.random() * list.length)];

const article = (word) => ('aeiou'.includes(word[0].toLowerCase()) ? 'an' : 'a');

// Browser storage can throw in private mode or with site data blocked, so the
// bag always falls back to an empty (in-memory) collection rather than breaking.
const loadFound = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (error) {
    return new Set();
  }
};

const saveFound = (found) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...found]));
  } catch (error) {
    /* collection stays in memory for this visit only */
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('.melly-button');
  const dialog = document.querySelector('.shell-dialog');
  if (!trigger || !dialog) return;

  const backdrop = document.querySelector('.shell-backdrop');
  const closeButton = dialog.querySelector('.shell-dialog-close');
  const prizeImage = dialog.querySelector('.shell-prize-img');
  const prizeTitle = dialog.querySelector('.shell-prize-title');
  const prizeNote = dialog.querySelector('.shell-prize-note');

  const grid = document.querySelector('.bag-grid');
  const progress = document.querySelector('.bag-progress');
  const complete = document.querySelector('.bag-complete');
  const resetLink = document.querySelector('.bag-reset');
  let found = loadFound();

  const renderBag = () => {
    grid.textContent = '';
    SHELLS.forEach((shell) => {
      const isFound = found.has(shell.name);
      const slot = document.createElement('div');
      slot.className = isFound ? 'bag-slot' : 'bag-slot locked';

      const image = document.createElement('img');
      image.src = shell.img;
      image.alt = '';
      slot.appendChild(image);

      const label = document.createElement('div');
      label.className = 'bag-label';
      label.textContent = isFound ? shell.name : '???';
      slot.appendChild(label);

      if (!isFound) slot.setAttribute('aria-label', 'Not found yet');
      grid.appendChild(slot);
    });

    const total = SHELLS.length;
    progress.textContent = found.size === total
      ? `${total} of ${total} found — the whole shore!`
      : `${found.size} of ${total} found`;
    complete.hidden = found.size !== total;
    resetLink.hidden = found.size === 0;
  };

  const open = () => {
    const isSand = Math.random() < SAND_CHANCE;
    if (isSand) {
      prizeImage.src = 'assets/shells/sand.png';
      prizeImage.alt = 'A small pile of sand';
      prizeTitle.textContent = 'Melly found you… sand.';
      prizeNote.textContent = pick(SAND_NOTES);
    } else {
      const shell = pick(SHELLS);
      prizeImage.src = shell.img;
      prizeImage.alt = shell.name;
      prizeTitle.textContent = `Melly found you ${article(shell.name)} ${shell.name}!`;
      prizeNote.textContent = shell.note;
      found.add(shell.name);
      saveFound(found);
      renderBag();
    }
    backdrop.hidden = false;
    dialog.hidden = false;
    closeButton.focus();
  };

  const close = () => {
    dialog.hidden = true;
    backdrop.hidden = true;
    trigger.focus();
  };

  resetLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (!confirm('Empty your bag and start collecting again?')) return;
    found = new Set();
    saveFound(found);
    renderBag();
  });

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) close();
  });

  renderBag();
});

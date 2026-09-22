const SHELLS = [
  { name: 'Scallop', img: 'assets/shells/scallop.png', note: 'A perfect fan, ridge for ridge.' },
  { name: 'Sand Dollar', img: 'assets/shells/sand-dollar.png', note: 'Unbroken, which is the rare part.' },
  { name: 'Cowrie', img: 'assets/shells/cowrie.png', note: 'Smooth as a river stone.' },
  { name: 'Nautilus', img: 'assets/shells/nautilus.png', note: 'A spiral that keeps its own time.' },
  { name: 'Super Extra Rare Mell Shell', img: 'assets/shells/moon-snail.png', note: 'Round, pearly, and a little bit lavender.' },
  { name: 'Auger', img: 'assets/shells/auger.png', note: 'Long, delicate, and somehow still in one piece.' },
  { name: 'Tulip Shell', img: 'assets/shells/tulip.png', note: 'Named for a flower, found in the surf.' },
  { name: 'Clam', img: 'assets/shells/clam.png', note: 'Closed tight, keeping its secrets.' },
  { name: 'Starfish', img: 'assets/shells/starfish.png', note: 'Not technically a shell. Melly does not care.' }
];

const SAND_CHANCE = 0.2;

const SAND_NOTES = [
  'She’s keeping the good ones today.',
  'She looked right at you when she picked it, too.',
  'She has no further comment.',
  'A generous handful. She seems pleased with herself.',
  'She insists this is fair.'
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

const article = (word) => ('aeiou'.includes(word[0].toLowerCase()) ? 'an' : 'a');

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('.melly-button');
  const dialog = document.querySelector('.shell-dialog');
  if (!trigger || !dialog) return;

  const backdrop = document.querySelector('.shell-backdrop');
  const closeButton = dialog.querySelector('.shell-dialog-close');
  const prizeImage = dialog.querySelector('.shell-prize-img');
  const prizeTitle = dialog.querySelector('.shell-prize-title');
  const prizeNote = dialog.querySelector('.shell-prize-note');

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

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) close();
  });
});

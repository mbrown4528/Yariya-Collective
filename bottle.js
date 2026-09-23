const BOTTLE_NOTES = [
  'Whatever you are making, make it badly first. That is how it gets made at all.',
  'The tide does not rush. It just keeps coming back.',
  'Somebody out there would love the thing you keep not starting.',
  'You are allowed to make something purely because it would be nice to look at.',
  'Melly found this one near the rocks. She read it first. She says it is fine.',
  'Collect small things. Pretty rocks count. So do good sentences.',
  'Not every day has to be productive. Some days are for sitting in the sun.',
  'The sea has done the same thing for four billion years and nobody calls it repetitive.',
  'Your unfinished project is not judging you. It is waiting.',
  'Take the long way home if the light is good.',
  'Someone is quietly rooting for you. Possibly a seal.',
  'Hermit crabs line up by size to swap shells so everyone gets a better home. Be like the crabs.',
  'If it made you happy to make, it was worth making.',
  'Start the thing. The tide is coming in either way.',
  'You do not have to pick one lane. Somebody around here made her own.',
  'Rest is not the opposite of work. Ask the sand.',
  'Be kind to the version of you who is still figuring it out.',
  'Nothing on the shore matches. That is the whole appeal.',
  'Seals sleep upright in the water so they do not drift away. Anchor yourself somewhere good.',
  'The best shells are usually underneath the ugly ones.',
  'Do the small version today. The big version can wait.',
  'Melly would like it noted that she carried this bottle a very long way.',
  'Go outside at least once. The sky is doing something.',
  'Whatever washed up today, you can put it back tomorrow.',
  'You found a bottle on the internet. That is a good sign about your day.',
  'Message in a bottle: an extremely slow and unreliable way to text someone. Anyway, hello.',
  'Melly wrote this one herself. It took all day. She would like that acknowledged.',
  'A crab reviewed this note and gave it four stars. He declined to elaborate.',
  'The seagulls have opinions about your life. Ignore them. They eat garbage.',
  'This was written by a seal with no hands. Please adjust your expectations accordingly.'
];

const BOTTLE_KEY = 'yariya-bottle';

// A shuffle bag: every note appears once before any repeats, and the
// remaining order is remembered between visits.
const loadBag = () => {
  try {
    const raw = localStorage.getItem(BOTTLE_KEY);
    const bag = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(bag)) return null;
    return bag.filter((i) => Number.isInteger(i) && i >= 0 && i < BOTTLE_NOTES.length);
  } catch (error) {
    return null;
  }
};

const saveBag = (bag) => {
  try {
    localStorage.setItem(BOTTLE_KEY, JSON.stringify(bag));
  } catch (error) {
    /* the bag just resets next visit */
  }
};

const shuffledBag = () => {
  const order = BOTTLE_NOTES.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
};

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('.bottle-button');
  const dialog = document.querySelector('.bottle-dialog');
  if (!trigger || !dialog) return;

  const backdrop = document.querySelector('.bottle-backdrop');
  const noteText = dialog.querySelector('.bottle-note');
  const againButton = dialog.querySelector('.bottle-again');
  const closeButton = dialog.querySelector('.bottle-close');
  let bag = loadBag();

  const drawNote = () => {
    if (!bag || bag.length === 0) bag = shuffledBag();
    const index = bag.pop();
    saveBag(bag);
    noteText.textContent = BOTTLE_NOTES[index];
  };

  const open = () => {
    drawNote();
    backdrop.hidden = false;
    dialog.hidden = false;
    againButton.focus();
  };

  const close = () => {
    dialog.hidden = true;
    backdrop.hidden = true;
    trigger.focus();
  };

  trigger.addEventListener('click', open);
  againButton.addEventListener('click', drawNote);
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) close();
  });
});

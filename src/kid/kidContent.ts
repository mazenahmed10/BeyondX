export interface Gear {
  name: string
  icon: string
  text: string
}
export interface Place {
  intro: string
  gear: Gear[]
}

/** Kid-friendly text for Cosmo's bubble. Same facts as the adult stories, simpler words. */
export const PLACES: Record<string, Place> = {
  hub: {
    intro:
      "Hi explorer! I'm Cosmo the astronaut! Pick the Moon, Mars or Deep Space and I'll show you the cool machines people left up there!",
    gear: [
      { name: 'Why machines?', icon: '🤖', text: 'Space is far away, cold and tricky. So we send robots and machines first. They explore for us and send pictures home!' },
    ],
  },
  moon: {
    intro: 'Welcome to the Moon! Astronauts and robots left amazing machines here. See the glowing star markers? Tap one and we will solve the mystery together!',
    gear: [
      { name: 'Moon buggy', icon: '🚙', text: 'The lunar rover is a battery-powered moon car. Apollo 15, 16 and 17 astronauts drove it to explore farther than walking!' },
      { name: 'Laser mirror', icon: '🪞', text: 'Some Apollo missions left special mirrors. Scientists on Earth shine lasers at them to measure how far away the Moon is!' },
      { name: 'Lander legs', icon: '🦵', text: 'The lander had two halves. The bottom half stayed on the Moon, and the top half carried the astronauts home!' },
    ],
  },
  mars: {
    intro: 'This is Mars, the red planet! Only robots have visited, never people. Tap a glowing star marker and let us find out who is hiding there!',
    gear: [
      { name: 'Sojourner', icon: '🛞', text: 'Sojourner was the first rover to drive on Mars, in 1997. It was a tiny robot, about as big as a microwave oven!' },
      { name: 'Spirit & Opportunity', icon: '👯', text: 'These twin rovers were robot geologists. Opportunity worked for about fourteen years until a huge dust storm in 2018 blocked its sunlight!' },
      { name: 'Viking landers', icon: '📡', text: 'Two Viking landers touched down in 1976. They took the first pictures from the ground of Mars and tested the soil!' },
    ],
  },
  deep: {
    intro: "Deep Space! It's super far out here. Five spacecraft traveled this way. Choose one and I'll tell you all about it!",
    gear: [{ name: 'Spacecraft', icon: '🛰️', text: 'Each spacecraft is a robot explorer with cameras, antennas and solar panels or a nuclear battery. Pick a mission to meet one!' }],
  },
  dawn: {
    intro: 'This is Dawn! It visited two giant space rocks, Vesta and Ceres. Tap a part to learn about it!',
    gear: [
      { name: 'Ion engine', icon: '💙', text: 'Dawn used ion engines. They glow blue and push very gently by shooting out xenon gas. A gentle push for a long time makes it very fast!' },
      { name: 'Solar wings', icon: '☀️', text: 'Dawn has huge solar panels like wings. They turn sunlight into electricity to run everything!' },
      { name: 'Camera', icon: '📷', text: 'Dawn took close-up pictures of Vesta and Ceres. When its fuel ran out in 2018, it stayed in orbit around Ceres!' },
    ],
  },
  'near-shoemaker': {
    intro: 'Meet NEAR Shoemaker! It went to an asteroid named Eros. Tap a part to hear its story!',
    gear: [
      { name: 'Camera', icon: '📷', text: 'NEAR took thousands of pictures of the potato-shaped asteroid Eros, showing craters and big boulders!' },
      { name: 'Laser ruler', icon: '📏', text: 'A laser rangefinder bounced light off Eros to measure its bumps and valleys, like a space ruler!' },
      { name: 'Surprise landing', icon: '🎯', text: 'NEAR was built to orbit, not land. But in 2001 it touched down on Eros anyway and kept talking to Earth. Hooray!' },
    ],
  },
  'pioneer-10': {
    intro: 'This is Pioneer 10! It was the first spacecraft to fly through the asteroid belt and visit Jupiter!',
    gear: [
      { name: 'Golden plaque', icon: '🏅', text: 'Pioneer carries a gold plaque with a drawing of a man, a woman, and where Earth is. It is a hello card for aliens!' },
      { name: 'Big dish', icon: '📡', text: 'The big round dish is an antenna. It sent messages across billions of kilometers back to Earth!' },
      { name: 'Nuclear battery', icon: '🔋', text: 'Far from the Sun, solar panels do not work well. So Pioneer used a nuclear battery that makes power for years!' },
    ],
  },
  'pioneer-11': {
    intro: 'Hello from Pioneer 11! It is the twin of Pioneer 10, but it went on its own trip. It visited Jupiter and then Saturn!',
    gear: [
      { name: 'Golden plaque', icon: '🏅', text: 'Pioneer 11 also carries a gold plaque showing humans and our home, in case someone out there finds it!' },
      { name: 'Big dish', icon: '📡', text: 'Its dish antenna talked to Earth. In 1979 it sent the first close-up pictures of Saturn!' },
      { name: 'Nuclear battery', icon: '🔋', text: 'A tiny nuclear power source kept the spacecraft warm and working far from the Sun!' },
    ],
  },
  kepler: {
    intro: 'This is the Kepler space telescope! Its job was to look for planets around other stars. Tap a part!',
    gear: [
      { name: 'Giant camera', icon: '📸', text: 'Kepler stared at about 150,000 stars at once, watching for tiny dips in brightness when a planet crossed in front!' },
      { name: 'Planet finder', icon: '🪐', text: 'Using those dips, Kepler helped discover thousands of planets around other stars. Our galaxy is full of worlds!' },
      { name: 'Last fuel', icon: '⛽', text: 'Kepler followed Earth around the Sun, not around Earth. In 2018 it ran out of fuel and its mission ended. Thank you, Kepler!' },
    ],
  },
}

export interface Question {
  q: string
  options: string[]
  answer: number
  hint: string
}

export const QUIZ: Question[] = [
  { q: 'What did astronauts drive on the Moon?', options: ['A bicycle', 'A lunar rover', 'A submarine'], answer: 1, hint: 'It was a battery-powered moon buggy!' },
  { q: 'What is the name of the first rover that drove on Mars?', options: ['Sojourner', 'Pioneer', 'Kepler'], answer: 0, hint: 'It was about as big as a microwave oven.' },
  { q: 'What does the Dawn spacecraft use to push itself along?', options: ['Wheels', 'Sails', 'Ion engines that glow blue'], answer: 2, hint: 'They shoot out xenon gas.' },
  { q: 'What did the Kepler telescope look for?', options: ['Planets around other stars', 'Pizza', 'Volcanoes on Earth'], answer: 0, hint: 'Think about worlds far, far away.' },
  { q: 'What is on the Pioneer spacecraft as a message for aliens?', options: ['A golden plaque', 'A pizza menu', 'A teddy bear'], answer: 0, hint: 'It shines like gold!' },
  { q: 'Which asteroid did NEAR Shoemaker land on?', options: ['Eros', 'Earth', 'Saturn'], answer: 0, hint: 'It was shaped like a potato.' },
  { q: 'Why do Pioneer spacecraft use nuclear batteries?', options: ['It is too far from the Sun for solar panels', 'They like batteries', 'To look cool'], answer: 0, hint: 'Sunlight is very weak far away.' },
  { q: 'Why do we send robots to space first?', options: ['Robots are bored', 'Space is far and tricky, so they explore for us', 'Robots love cold'], answer: 1, hint: 'Remember what Cosmo said at the start!' },
]

/**
 * Cosmo's reactions during a Discover-a-Story run. Picked at random so the guide does not repeat.
 * Friendly and funny, never mocking: a wrong guess is still good detective work.
 */
export const COSMO = {
  found: [
    'Whoa! You found something REALLY old!',
    'Ooh, a mystery! Let me get my detective helmet on.',
    'Look at that! What could it be? I am so curious!',
    'Beep beep! My mystery-detector is going wild!',
  ],
  listen: ['Hmm, I am listening… what is your guess?', 'Take your time, explorer. I am all ears! Well… all helmet.', 'What do YOU think it is?'],
  right: ['Great detective work, space explorer!', 'YES! You got it! High five! …Oh wait, big gloves.', 'Wow, you are a real space expert!'],
  wrong: ['Good guess! The real answer is even cooler. Look!', 'Nice try, explorer! Even astronauts guess wrong sometimes.', 'Ooh, not quite. But now you will never forget it!'],
  skipped: ['No guessing today? No problem. Ta-daaa!', 'Okay! Let me show you. Drum roll, please…'],
  reveal: ['Wait… this machine came all the way from Earth?!', 'Ta-daaa! Mystery solved!', 'There it is! Isn\'t it amazing?'],
  step: ['Ooh, listen to this part!', 'Keep going, this is the good bit!', 'I love this part of the story.', 'Wow. Just… wow.', 'Did you know that? I did not know that!'],
  done: ['You finished the whole story! You earned a discovery star!', 'Mission complete, explorer! Ready to find another one?', 'Another mystery solved. You are unstoppable!'],
}

export const pickLine = (lines: string[]): string => lines[Math.floor(Math.random() * lines.length)]

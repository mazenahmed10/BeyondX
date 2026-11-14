import { AUDIO } from './audio'
import type { Story, StorySource } from './types'

const COLLECTION = 'Deep Space'
const DEEP_MODEL = {
  kind: 'deep-existing' as const,
  note: 'Uses the existing Deep Space scene model: a simplified visual reconstruction, not an official NASA model.',
}

const SRC = {
  pioneer10: { title: 'Pioneer 10', url: 'https://science.nasa.gov/mission/pioneer-10/', publisher: 'NASA Science' },
  pioneer11: { title: 'Pioneer 11', url: 'https://science.nasa.gov/mission/pioneer-11/', publisher: 'NASA Science' },
  near: { title: 'NEAR Shoemaker', url: 'https://science.nasa.gov/mission/near-shoemaker/', publisher: 'NASA Science' },
  dawn: { title: 'Dawn', url: 'https://science.nasa.gov/mission/dawn/', publisher: 'NASA Science' },
  kepler: { title: 'Kepler / K2', url: 'https://science.nasa.gov/mission/kepler/', publisher: 'NASA Science' },
} satisfies Record<string, StorySource>

/** Story ids equal the existing Deep Space mission ids, so the two data layers stay linked. */
const pioneer10: Story = {
  id: 'pioneer-10',
  world: 'deep-space',
  collection: COLLECTION,
  mission: 'Pioneer 10',
  equipmentName: 'Pioneer 10',
  equipmentType: 'flyby-probe',
  title: 'The First Pioneer Beyond Jupiter',
  subtitle: 'Pioneer 10 · launched March 2, 1972',
  kidsStory: {
    hook: 'A spacecraft with a big round dish is drifting through the dark, very far from home. It is carrying a secret message. Who is the message for?',
    steps: {
      what: { text: 'This is Pioneer 10! Its journey began in 1972. It is a robot explorer with a big dish for talking to Earth and long arms sticking out.' },
      why: { text: 'Its mission was to explore Jupiter, the biggest planet in our solar system. Nobody had ever sent a spacecraft that far before!' },
      did: { text: 'First it had to cross the asteroid belt, a zone full of space rocks. People worried it might crash. It made it through safely! Then, in December 1973, it became the first spacecraft to fly close to Jupiter and take close-up pictures.' },
      discovered: { text: 'It studied Jupiter\'s stormy clouds, its moons, and the invisible belts of radiation around it. Jupiter\'s radiation turned out to be super strong!' },
      happened: { text: 'After Jupiter, Pioneer 10 just kept going… and going. It is leaving our solar system forever. Its signal got weaker and weaker, and the last whisper reached Earth in January 2003.' },
      matters: { text: 'It carries the Pioneer Plaque, a plate of gold-coloured aluminium with a drawing of two humans and a map showing where Earth is. It is a hello card from all of us, for anyone who may find it one day!' },
    },
  },
  adultsStory: {
    hook: 'A dish antenna on a hexagonal body, two booms carrying nuclear generators: a machine built to work where sunlight is too weak to power it.',
    steps: {
      what: { text: 'Pioneer 10 was a spin-stabilised NASA spacecraft launched on March 2, 1972. Its 2.7 m dish antenna kept it in contact with Earth, and radioisotope thermoelectric generators on two booms supplied power far from the Sun.' },
      why: { text: 'No spacecraft had yet ventured beyond Mars. Pioneer 10 was sent to find out whether the asteroid belt could be crossed safely and to make the first close observations of Jupiter.' },
      did: { text: 'It became the first spacecraft to traverse the asteroid belt, emerging unharmed, and in December 1973 made the first flyby of Jupiter, returning images and measurements from within the planet\'s intense radiation environment.' },
      discovered: { text: 'It studied Jupiter\'s atmosphere, magnetic field, radiation belts and moons. It showed that the radiation near Jupiter was far more severe than expected, and that the asteroid belt was not the barrier some had feared.' },
      happened: { text: 'Jupiter\'s gravity flung it onto a path out of the solar system. Routine science operations ended on March 31, 1997, as its power declined. The last, very weak signal was received in January 2003. These are separate events: end of the science mission, and last contact. It was not destroyed; it is still travelling outward, silent.' },
      matters: { text: 'Pioneer 10 carries the Pioneer Plaque, a gold-anodised aluminium plate showing human figures and the position of the Sun and Earth. Its flight proved the route and helped pave the way for later exploration of the outer planets, including Voyager.' },
    },
  },
  guess: {
    question: 'What do you think this spacecraft was sent to do?',
    kidQuestion: 'Where do you think this spacecraft was going?',
    options: ['Land on Jupiter', 'Fly past Jupiter and send back the first close-up views', 'Bring pieces of Jupiter back to Earth'],
    answer: 1,
    explain: 'Pioneer 10 flew past Jupiter in December 1973. It did not land (Jupiter has no solid surface to land on) and it did not return.',
  },
  facts: [
    { label: 'Launch', value: 'March 2, 1972' },
    { label: 'Firsts', value: 'First spacecraft through the asteroid belt; first Jupiter flyby (December 1973)' },
    { label: 'Studied', value: "Jupiter's atmosphere, magnetic field, radiation belts and moons" },
    { label: 'Carries', value: 'The Pioneer Plaque (gold-anodised aluminium)' },
  ],
  timeline: [
    { date: 'March 2, 1972', kind: 'LAUNCH', text: 'Pioneer 10 launches.' },
    { date: 'December 1973', kind: 'MILESTONE', text: 'First flyby of Jupiter.' },
    { date: 'March 31, 1997', kind: 'OPERATIONS END', text: 'Routine science operations end.' },
    { date: 'January 2003', kind: 'LAST CONTACT', text: 'Last signal received on Earth.' },
  ],
  fate: {
    status: 'leaving-solar-system',
    headline: 'Silent, and still travelling outward',
    summary: 'Pioneer 10 was not disposed of and did not crash. It is on a trajectory that is taking it out of the solar system. Last signal received: January 2003.',
    kidSummary: 'It is still flying away into deep space, carrying its hello card. It just cannot call home any more.',
  },
  missionStatus: 'Mission complete. Last signal January 2003. Leaving the solar system.',
  location: 'Interstellar-bound trajectory, beyond the planets',
  coordinates: null,
  locationAccuracy: 'not-applicable',
  model: DEEP_MODEL,
  assets: [],
  audio: AUDIO.pioneer,
  sources: [SRC.pioneer10],
}

const pioneer11: Story = {
  id: 'pioneer-11',
  world: 'deep-space',
  collection: COLLECTION,
  mission: 'Pioneer 11',
  equipmentName: 'Pioneer 11',
  equipmentType: 'flyby-probe',
  title: 'The Pioneer That Reached Saturn',
  subtitle: 'Pioneer 11 · launched April 1973',
  kidsStory: {
    hook: 'This spacecraft looks just like its sister, with a big dish and long arms. But it took its own path, all the way to a planet with rings!',
    steps: {
      what: { text: 'This is Pioneer 11! It blasted off in 1973, one year after its sister ship. It looks the same, but it had its very own adventure.' },
      why: { text: 'Its job was to visit Jupiter, and then to try something brand new: travel on to Saturn, the planet with the beautiful rings.' },
      did: { text: 'Pioneer 11 zoomed past Jupiter in 1974. Jupiter\'s gravity gave it a giant push, like a slingshot, and sent it flying across the solar system. In 1979 it became the first spacecraft ever to visit Saturn!' },
      discovered: { text: 'It took close-up pictures of Saturn and its rings, and helped scientists learn more about the giant planets. It even found a ring nobody had seen before!' },
      happened: { text: 'After Saturn, Pioneer 11 headed out of the solar system. Its power slowly ran low, and its last message reached Earth in 1995. It is still out there, coasting through the dark.' },
      matters: { text: 'Like its sister, it carries a Pioneer Plaque, the message that tells the universe about humans and planet Earth. Two hello cards, flying in two different directions!' },
    },
  },
  adultsStory: {
    hook: 'The twin of an earlier explorer, sent a year later on a bolder route: past one giant planet, and across the solar system to another.',
    steps: {
      what: { text: 'Pioneer 11 was the sister spacecraft of Pioneer 10, launched in April 1973 (April 5 in the United States). It shared the same design: a dish antenna, a compact equipment bay and nuclear power sources on booms.' },
      why: { text: 'It was sent to make a second, closer pass of Jupiter and, if that succeeded, to use the planet\'s gravity to reach Saturn, a world no spacecraft had visited.' },
      did: { text: 'It flew past Jupiter in December 1974, passing much closer than Pioneer 10. Jupiter\'s gravity redirected it across the solar system, and in September 1979 it performed the first flyby of Saturn.' },
      discovered: { text: 'It studied Saturn and its environment: the planet\'s magnetic field, its rings and its moons. It identified an additional ring, and tested the ring-plane crossing route later used by the Voyager spacecraft.' },
      happened: { text: 'After Saturn it continued outward on a path leaving the solar system. With too little power left to run its instruments, routine operations ended in 1995, and the last contact came later that year. It was not destroyed; it continues to coast outward, silent.' },
      matters: { text: 'Pioneer 11 carries a Pioneer Plaque like that of Pioneer 10. It turned a Jupiter mission into humanity\'s first visit to Saturn and proved the gravity-assist route that later outer-planet missions relied on.' },
    },
  },
  guess: {
    question: 'What do you think made this spacecraft different from its twin?',
    kidQuestion: 'Which ringed planet did this one visit?',
    options: ['It was the first to fly past Saturn', 'It was the first to land on Mars', 'It was the first to orbit the Moon'],
    answer: 0,
    explain: 'Pioneer 11 flew past Jupiter and then became the first spacecraft to fly past Saturn, in 1979.',
  },
  facts: [
    { label: 'Launch', value: 'April 1973' },
    { label: 'Flybys', value: 'Jupiter (December 1974), then Saturn (September 1979)' },
    { label: 'First', value: 'First spacecraft to fly past Saturn' },
    { label: 'Carries', value: 'A Pioneer Plaque similar to that of Pioneer 10' },
  ],
  timeline: [
    { date: 'April 1973', kind: 'LAUNCH', text: 'Pioneer 11 launches.' },
    { date: 'December 1974', kind: 'MILESTONE', text: 'Flyby of Jupiter.' },
    { date: 'September 1979', kind: 'MILESTONE', text: 'First flyby of Saturn.' },
    { date: '1995', kind: 'LAST CONTACT', text: 'Routine operations end; last contact later the same year.' },
  ],
  fate: {
    status: 'leaving-solar-system',
    headline: 'Silent, coasting out of the solar system',
    summary: 'Pioneer 11 did not crash and was not disposed of. It is on a trajectory out of the solar system. Last contact: 1995.',
    kidSummary: 'It is still coasting through space, far past the planets, with its hello card on board.',
  },
  missionStatus: 'Mission complete. Last contact 1995. Leaving the solar system.',
  location: 'Interstellar-bound trajectory, beyond the planets',
  coordinates: null,
  locationAccuracy: 'not-applicable',
  model: DEEP_MODEL,
  assets: [],
  audio: AUDIO.pioneer,
  sources: [SRC.pioneer11],
}

const near: Story = {
  id: 'near-shoemaker',
  world: 'deep-space',
  collection: COLLECTION,
  mission: 'NEAR Shoemaker',
  equipmentName: 'NEAR Shoemaker',
  equipmentType: 'asteroid-orbiter',
  title: 'The First Visitor to an Asteroid',
  subtitle: 'NEAR Shoemaker · Asteroid 433 Eros · 1996–2001',
  kidsStory: {
    hook: 'A little spacecraft is sitting on a giant space rock shaped like a potato. Funny thing… this spacecraft has no legs. It was never supposed to land!',
    steps: {
      what: { text: 'This is NEAR Shoemaker! It was launched in 1996 to visit a giant space rock called Eros. Eros is an asteroid: a rocky object that travels around the Sun.' },
      why: { text: 'Asteroids are leftovers from when the planets were made, like crumbs from baking a cake. Studying one up close tells us how our solar system began.' },
      did: { text: 'NEAR travelled for four years. In the year 2000 it reached Eros and started circling it. It was the first spacecraft ever to orbit an asteroid! It took thousands of pictures of the bumpy, cratered surface.' },
      discovered: { text: 'It measured the shape of Eros and what it is made of. It found that Eros is one solid chunk of very old rock, covered in craters, boulders and dust.' },
      happened: { text: 'Then, in 2001, something special happened! Even though landing was never part of the plan, the team gently lowered NEAR onto Eros. It survived, and kept sending data from the surface!' },
      matters: { text: 'NEAR showed that we can visit small space rocks and even touch them. It is still sitting on Eros right now, riding around the Sun.' },
    },
  },
  adultsStory: {
    hook: 'A boxy orbiter with four solar panels, resting on the dusty saddle of an elongated asteroid. It has no landing gear.',
    steps: {
      what: { text: 'NEAR (Near Earth Asteroid Rendezvous) was a NASA spacecraft launched on February 17, 1996. It was renamed NEAR Shoemaker in honour of planetary scientist Eugene Shoemaker. Its target was 433 Eros, a near-Earth asteroid.' },
      why: { text: 'Asteroids preserve material from the formation of the solar system. NEAR was sent to make the first long, close study of one: its shape, surface, composition and internal structure.' },
      did: { text: 'In February 2000 it entered orbit around Eros, becoming the first spacecraft to orbit an asteroid. For a year it mapped the surface with its camera, laser rangefinder and spectrometers from progressively lower orbits.' },
      discovered: { text: 'Its measurements showed Eros to be a consolidated, heavily cratered body rather than a loose pile of rubble, with a composition similar to ordinary chondrite meteorites: a physical link between asteroids and the most common meteorites that fall on Earth.' },
      happened: { text: 'On February 12, 2001, at the end of its mission, controllers guided it down to the surface. Landing was not part of the original mission design, and the spacecraft had no landing gear, yet it survived the touchdown and kept transmitting data from the surface. Contact ended on February 28, 2001. Landing and last contact are separate events.' },
      matters: { text: 'NEAR Shoemaker demonstrated that a spacecraft can rendezvous with, orbit and even land on a small body. It remains on Eros, and its legacy runs through every asteroid mission since.' },
    },
  },
  guess: {
    question: 'What do you think this spacecraft did first in history?',
    kidQuestion: 'What amazing first did this spacecraft do?',
    options: ['It was the first to orbit an asteroid', 'It was the first to reach another star', 'It was the first to fly through the Sun'],
    answer: 0,
    explain: 'In February 2000 NEAR Shoemaker became the first spacecraft to orbit an asteroid, 433 Eros. A year later it landed there too.',
  },
  facts: [
    { label: 'Launch', value: 'February 17, 1996' },
    { label: 'Target', value: 'Asteroid 433 Eros' },
    { label: 'Orbit insertion', value: 'February 2000: first spacecraft to orbit an asteroid' },
    { label: 'Landing', value: 'February 12, 2001 (not part of the original mission design)' },
    { label: 'After landing', value: 'Continued transmitting data from the surface' },
  ],
  timeline: [
    { date: 'February 17, 1996', kind: 'LAUNCH', text: 'NEAR launches.' },
    { date: 'February 2000', kind: 'ARRIVAL', text: 'Enters orbit around 433 Eros.' },
    { date: 'February 12, 2001', kind: 'LANDING', text: 'Touches down on Eros and keeps transmitting.' },
    { date: 'February 28, 2001', kind: 'LAST CONTACT', text: 'Final contact; the mission ends.' },
  ],
  fate: {
    status: 'on-asteroid',
    headline: 'Resting on the surface of Eros',
    summary: 'NEAR Shoemaker landed on 433 Eros on February 12, 2001 and remains there. Last contact: February 28, 2001.',
    kidSummary: 'It is still sitting on the asteroid Eros, going round and round the Sun.',
  },
  missionStatus: 'Mission complete (2001). Remains on asteroid 433 Eros.',
  location: 'Surface of asteroid 433 Eros',
  coordinates: null,
  locationAccuracy: 'not-applicable',
  model: DEEP_MODEL,
  assets: [],
  audio: AUDIO.near,
  sources: [SRC.near],
}

const dawn: Story = {
  id: 'dawn',
  world: 'deep-space',
  collection: COLLECTION,
  mission: 'Dawn',
  equipmentName: 'Dawn',
  equipmentType: 'orbiter',
  title: 'The Explorer of Two Worlds',
  subtitle: 'Dawn · Vesta and Ceres · 2007–2018',
  kidsStory: {
    hook: 'A spacecraft with two huge wings is gliding around a grey, round world with strange shiny spots on it. It never touches the ground. It just circles, and looks.',
    steps: {
      what: { text: 'This is Dawn! It set off in 2007 with giant solar wings and special engines that glow blue. Those engines push very gently, but they never get tired.' },
      why: { text: 'Dawn went to study TWO worlds inside the asteroid belt: Vesta and Ceres. Looking at them is like looking at baby pictures of the planets.' },
      did: { text: 'First Dawn visited Vesta, a big rocky world with huge craters and mountains. Then it did something no spacecraft had done: it left, and flew on to a second world, Ceres!' },
      discovered: { text: 'Ceres is a dwarf planet. Dawn spotted bright, shiny spots on it. What were they? Lights? Ice? Scientists found out they are salt deposits, left behind by salty water from below!' },
      happened: { text: 'Dawn never landed on Vesta or Ceres. It studied both from orbit, circling like a watchful bird. In 2018 it ran out of fuel for pointing itself, and went quiet. It is still circling Ceres today.' },
      matters: { text: 'Two destinations, one spacecraft, and so many discoveries! Dawn showed us that even small worlds can have water, salt and surprises.' },
    },
  },
  adultsStory: {
    hook: 'A spacecraft with a 20-metre span of solar arrays, held in a quiet orbit above a dark, cratered dwarf planet marked by brilliant white patches.',
    steps: {
      what: { text: 'Dawn was a NASA spacecraft launched on September 27, 2007. Its large solar arrays powered ion engines: thrusters of very low force but exceptional efficiency, able to run for years.' },
      why: { text: 'Vesta and Ceres are two of the largest bodies in the asteroid belt and survivors from the era of planet formation, one dry and rocky, the other rich in water-bearing material. Dawn was sent to compare them.' },
      did: { text: 'It entered orbit around Vesta in 2011 and mapped its surface, geology and composition. It then departed and in 2015 reached Ceres, becoming the first spacecraft to orbit a dwarf planet, and the first to orbit two different extraterrestrial bodies.' },
      discovered: { text: 'At Ceres it studied the bright areas in Occator Crater and identified them as salt-rich deposits, left by briny water that reached the surface. It found evidence of water-related materials and of past, geologically recent activity.' },
      happened: { text: 'Dawn never landed on Vesta or Ceres; every observation was made from orbit. In 2018 it exhausted the hydrazine used to control its orientation and could no longer point its antenna at Earth or its arrays at the Sun. NASA declared the mission over on November 1, 2018. The spacecraft was left in a stable orbit around Ceres, chosen so that it will not reach the surface for decades.' },
      matters: { text: 'By studying both Vesta and Ceres with one set of instruments, Dawn gave a direct comparison of two paths of planetary formation, and showed that a small world can host water and active chemistry.' },
    },
  },
  guess: {
    question: 'How do you think this spacecraft studied its two worlds?',
    kidQuestion: 'How did this spacecraft explore two worlds?',
    options: ['It landed on both and drove around', 'It scooped up samples and flew them home', 'It orbited both and studied them from above'],
    answer: 2,
    explain: 'Dawn orbited Vesta, then Ceres. It never landed on either, and it did not return samples.',
  },
  facts: [
    { label: 'Launch', value: 'September 27, 2007' },
    { label: 'Vesta', value: 'Entered orbit in 2011' },
    { label: 'Ceres', value: 'Arrived in 2015: first spacecraft to orbit a dwarf planet' },
    { label: 'Bright spots', value: "Occator Crater's bright areas are salt-rich deposits" },
    { label: 'Never landed', value: 'Dawn did not land on Vesta or Ceres' },
  ],
  timeline: [
    { date: 'September 27, 2007', kind: 'LAUNCH', text: 'Dawn launches.' },
    { date: '2011', kind: 'ARRIVAL', text: 'Enters orbit around Vesta.' },
    { date: '2015', kind: 'ARRIVAL', text: 'Enters orbit around Ceres.' },
    { date: 'November 1, 2018', kind: 'OFFICIAL MISSION END', text: 'NASA declares the mission over after the spacecraft runs out of hydrazine.' },
  ],
  fate: {
    status: 'in-orbit',
    headline: 'Silent, in orbit around Ceres',
    summary: 'Dawn remains in orbit around the dwarf planet Ceres. It did not land and did not crash. Mission end: November 1, 2018.',
    kidSummary: 'It is still circling Ceres, quietly. It never landed!',
  },
  missionStatus: 'Mission complete (2018). Remains in orbit around Ceres.',
  location: 'Orbit around dwarf planet Ceres',
  coordinates: null,
  locationAccuracy: 'not-applicable',
  model: DEEP_MODEL,
  assets: [],
  audio: AUDIO.dawn,
  sources: [SRC.dawn],
}

const kepler: Story = {
  id: 'kepler',
  world: 'deep-space',
  collection: COLLECTION,
  mission: 'Kepler',
  equipmentName: 'Kepler Space Telescope',
  equipmentType: 'space-telescope',
  title: 'The Planet Hunter',
  subtitle: 'Kepler Space Telescope · 2009–2018',
  kidsStory: {
    hook: 'A telescope is floating all alone in space, far from Earth, staring at one patch of stars without blinking. What is it waiting to see?',
    steps: {
      what: { text: 'This is Kepler, a space telescope! It was launched in 2009. It is not on any planet. It floats in space and follows Earth around the Sun.' },
      why: { text: 'Kepler went looking for planets outside our solar system. They are called exoplanets. But they are so far away! How can you find something that tiny and dim?' },
      did: { text: 'It is a clever trick! Kepler watched the light of stars very carefully. When a planet passes in front of its star, the star gets a tiny bit dimmer. Kepler could spot that little dip. This is called the Transit Method.' },
      discovered: { text: 'Kepler found thousands of planets! Some of them are in the Habitable Zone. That is the area around a star where it is not too hot and not too cold, so liquid water could exist if conditions are right.' },
      happened: { text: 'In 2018 Kepler ran out of fuel, and NASA said good night to it. It is still drifting around the Sun, far behind Earth, fast asleep.' },
      matters: { text: 'But wait! Being in the Habitable Zone does not mean we found life. We still do not know if anyone lives out there. What Kepler taught us is that the sky is full of planets, more planets than stars!' },
    },
  },
  adultsStory: {
    hook: 'A telescope alone in interplanetary space, trailing Earth around the Sun, built to stare at a single field of stars for years without interruption.',
    steps: {
      what: { text: 'Kepler was a NASA space telescope launched on March 6, 2009. It was never on or near a planet\'s surface: it operated in its own orbit around the Sun, slowly trailing behind Earth.' },
      why: { text: 'Its objective was to determine how common Earth-sized planets are around other stars, and to identify worlds that might be potentially habitable.' },
      did: { text: 'It used the transit method. When a planet passes between its star and the telescope it blocks a small fraction of the star\'s light. By measuring repeated decreases in the brightness of many thousands of stars at once, scientists could detect planets and estimate their sizes and orbital periods.' },
      discovered: { text: 'Kepler discovered thousands of confirmed exoplanets and demonstrated that planets are common throughout the galaxy. Some orbit within their star\'s habitable zone, where liquid water may be possible under suitable conditions.' },
      happened: { text: 'After the failure of two reaction wheels in 2013 the telescope was given a new observing strategy, known as K2, and kept working. In 2018 it ran out of fuel. NASA announced its retirement on October 30, 2018 and sent the final commands on November 15, 2018. It remains in orbit around the Sun, safely away from Earth.' },
      matters: { text: 'A place in the habitable zone does not prove the existence of life: it only describes where liquid water could be stable. What Kepler changed is the scale of the question. Planets are now known to be the rule, not the exception.' },
    },
  },
  guess: {
    question: 'How do you think this telescope found planets around other stars?',
    kidQuestion: 'How did this telescope find faraway planets?',
    options: ['It flew to each star to look', 'It watched for stars dimming slightly as planets passed in front', 'It listened for radio messages from aliens'],
    answer: 1,
    explain: 'Kepler used the transit method: it measured tiny, repeated dips in starlight when a planet crossed in front of its star.',
  },
  facts: [
    { label: 'Launch', value: 'March 6, 2009' },
    { label: 'Method', value: 'Transit method: repeated decreases in stellar brightness' },
    { label: 'Result', value: 'Thousands of confirmed exoplanets' },
    { label: 'Habitable zone', value: 'Where liquid water may be possible. It does not prove life exists.' },
    { label: 'Location', value: 'An orbit around the Sun, not on any planetary surface' },
  ],
  timeline: [
    { date: 'March 6, 2009', kind: 'LAUNCH', text: 'Kepler launches.' },
    { date: '2013', kind: 'MILESTONE', text: 'A second reaction wheel fails; the mission is later redesigned as K2.' },
    { date: 'October 30, 2018', kind: 'OFFICIAL MISSION END', text: 'NASA announces that Kepler has run out of fuel and is retired.' },
    { date: 'November 15, 2018', kind: 'OPERATIONS END', text: 'Final commands sent; the spacecraft is switched off.' },
  ],
  fate: {
    status: 'solar-orbit',
    headline: 'Retired, drifting in orbit around the Sun',
    summary: 'Kepler was switched off after running out of fuel and remains in an Earth-trailing orbit around the Sun. It is a space telescope and was never on a surface.',
    kidSummary: 'It is fast asleep, drifting around the Sun far behind Earth.',
  },
  missionStatus: 'Retired October 30, 2018. Remains in orbit around the Sun.',
  location: 'Earth-trailing orbit around the Sun',
  coordinates: null,
  locationAccuracy: 'not-applicable',
  model: DEEP_MODEL,
  assets: [],
  audio: AUDIO.kepler,
  sources: [SRC.kepler],
}

export const DEEP_SPACE_STORIES: Story[] = [dawn, near, pioneer10, pioneer11, kepler]

/** 11.6 Closing message, shown once all five Deep Space stories have been discovered. */
export const DEEP_SPACE_FINAL = {
  kids: [
    'We explored planets, asteroids and faraway worlds!',
    'Pioneer went to the giant planets, NEAR visited an asteroid, Dawn studied two strange worlds, and Kepler discovered worlds outside our solar system.',
    'But space is still full of secrets.',
    'Who knows? Maybe YOU will be the next explorer!',
  ],
  adults: [
    'Pioneer expanded our knowledge of the outer planets. NEAR studied the asteroid Eros. Dawn revealed the secrets of Vesta and Ceres, and Kepler changed our understanding of how common planets are beyond the solar system.',
    'These missions have ended, but the data they gathered still help scientists answer new questions.',
    'Some missions end. Their stories remain.',
  ],
}

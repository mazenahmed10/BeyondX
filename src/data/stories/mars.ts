import { AUDIO } from './audio'
import { RECONSTRUCTION_NOTE, type Story, type StoryCoordinates, type StorySource } from './types'

const COLLECTION = 'Beyond the Red Horizon'

const SRC = {
  pathfinder: { title: 'Mars Pathfinder', url: 'https://science.nasa.gov/mission/mars-pathfinder/', publisher: 'NASA Science' },
  mer: { title: 'Mars Exploration Rovers: Spirit and Opportunity', url: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/', publisher: 'NASA Science' },
  spirit: { title: 'Spirit', url: 'https://science.nasa.gov/mission/mer-spirit/', publisher: 'NASA Science' },
  opportunity: { title: 'Opportunity', url: 'https://science.nasa.gov/mission/mer-opportunity/', publisher: 'NASA Science' },
  viking: { title: 'Viking Project', url: 'https://science.nasa.gov/mission/viking/', publisher: 'NASA Science' },
  viking1: { title: 'Viking 1', url: 'https://science.nasa.gov/mission/viking-1/', publisher: 'NASA Science' },
  viking2: { title: 'Viking 2', url: 'https://science.nasa.gov/mission/viking-2/', publisher: 'NASA Science' },
  vikingScience: { title: 'Viking: Spacecraft and Science', url: 'https://science.nasa.gov/mission/viking/spacecraft-and-science', publisher: 'NASA Science' },
  phoenix: { title: 'Phoenix Mars Lander', url: 'https://science.nasa.gov/mission/mars-phoenix/', publisher: 'NASA Science' },
  insight: { title: 'InSight Lander', url: 'https://science.nasa.gov/mission/insight/', publisher: 'NASA Science' },
  ingenuity: { title: 'Ingenuity Mars Helicopter', url: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/', publisher: 'NASA Science' },
  ingenuityEnd: {
    title: "After Three Years on Mars, NASA's Ingenuity Helicopter Mission Ends",
    url: 'https://www.nasa.gov/news-release/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/',
    publisher: 'NASA',
  },
} satisfies Record<string, StorySource>

const coord = (lat: number, lon: number, note: string): StoryCoordinates => ({ lat, lon, precision: 'surveyed', note })
const SITE_NOTE = 'Landing site, rounded from NASA values. Planetocentric latitude, east longitude; published values vary slightly with the reference system.'

const sojourner: Story = {
  id: 'mars-sojourner',
  world: 'mars',
  collection: COLLECTION,
  mission: 'Mars Pathfinder',
  equipmentName: 'Sojourner Rover',
  equipmentType: 'rover',
  title: 'The Little Pioneer',
  subtitle: 'Mars Pathfinder · 1997',
  kidsStory: {
    hook: 'Aww, look how tiny! Six little wheels and a flat top, parked beside a bigger machine with open petals like a metal flower. Wait… this little thing came ALL the way to Mars?!',
    steps: {
      what: { text: 'Meet Sojourner! It was the first robot car ever to drive on another planet. It is about as big as a microwave oven and as heavy as a small dog: 10.5 kilograms.', highlight: 'wheels' },
      why: { text: 'Nobody had ever driven a robot on Mars before. Sojourner was the test driver! Its job was to show that a little rover could roll around, look at rocks, and send news home.' },
      did: { text: 'Sojourner did not fly to Mars alone. It rode inside a lander called Pathfinder, which bounced down inside giant airbags on July 4, 1997. Then Sojourner rolled down a ramp and sniffed rocks with a special sensor on its back.', highlight: 'lander' },
      discovered: { text: 'It studied rocks with funny names like Barnacle Bill and Yogi! It found the rocks were not all the same, which means Mars has a more interesting history than people thought.', highlight: 'apxs' },
      happened: { text: 'Sojourner was built to work for 7 days. It worked for 83! It always talked to Earth through its lander. When the lander went quiet on September 27, 1997, little Sojourner could not call home any more.', highlight: 'antenna' },
      matters: { text: 'Every big Mars rover since is like Sojourner\'s grandchild. This tiny robot proved that driving on Mars is possible!', highlight: 'panel' },
    },
  },
  adultsStory: {
    hook: 'A machine no bigger than a microwave oven, resting beside the opened petals of the lander that carried it across interplanetary space.',
    steps: {
      what: { text: 'Sojourner was a six-wheeled rover 65 cm long, 48 cm wide and 30 cm tall, weighing 10.5 kg. Delivered by the Mars Pathfinder lander, it became the first wheeled vehicle to operate on another planet.', highlight: 'wheels' },
      why: { text: 'Pathfinder was a low-cost technology demonstration. Sojourner had to prove that a small mobile robot could navigate the Martian surface, examine nearby rocks and soil, and return useful science and engineering data.' },
      did: { text: 'Pathfinder landed in Ares Vallis on July 4, 1997, cushioned by airbags. Sojourner did not land separately: it rode down on one of the lander\'s petals and rolled off a ramp. Powered by a solar panel and batteries, it pressed its Alpha Proton X-ray Spectrometer against rocks and soil, and relayed everything through the lander.', highlight: 'lander' },
      discovered: { text: 'Its chemical measurements of rocks such as Barnacle Bill and Yogi revealed more varied compositions than expected, and the rounded pebbles and landforms at the site were consistent with a warmer, wetter past in which floods had crossed Ares Vallis.', highlight: 'apxs' },
      happened: { text: 'Planned for 7 days, the rover operated for 83 sols and travelled about 100 m in total, never straying more than about 12 m from the lander. The final data transmission from Pathfinder was received on September 27, 1997. Without its only relay, Sojourner could no longer be heard. Both remain in Ares Vallis.', highlight: 'antenna' },
      matters: { text: 'Sojourner showed that roving on Mars was practical and affordable. Its rocker-bogie suspension and operating approach carried forward into every later NASA Mars rover.', highlight: 'panel' },
    },
  },
  guess: {
    question: 'What do you think this is?',
    kidQuestion: 'What is this tiny six-wheeler?',
    options: ['A toy left behind by astronauts', 'The first rover to drive on Mars', 'A robot vacuum cleaner'],
    answer: 1,
    explain: 'It is Sojourner, the first wheeled rover to operate on another planet. No astronaut has ever been to Mars.',
  },
  facts: [
    { label: 'Size', value: '65 cm long · 48 cm wide · 30 cm tall · 10.5 kg' },
    { label: 'Instruments', value: 'Alpha Proton X-ray Spectrometer (APXS), cameras' },
    { label: 'Power', value: 'Solar panel and batteries' },
    { label: 'Planned vs actual', value: 'Planned 7 days · operated 83 sols' },
    { label: 'Communication', value: 'Only through the Pathfinder lander' },
  ],
  timeline: [
    { date: 'December 4, 1996', kind: 'LAUNCH', text: 'Mars Pathfinder launches, carrying Sojourner.' },
    { date: 'July 4, 1997', kind: 'LANDING', text: 'Pathfinder lands in Ares Vallis.' },
    { date: 'July 5–6, 1997', kind: 'DEPLOYED', text: 'Sojourner rolls down the ramp onto Mars.' },
    { date: 'September 27, 1997', kind: 'LAST DATA', text: 'Final data transmission from Pathfinder is received.' },
  ],
  fate: {
    status: 'on-surface',
    headline: 'Silent beside its lander',
    summary: 'When the Pathfinder lander stopped transmitting, Sojourner lost its only link to Earth. The rover and lander remain in Ares Vallis. The date of the last data (September 27, 1997) is not the same as the later formal end of the mission.',
    kidSummary: 'Its lander went quiet, so Sojourner could not call home. They are both still resting on Mars together.',
  },
  missionStatus: 'Mission complete. Last data September 27, 1997. Remains on Mars.',
  location: 'Ares Vallis',
  coordinates: coord(19.13, -33.22, SITE_NOTE),
  locationAccuracy: 'illustrative',
  model: { kind: 'sojourner', note: RECONSTRUCTION_NOTE },
  assets: [],
  audio: AUDIO.sojourner,
  sources: [SRC.pathfinder],
}

interface MerSpec {
  id: 'spirit' | 'opportunity'
  name: string
  code: string
  title: string
  site: string
  coords: StoryCoordinates
  launch: string
  landing: string
  distance: string
  lifetime: string
  hookKids: string
  hookAdults: string
  didKids: string
  didAdults: string
  foundKids: string
  foundAdults: string
  happenedKids: string
  happenedAdults: string
  fateHeadline: string
  fateSummary: string
  fateKid: string
  status: string
  endTimeline: Story['timeline']
  source: StorySource
}

function mer(s: MerSpec): Story {
  return {
    id: `mars-${s.id}`,
    world: 'mars',
    collection: COLLECTION,
    mission: `Mars Exploration Rover ${s.code}`,
    equipmentName: `${s.name} Rover`,
    equipmentType: 'rover',
    title: s.title,
    subtitle: `${s.code} · Mars Exploration Rover · landed ${s.landing}`,
    kidsStory: {
      hook: s.hookKids,
      steps: {
        what: { text: `This is ${s.name}! It is a robot geologist, which means a rock detective. It is about as big as a golf cart, with six wheels, wings made of solar panels, and a tall neck with camera eyes.`, highlight: 'mast' },
        why: { text: `Scientists had a big question: was there ever water on Mars? Rocks keep secrets about water, so ${s.name} was sent to read the rocks. Its twin went to a different part of Mars to look there too.` },
        did: { text: s.didKids, highlight: 'arm' },
        discovered: { text: s.foundKids },
        happened: { text: s.happenedKids, highlight: 'panels' },
        matters: { text: `${s.name} was only supposed to work for 90 Mars days. It lasted ${s.lifetime}! And it showed us that long ago, Mars had water. It did NOT find life, but it found places where life might have been comfy.`, highlight: 'wheels' },
      },
    },
    adultsStory: {
      hook: s.hookAdults,
      steps: {
        what: { text: `${s.name} (${s.code}) was one of NASA's twin Mars Exploration Rovers: a six-wheeled, solar-powered robotic field geologist of about 185 kg, roughly the size of a golf cart. Its mast carried the panoramic camera, Pancam, at about the eye height of a person.`, highlight: 'mast' },
        why: { text: 'The twins were sent to opposite sides of Mars to read the geological record for evidence of past water, and so to test whether early Mars had environments suitable for life. Two rovers at two sites allowed two different settings to be compared.' },
        did: { text: s.didAdults, highlight: 'arm' },
        discovered: { text: s.foundAdults },
        happened: { text: s.happenedAdults, highlight: 'panels' },
        matters: { text: `Designed for 90 sols, ${s.name} operated for ${s.lifetime} and drove about ${s.distance} km. It found evidence of ancient watery environments, not evidence of life. That distinction, and the endurance behind it, set the agenda for every Mars rover that followed.`, highlight: 'wheels' },
      },
    },
    guess: {
      question: 'What do you think this is?',
      kidQuestion: 'Six wheels, wings and a tall neck… who is it?',
      options: ['A robot geologist rover', 'A solar-powered weather tower', 'A lander that cannot move'],
      answer: 0,
      explain: `It is ${s.name}, one of the twin Mars Exploration Rovers that landed in January 2004.`,
    },
    facts: [
      { label: 'Mass', value: 'About 185 kg' },
      { label: 'Planned lifetime', value: '90 sols' },
      { label: 'Actual operation', value: s.lifetime },
      { label: 'Distance driven', value: `About ${s.distance} km` },
      { label: 'Instruments', value: 'Pancam, robotic arm, Microscopic Imager, APXS, Mössbauer spectrometer, Rock Abrasion Tool (RAT)' },
      { label: 'Power and heat', value: 'Solar panels and batteries; radioisotope heater units for warmth' },
    ],
    timeline: [
      { date: s.launch, kind: 'LAUNCH', text: `${s.name} launches from Earth.` },
      { date: s.landing, kind: 'LANDING', text: `${s.name} lands in ${s.site}.` },
      ...s.endTimeline,
    ],
    fate: { status: 'on-surface', headline: s.fateHeadline, summary: s.fateSummary, kidSummary: s.fateKid },
    missionStatus: s.status,
    location: s.site,
    coordinates: s.coords,
    locationAccuracy: 'illustrative',
    model: { kind: 'mer', variant: s.id, note: RECONSTRUCTION_NOTE },
    assets: [],
    audio: AUDIO.spiritOpportunity,
    sources: [s.source, SRC.mer],
  }
}

const spirit = mer({
  id: 'spirit',
  name: 'Spirit',
  code: 'MER-A',
  title: 'The Trailblazer',
  site: 'Gusev Crater',
  coords: coord(-14.57, 175.47, SITE_NOTE),
  launch: 'June 10, 2003',
  landing: 'January 3, 2004',
  distance: '7.7',
  lifetime: 'more than six years',
  hookKids: 'Look! A robot with wings and a long neck, stuck in the sand with its wheels half buried. It looks like it tried really hard to get out…',
  hookAdults: 'A winged, long-necked rover tilted in a patch of soft soil, wheels sunk to their rims. Around it, churned ground shows how hard it tried to leave.',
  didKids: 'Spirit landed on January 3, 2004 in a giant crater called Gusev. It scratched rocks with a grinding tool, looked at them with a microscope, and even climbed a hill as tall as a 25-story building!',
  didAdults: 'Spirit landed in Gusev Crater on January 3, 2004. It ground into rocks with its Rock Abrasion Tool, examined them with the Microscopic Imager and its spectrometers, and climbed Husband Hill, far beyond anything planned for a 90-sol mission.',
  foundKids: 'One of Spirit\'s wheels got stuck and dragged through the dirt like a plow. Surprise! It dug up bright white stuff called silica. That stuff forms in hot springs, so there was once hot water here!',
  foundAdults: 'When a front wheel failed, the dragged wheel ploughed a trench that exposed nearly pure silica: a deposit of the kind produced by hot springs or steam vents. It was evidence of an ancient hydrothermal environment, not of life.',
  happenedKids: 'In 2009 Spirit got stuck in soft sand. It could not tilt its solar panels toward the Sun for winter. Its last hello came in March 2010. NASA kept calling until May 2011, but Spirit did not answer.',
  happenedAdults: 'In 2009 Spirit became embedded in soft soil. Unable to tilt its solar panels toward the winter Sun, it lost power. The last communication was in March 2010. NASA ended its recovery attempts in May 2011. These are two different events: last contact, and the end of efforts to regain it.',
  fateHeadline: 'Stuck in soft soil, silent since 2010',
  fateSummary: 'Spirit remains where it became embedded in Gusev Crater. Last communication: March 2010. Recovery efforts ended: May 2011.',
  fateKid: 'Spirit is still on Mars, right where it got stuck. It worked 25 times longer than planned!',
  status: 'Mission complete. Last contact March 2010; recovery efforts ended May 2011.',
  endTimeline: [
    { date: 'March 2010', kind: 'LAST CONTACT', text: 'Last communication from Spirit.' },
    { date: 'May 2011', kind: 'OFFICIAL MISSION END', text: 'NASA ends efforts to regain contact.' },
  ],
  source: SRC.spirit,
})

const opportunity = mer({
  id: 'opportunity',
  name: 'Opportunity',
  code: 'MER-B',
  title: 'The Longest Journey',
  site: 'Meridiani Planum',
  coords: coord(-1.95, -5.53, SITE_NOTE + ' The rover drove about 45 km from here before falling silent.'),
  launch: 'July 7, 2003',
  landing: 'January 24, 2004',
  distance: '45.16',
  lifetime: 'about 14.4 years',
  hookKids: 'A dusty robot with wings and a long neck, standing very still. Its wheel tracks go on and on and on behind it, farther than you can see. How far did it travel?!',
  hookAdults: 'A dust-coated rover at the end of a set of wheel tracks that stretch back over the horizon: more than a marathon long.',
  didKids: 'Opportunity landed on January 24, 2004 on the other side of Mars from its twin. It bounced right into a little crater, a hole-in-one! Then it drove and drove: 45 kilometers. That is longer than a marathon race!',
  didAdults: 'Opportunity landed in Meridiani Planum on January 24, 2004, rolling to a stop inside a small crater with exposed bedrock. Over the following years it drove about 45.16 km from crater to crater, the first vehicle to exceed a marathon distance on another world.',
  foundKids: 'It found tiny round pebbles that scientists nicknamed "blueberries". They form in water! It also found rocks with layers made by water long, long ago.',
  foundAdults: 'In its landing crater it found hematite-rich spherules, nicknamed "blueberries", and layered sulfate-bearing rocks: evidence that liquid water once soaked and flowed across the site. It later found clay minerals pointing to milder water chemistry. None of this is evidence of life.',
  happenedKids: 'In June 2018 a giant dust storm covered the whole planet. The sky went dark and Opportunity\'s solar panels could not make power. It went to sleep and never woke up. NASA said goodbye on February 13, 2019.',
  happenedAdults: 'In June 2018 a planet-encircling dust storm blocked sunlight from its solar panels, and the rover fell silent. After months of attempts to wake it, NASA declared the mission complete on February 13, 2019. Again these are distinct events: last contact, then the official end.',
  fateHeadline: 'Silenced by a global dust storm',
  fateSummary: 'Opportunity rests in Perseverance Valley on the rim of Endeavour crater. Last contact: June 2018, during a dust storm. Official mission end: February 13, 2019.',
  fateKid: 'Opportunity is resting on Mars after the longest road trip any robot had ever taken on another world.',
  status: 'Mission complete. Last contact June 2018; official end February 13, 2019.',
  endTimeline: [
    { date: 'June 2018', kind: 'LAST CONTACT', text: 'Last communication, during a planet-wide dust storm.' },
    { date: 'February 13, 2019', kind: 'OFFICIAL MISSION END', text: 'NASA declares the Opportunity mission complete.' },
  ],
  source: SRC.opportunity,
})

interface VikingSpec {
  n: 1 | 2
  title: string
  site: string
  coords: StoryCoordinates
  launch: string
  orbit: string
  landing: string
  hookKids: string
  hookAdults: string
  didKids: string
  didAdults: string
  foundKids: string
  foundAdults: string
  happenedKids: string
  happenedAdults: string
  fateSummary: string
  fateKid: string
  status: string
  endEvent: Story['timeline'][number]
  source: StorySource
  notes?: string[]
}

function viking(s: VikingSpec): Story {
  return {
    id: `mars-viking-${s.n}-lander`,
    world: 'mars',
    collection: COLLECTION,
    mission: `Viking ${s.n}`,
    equipmentName: `Viking ${s.n} Lander`,
    equipmentType: 'robotic-lander',
    title: s.title,
    subtitle: `Viking ${s.n} · Lander · touched down ${s.landing}`,
    kidsStory: {
      hook: s.hookKids,
      steps: {
        what: { text: `This is the Viking ${s.n} lander! It is a robot science lab on three legs. It has two camera eyes, a dish for talking to Earth, and a long arm with a scoop for grabbing dirt.`, highlight: 'cameras' },
        why: { text: 'People have always wondered: is anything alive on Mars? Viking carried tiny labs to test the soil and try to find out. It also came to take pictures and check the weather.' },
        did: { text: s.didKids, highlight: 'arm' },
        discovered: { text: s.foundKids },
        happened: { text: s.happenedKids, highlight: 'rtg' },
        matters: { text: 'Viking showed everyone how to land on Mars and gave us our first close-up look at the ground. Every Mars robot after it followed in its footsteps. Or should we say… leg-steps!', highlight: 'legs' },
      },
    },
    adultsStory: {
      hook: s.hookAdults,
      steps: {
        what: { text: `The Viking ${s.n} lander was one half of a two-part spacecraft. Its orbiter stayed in orbit around Mars, imaging the planet and relaying data; it is not on the surface. The lander is a three-legged platform with two facsimile cameras, a robotic sampler arm, a dish antenna and a compact laboratory inside its body.`, highlight: 'cameras' },
        why: { text: 'Viking set out to image Mars from orbit and from the ground, characterise the atmosphere and surface, and perform the first direct search for signs of life on another planet with three biology experiments and a gas chromatograph–mass spectrometer (GCMS).' },
        did: { text: s.didAdults, highlight: 'arm' },
        discovered: { text: s.foundAdults },
        happened: { text: s.happenedAdults, highlight: 'rtg' },
        matters: { text: 'Viking established how to land and operate on Mars and returned the first long-term surface record of another planet. Its ambiguous biology results reshaped the search for life: later missions would first ask where water had been, and what the chemistry could support.', highlight: 'legs' },
      },
    },
    guess: {
      question: 'What do you think this is?',
      kidQuestion: 'Three legs, a dish and a scoop… what is it?',
      options: ['A robotic laboratory that landed in 1976', 'A satellite that fell from orbit', 'A rover with broken wheels'],
      answer: 0,
      explain: `It is the Viking ${s.n} lander. Its orbiter stayed in space; only the lander came down to the surface.`,
    },
    facts: [
      { label: 'Launch', value: s.launch },
      { label: 'Orbiter entered Mars orbit', value: s.orbit },
      { label: 'Lander touchdown', value: s.landing },
      { label: 'Lander instruments', value: 'Cameras, robotic sampler, GCMS, three biology experiments, weather instruments, seismometer' },
      { label: 'Power', value: 'Lander: radioisotope thermoelectric generators (RTGs). Orbiter: solar power.' },
      { label: 'Search for life', value: 'No clear, confirmed evidence of life was found.' },
    ],
    timeline: [
      { date: s.launch, kind: 'LAUNCH', text: `Viking ${s.n} launches.` },
      { date: s.orbit, kind: 'ARRIVAL', text: `Viking ${s.n} enters orbit around Mars.` },
      { date: s.landing, kind: 'LANDING', text: `The lander touches down in ${s.site}. The orbiter stays in orbit.` },
      s.endEvent,
    ],
    fate: {
      status: 'on-surface',
      headline: 'Silent on the plain where it landed',
      summary: s.fateSummary,
      kidSummary: s.fateKid,
    },
    missionStatus: s.status,
    location: s.site,
    coordinates: s.coords,
    locationAccuracy: 'illustrative',
    model: { kind: 'viking', variant: `viking-${s.n}`, note: RECONSTRUCTION_NOTE },
    assets: [],
    audio: AUDIO.viking,
    sources: [s.source, SRC.viking, SRC.vikingScience],
    accuracyNotes: s.notes,
  }
}

const viking1 = viking({
  n: 1,
  title: 'The First Successful Mars Landing',
  site: 'Chryse Planitia',
  coords: coord(22.27, -47.95, SITE_NOTE),
  launch: 'August 20, 1975',
  orbit: 'June 19, 1976',
  landing: 'July 20, 1976',
  hookKids: 'A three-legged machine with a big dish, standing on a rocky orange plain. It looks old. Really old. Older than your parents, maybe!',
  hookAdults: 'A three-legged machine on a boulder-strewn plain, its scoop arm still extended toward the trenches it dug in the summer of 1976.',
  didKids: 'On July 20, 1976, Viking 1 touched down gently. It was the first spacecraft to land on Mars and do its whole job! It snapped the first clear photos from the ground and scooped dirt into its tiny labs.',
  didAdults: 'On July 20, 1976, seven years to the day after Apollo 11, it made the first fully successful landing on Mars and began transmitting the first clear images from the surface within minutes. Its sampler arm delivered soil to the onboard experiments.',
  foundKids: 'The labs saw something surprising happen in the soil. Was it tiny living things? Scientists checked and checked. In the end there was no clear proof of life. It was probably just unusual chemistry in the dirt. A Mars mystery!',
  foundAdults: 'The biology experiments produced unexpected chemical activity in the soil, but the GCMS found no organic molecules, and the results did not provide clear, confirmed evidence of life. Most scientists attribute the reactions to reactive soil chemistry. The lander\'s seismometer failed to deploy.',
  happenedKids: 'Viking 1 had a nuclear battery, so it worked for more than six years. In November 1982, someone sent it a wrong command by mistake, and it stopped talking. It is still standing on Mars.',
  happenedAdults: 'Powered by RTGs rather than sunlight, the lander operated for more than six years. In November 1982 a faulty command sent from Earth caused contact to be lost. It was never restored, and the lander remains in Chryse Planitia.',
  fateSummary: 'Viking 1 lander operations ended in November 1982 after a faulty command (this project uses November 13, 1982; some NASA pages give November 11 as the final transmission). The lander remains in Chryse Planitia. Its orbiter was never on the surface.',
  fateKid: 'It stopped talking in 1982 and is still standing on Mars. Its orbiter partner stayed up in space.',
  status: 'Mission complete. Lander operations ended November 13, 1982. Remains on Mars.',
  endEvent: { date: 'November 13, 1982', kind: 'OPERATIONS END', text: 'Viking 1 lander operations end after a faulty command.' },
  source: SRC.viking1,
  notes: ['NASA sources differ on the end date for the Viking 1 lander: November 11, 1982 (final transmission) or November 13, 1982 (end of communications). November 13 is used here, following the team\'s research document and NASA\'s "Spacecraft and Science" page.'],
})

const viking2 = viking({
  n: 2,
  title: 'Another Landing, Another Mystery',
  site: 'Utopia Planitia',
  coords: coord(47.64, 134.29, SITE_NOTE),
  launch: 'September 9, 1975',
  orbit: 'August 7, 1976',
  landing: 'September 3, 1976',
  hookKids: 'Hey, haven\'t we seen a robot like this before? Three legs, a dish, a scoop… but this one is far away in the chilly north, and it is leaning on a rock!',
  hookAdults: 'A second three-legged laboratory, thousands of kilometres from the first, standing slightly tilted with one footpad on a rock.',
  didKids: 'Viking 2 landed on September 3, 1976, on the other side of Mars from its twin. One foot came down on a rock, so it stands a bit crooked! It did the same soil tests, and its quake-sensor worked.',
  didAdults: 'Viking 2 touched down in Utopia Planitia on September 3, 1976, coming to rest with one footpad on a rock and a tilt of about eight degrees. It repeated the biology and chemistry experiments at a second, more northerly site, and unlike its twin its seismometer worked.',
  foundKids: 'In winter, Viking 2 saw a thin white frost covering the red ground. Brrr! The soil tests gave the same puzzling answer as Viking 1: no clear proof of anything alive.',
  foundAdults: 'It photographed a thin layer of water frost on the ground during the northern winter. Its biology results matched those of Viking 1: chemical activity, but no clear, confirmed evidence of life, and no organic molecules detected by its GCMS.',
  happenedKids: 'Viking 2 worked for more than three years. Then its batteries wore out. Its last message reached Earth on April 11, 1980. It is still up there in the north.',
  happenedAdults: 'After more than three and a half years its batteries failed. The last data from the Viking 2 lander reached Earth on April 11, 1980. It remains in Utopia Planitia.',
  fateSummary: 'The last data from the Viking 2 lander arrived on April 11, 1980, after its batteries failed. The lander remains in Utopia Planitia. Its orbiter was never on the surface.',
  fateKid: 'Its batteries got too old in 1980. It is still standing, a little crooked, in the north of Mars.',
  status: 'Mission complete. Last lander data April 11, 1980. Remains on Mars.',
  endEvent: { date: 'April 11, 1980', kind: 'LAST DATA', text: 'Last data from the Viking 2 lander reach Earth.' },
  source: SRC.viking2,
})

const phoenix: Story = {
  id: 'mars-phoenix',
  world: 'mars',
  collection: COLLECTION,
  mission: 'Phoenix',
  equipmentName: 'Phoenix Lander',
  equipmentType: 'robotic-lander',
  title: 'The Ice Detective',
  subtitle: 'Phoenix Mars Lander · 2007–2008',
  kidsStory: {
    hook: 'Brrr! We are way up in the frozen north of Mars. Here is a robot with two round wings like fans and one loooong arm reaching into a ditch. What was it digging for?',
    steps: {
      what: { text: 'This is Phoenix, the Ice Detective! It is a lander, so it has no wheels and stays in one spot. But it has a robot arm 2.35 meters long. That is longer than a grown-up is tall!', highlight: 'arm' },
      why: { text: 'Scientists guessed that ice was hiding under the dirt near the north pole of Mars. Phoenix went to dig and check. Where there is water ice, there are big clues about Mars\'s past.' },
      did: { text: 'Phoenix landed on May 25, 2008. A few days later its arm started scooping. It dug little ditches and dropped dirt into tiny ovens to "cook" it and sniff the steam.', highlight: 'trench' },
      discovered: { text: 'In one ditch, Phoenix saw bright white chunks. A few days later they had vanished, like ice cubes on a hot day. It was water ice! On July 31, 2008, the little ovens proved it for sure.', highlight: 'deck' },
      happened: { text: 'Phoenix ran on sunshine. When the long, dark Mars winter came, there was not enough light and it got far too cold. Its last signal came on November 2, 2008.', highlight: 'panels' },
      matters: { text: 'Phoenix proved there is frozen water just under the ground on Mars. Future astronauts might drink it or make rocket fuel from it one day!', highlight: 'mast' },
    },
  },
  adultsStory: {
    hook: 'A stationary lander on the polygon-patterned plains of the Martian arctic, its arm resting beside shallow trenches cut into the soil.',
    steps: {
      what: { text: 'Phoenix was a stationary lander with no wheels. Everything it studied had to come within reach of its 2.35 m robotic arm, which dug, scooped, and delivered samples to instruments on its deck.', highlight: 'arm' },
      why: { text: 'Orbiters had detected signs of abundant hydrogen in the high northern latitudes, suggesting ice just below the surface. Phoenix was sent to the northern plains to touch that ice, study the history of water there, and assess whether the soil could ever have been a habitable environment.' },
      did: { text: 'It launched on August 4, 2007 and landed on May 25, 2008. The arm began scooping on May 31. Samples went to TEGA, whose small ovens heated them and analysed the gases released, and to MECA, a wet chemistry and microscopy laboratory. The SSI camera and weather instruments recorded the site.', highlight: 'trench' },
      discovered: { text: 'Bright material exposed in a trench disappeared over several days, as ice does when it sublimates. On July 31, 2008, NASA announced that TEGA had confirmed water ice in a sample. Phoenix also detected perchlorate, a reactive salt that changed how scientists think about Martian soil chemistry, and it observed snow falling from clouds.', highlight: 'deck' },
      happened: { text: 'Phoenix was never expected to survive the polar winter. As sunlight declined, temperatures fell and power ran short. Its last signal was received on November 2, 2008, and NASA announced the end of operations shortly afterwards. Orbital images later showed the lander with apparent damage to its solar arrays, consistent with a winter coating of carbon-dioxide ice.', highlight: 'panels' },
      matters: { text: 'Phoenix confirmed accessible water ice on Mars by direct sampling: ice, not lakes or flowing water. That finding underpins plans for future exploration, and its perchlorate discovery is now essential context for any search for organic molecules.', highlight: 'mast' },
    },
  },
  guess: {
    question: 'What do you think this is?',
    kidQuestion: 'Two round wings and a long digging arm… what is it?',
    options: ['A rover hunting for rocks', 'A solar-powered oven', 'A lander that dug for ice'],
    answer: 2,
    explain: 'It is Phoenix, a stationary lander that dug into the northern plains and confirmed water ice in 2008.',
  },
  facts: [
    { label: 'Type', value: 'Stationary lander (no wheels)' },
    { label: 'Robotic arm', value: '2.35 m long' },
    { label: 'Instruments', value: 'TEGA, MECA, SSI (Surface Stereo Imager), weather instruments' },
    { label: 'Key results', value: 'Confirmed water ice; detected perchlorate' },
    { label: 'Why it ended', value: 'Declining sunlight, cold and lack of power as winter approached' },
  ],
  timeline: [
    { date: 'August 4, 2007', kind: 'LAUNCH', text: 'Phoenix launches from Cape Canaveral.' },
    { date: 'May 25, 2008', kind: 'LANDING', text: 'Phoenix lands on the northern plains.' },
    { date: 'May 31, 2008', kind: 'MILESTONE', text: 'The robotic arm begins scooping soil.' },
    { date: 'July 31, 2008', kind: 'MILESTONE', text: 'NASA announces confirmation of water ice in a sample.' },
    { date: 'November 2, 2008', kind: 'LAST CONTACT', text: 'Last signal received; the mission ends as winter sets in.' },
  ],
  fate: {
    status: 'on-surface',
    headline: 'Frozen silent in the Martian arctic',
    summary: 'Phoenix stopped communicating on November 2, 2008, when seasonal darkness and cold left it without power. It remains on the northern plains.',
    kidSummary: 'Winter came and Phoenix ran out of sunshine. It is still up in the frozen north of Mars.',
  },
  missionStatus: 'Mission complete. Last signal November 2, 2008. Remains on Mars.',
  location: 'Northern plains (Vastitas Borealis)',
  coordinates: coord(68.22, -125.75, SITE_NOTE),
  locationAccuracy: 'illustrative',
  model: { kind: 'phoenix', note: RECONSTRUCTION_NOTE },
  assets: [],
  audio: AUDIO.phoenix,
  sources: [SRC.phoenix],
}

const insight: Story = {
  id: 'mars-insight',
  world: 'mars',
  collection: COLLECTION,
  mission: 'InSight',
  equipmentName: 'InSight Lander',
  equipmentType: 'robotic-lander',
  title: 'Listening to the Heart of Mars',
  subtitle: 'InSight · 2018–2022',
  kidsStory: {
    hook: 'Shhh… this robot is listening. It has two big round wings covered in dust, and a little dome sitting on the ground beside it, like an upside-down bowl. What is under the bowl?',
    steps: {
      what: { text: 'This is InSight! It is a lander that stays in one place. It is not interested in rocks on top. It wants to know what is deep INSIDE Mars, like a doctor with a stethoscope.', highlight: 'seis' },
      why: { text: 'Earth has layers inside, like an onion or a peach with a pit. Does Mars? InSight was sent to find out how thick the layers are and how big the middle is.' },
      did: { text: 'InSight landed on November 26, 2018. Its arm carefully picked up a super-sensitive quake-sensor and set it on the ground, then covered it with a dome to keep the wind away. Then it listened… for years.', highlight: 'arm' },
      discovered: { text: 'Mars has quakes too: marsquakes! InSight felt more than 1,300 of them. The wiggles showed that Mars has a crust, a middle layer, and a core that is melted like hot syrup.', highlight: 'seis' },
      happened: { text: 'InSight also had a digging tool called "the mole", but the dirt was too clumpy and the mole could not dig deep. Meanwhile dust piled up on the solar panels. Less sunshine, less power. Its last message came on December 15, 2022.', highlight: 'panels' },
      matters: { text: 'Thanks to InSight we have a map of the inside of another planet for the very first time. Now we understand better how rocky planets like Mars and Earth are built.', highlight: 'rise' },
    },
  },
  adultsStory: {
    hook: 'A lander with two circular solar arrays buried under red dust. On the ground in front of it sits a small domed shield, joined to the deck by a flat tether.',
    steps: {
      what: { text: 'InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport) was a stationary lander. It was not sent to study surface rocks but to measure the deep interior of Mars.', highlight: 'seis' },
      why: { text: 'The interior of a rocky planet records how it formed. InSight was designed to determine the thickness of the crust, the structure of the mantle and the size and state of the core, and to measure how seismically active Mars is today.' },
      did: { text: 'Launched on May 5, 2018, it landed in Elysium Planitia on November 26, 2018. Its robotic arm lifted the SEIS seismometer off the deck, placed it on the ground and covered it with a wind and thermal shield. HP3, a self-hammering heat probe, was set down beside it, and RISE used the lander\'s radio signal to track the wobble of the planet\'s rotation.', highlight: 'arm' },
      discovered: { text: 'SEIS detected more than 1,300 marsquakes and other seismic events, including meteoroid impacts. The waves revealed a layered crust, a mantle and a large liquid core. RISE refined the measurement of that core. It was the first seismic survey of the interior of another planet.', highlight: 'seis' },
      happened: { text: 'HP3 could not reach its target depth: the soil clumped instead of gripping the probe, and it was abandoned after two years of attempts. Dust steadily accumulated on the solar arrays and power declined. The last communication was received on December 15, 2022, and NASA declared the mission over days later.', highlight: 'panels' },
      matters: { text: 'InSight turned Mars into the second planet whose interior has been mapped with seismology. Its results constrain how all rocky planets, including Earth, formed and cooled.', highlight: 'rise' },
    },
  },
  guess: {
    question: 'What do you think this is?',
    kidQuestion: 'Dusty wings and a little dome… what is it?',
    options: ['A robot listening for marsquakes', 'A satellite dish for television', 'A greenhouse for growing plants'],
    answer: 0,
    explain: 'It is InSight. The small dome covers its seismometer, which recorded more than 1,300 marsquakes and other seismic events.',
  },
  facts: [
    { label: 'Type', value: 'Stationary lander' },
    { label: 'Instruments', value: 'SEIS (seismometer), HP3 (heat probe), RISE (radio science)' },
    { label: 'Seismic record', value: 'More than 1,300 marsquakes and seismic events' },
    { label: 'Setback', value: 'HP3 did not reach its target depth' },
    { label: 'Why it ended', value: 'Dust on the solar arrays reduced power' },
  ],
  timeline: [
    { date: 'May 5, 2018', kind: 'LAUNCH', text: 'InSight launches from California.' },
    { date: 'November 26, 2018', kind: 'LANDING', text: 'InSight lands in Elysium Planitia.' },
    { date: 'December 2018', kind: 'DEPLOYED', text: 'The SEIS seismometer is placed on the ground.' },
    { date: 'December 15, 2022', kind: 'LAST CONTACT', text: 'Last communication received from InSight.' },
  ],
  fate: {
    status: 'on-surface',
    headline: 'Powered down under a blanket of dust',
    summary: 'InSight remains in Elysium Planitia. Its last communication was on December 15, 2022, after dust on its solar arrays cut its power.',
    kidSummary: 'Too much dust covered its wings, so it ran out of power. It is still sitting on Mars.',
  },
  missionStatus: 'Mission complete. Last contact December 15, 2022. Remains on Mars.',
  location: 'Elysium Planitia',
  coordinates: coord(4.5, 135.62, SITE_NOTE),
  locationAccuracy: 'illustrative',
  model: { kind: 'insight', note: RECONSTRUCTION_NOTE },
  assets: [],
  audio: AUDIO.insight,
  sources: [SRC.insight],
}

const ingenuity: Story = {
  id: 'mars-ingenuity',
  world: 'mars',
  collection: COLLECTION,
  mission: 'Mars 2020 (Perseverance)',
  equipmentName: 'Ingenuity Helicopter',
  equipmentType: 'helicopter',
  title: 'The First Flight on Another World',
  subtitle: 'Ingenuity Mars Helicopter · 2021–2024',
  kidsStory: {
    hook: 'What is THAT? A little box on four stick legs, with propellers on top! One of the blades looks broken. Hold on… can things even FLY on Mars?',
    steps: {
      what: { text: 'This is Ingenuity, a tiny robot helicopter! It is the first aircraft ever to fly on another planet. It weighs less than a big bottle of juice.', highlight: 'rotors' },
      why: { text: 'The air on Mars is super thin, about one hundredth of Earth\'s. Flying there is really, really hard. Ingenuity was a test: can a helicopter fly on Mars at all?' },
      did: { text: 'Ingenuity did not fly to Mars by itself. It rode under the belly of a big rover named Perseverance and arrived on February 18, 2021. On April 19, 2021, it lifted off, hovered, and landed. It flew!', highlight: 'body' },
      discovered: { text: 'The plan was 5 short flights. Ingenuity made 72! It flew as high as 24 meters, as high as a tall building, and scouted ahead to help its rover friend find good paths.', highlight: 'panel' },
      happened: { text: 'On its 72nd flight, on January 18, 2024, its blades were damaged during landing. It could not fly any more. NASA said the mission was over on January 25, 2024.', highlight: 'rotors' },
      matters: { text: 'Because of Ingenuity, we know flying on other worlds is possible. Future explorers may bring whole teams of flying robots!', highlight: 'legs' },
    },
  },
  adultsStory: {
    hook: 'A tissue-box fuselage on four slender legs, standing on a sand ripple. Above it, two rotors, one blade snapped short.',
    steps: {
      what: { text: 'Ingenuity was a small autonomous helicopter of about 1.8 kg with two counter-rotating rotors. It was a technology demonstration, not a science platform: it carried no science instruments, only cameras and sensors for navigation.', highlight: 'rotors' },
      why: { text: 'The Martian atmosphere is roughly one percent as dense as Earth\'s at the surface, so generating lift is extremely difficult. Ingenuity was built to answer one question: is powered, controlled flight possible on another planet?' },
      did: { text: 'It did not land separately. It travelled attached beneath the Perseverance rover, arriving on February 18, 2021, and was released onto the surface on April 3. On April 19, 2021 it made the first powered, controlled flight on another world. Because radio signals take minutes to cross between planets, an onboard computer flew each flight autonomously, and all communication was relayed through the rover.', highlight: 'body' },
      discovered: { text: 'Planned for up to five test flights, it completed 72, reaching a maximum altitude of 24 m. After its demonstration it became an aerial scout, imaging terrain ahead of the rover. A solar panel above the rotors recharged its batteries between flights.', highlight: 'panel' },
      happened: { text: 'Its final flight was on January 18, 2024. Images returned afterwards showed damage to its rotor blades, and it could no longer fly. NASA announced the end of the mission on January 25, 2024. The helicopter remains in Jezero Crater.', highlight: 'rotors' },
      matters: { text: 'Ingenuity opened a third way to explore other worlds, alongside orbiters and surface vehicles. Its flight data now inform the design of future aircraft for Mars and beyond.', highlight: 'legs' },
    },
  },
  guess: {
    question: 'What do you think this is?',
    kidQuestion: 'A tiny box with propellers… what is it?',
    options: ['A weather vane', 'A drone flown by astronauts', 'The first helicopter to fly on another planet'],
    answer: 2,
    explain: 'It is Ingenuity, which made the first powered, controlled flight on another planet on April 19, 2021. It flew itself: there are no astronauts on Mars.',
  },
  facts: [
    { label: 'Type', value: 'Technology demonstration (not a science rover)' },
    { label: 'Arrival', value: 'Carried beneath the Perseverance rover; it did not land separately' },
    { label: 'Flights', value: '72 (planned: up to 5)' },
    { label: 'Maximum altitude', value: '24 m' },
    { label: 'Equipment', value: 'Rotor blades, solar panel, batteries, cameras, sensors, autonomous computer' },
  ],
  timeline: [
    { date: 'February 18, 2021', kind: 'ARRIVAL', text: 'Arrives on Mars attached beneath Perseverance.' },
    { date: 'April 3, 2021', kind: 'DEPLOYED', text: 'Released onto the Martian surface.' },
    { date: 'April 19, 2021', kind: 'MILESTONE', text: 'First powered, controlled flight on another planet.' },
    { date: 'January 18, 2024', kind: 'MILESTONE', text: 'Flight 72, the last flight; rotor blade damage follows.' },
    { date: 'January 25, 2024', kind: 'OFFICIAL MISSION END', text: 'NASA announces the end of the mission.' },
  ],
  fate: {
    status: 'on-surface',
    headline: 'Grounded with a damaged rotor',
    summary: 'Ingenuity remains in Jezero Crater, upright but unable to fly. Last flight: January 18, 2024. Official mission end: January 25, 2024.',
    kidSummary: 'Its blades got damaged, so it cannot fly any more. It is resting on the sand on Mars after 72 flights!',
  },
  missionStatus: 'Mission complete. Last flight January 18, 2024; official end January 25, 2024.',
  location: 'Jezero Crater',
  coordinates: {
    lat: 18.44,
    lon: 77.45,
    precision: 'approximate',
    note: 'Perseverance landing site in Jezero Crater. Ingenuity ended its mission a few kilometres away; its exact final position is not given here.',
  },
  locationAccuracy: 'illustrative',
  model: { kind: 'ingenuity', note: RECONSTRUCTION_NOTE },
  assets: [],
  audio: AUDIO.ingenuity,
  sources: [SRC.ingenuity, SRC.ingenuityEnd],
}

export const MARS_STORIES: Story[] = [viking1, viking2, sojourner, spirit, opportunity, phoenix, insight, ingenuity]

/** 10.9 Mars timeline: how each generation asked a new question. */
export const MARS_TIMELINE: { year: string; label: string; question: string; storyIds: string[] }[] = [
  { year: '1976', label: 'Viking', question: 'Can we land safely, study the soil, and search for signs of life?', storyIds: [viking1.id, viking2.id] },
  { year: '1997', label: 'Sojourner', question: 'Can a small robot drive across another planet?', storyIds: [sojourner.id] },
  { year: '2004', label: 'Spirit & Opportunity', question: 'What can rocks tell us about ancient water?', storyIds: [spirit.id, opportunity.id] },
  { year: '2008', label: 'Phoenix', question: 'Is water ice hiding beneath the surface?', storyIds: [phoenix.id] },
  { year: '2018', label: 'InSight', question: 'What is happening deep inside Mars?', storyIds: [insight.id] },
  { year: '2021', label: 'Ingenuity', question: 'Can we fly above another planet?', storyIds: [ingenuity.id] },
]

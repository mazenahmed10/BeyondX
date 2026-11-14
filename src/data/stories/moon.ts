import { AUDIO } from './audio'
import { RECONSTRUCTION_NOTE, type Story, type StoryCoordinates, type StorySource } from './types'

const COLLECTION = 'Stories of the Moon'

const SRC = {
  apollo11: { title: 'Apollo 11 Mission Overview', url: 'https://www.nasa.gov/missions/apollo/apollo-11-mission-overview', publisher: 'NASA' },
  lrv: {
    title: '50 Years Ago: First Apollo Astronauts to Drive on the Moon',
    url: 'https://www.nasa.gov/history/50-years-ago-first-apollo-astronauts-to-drive-on-the-moon-took-final-cruise',
    publisher: 'NASA',
  },
  apolloNssdc: { title: 'The Apollo Program (landing sites and surface experiments)', url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo.html', publisher: 'NASA NSSDCA' },
  surveyor: { title: 'Surveyor (1966–1968)', url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/surveyor.html', publisher: 'NASA NSSDCA' },
  impacts: {
    title: 'Table of Anthropogenic Impacts and Spacecraft on the Moon',
    url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html',
    publisher: 'NASA NSSDCA',
  },
} satisfies Record<string, StorySource>

const coord = (lat: number, lon: number, note: string | null = null): StoryCoordinates => ({
  lat,
  lon,
  precision: 'surveyed',
  note: note ?? 'Rounded from NASA NSSDCA landing-site tables.',
})

// ---------------------------------------------------------------------------------------------
// 9.1 Eagle (descent stage only)
// ---------------------------------------------------------------------------------------------
const eagle: Story = {
  id: 'moon-eagle-descent-stage',
  world: 'moon',
  collection: COLLECTION,
  mission: 'Apollo 11',
  equipmentName: 'Eagle — Lunar Module Descent Stage',
  equipmentType: 'lander-stage',
  title: 'The Eagle That Landed on the Moon',
  subtitle: 'Apollo 11 · Lunar Module LM-5 · 1969',
  kidsStory: {
    hook: 'Whoa, look at that! Four skinny legs, wrapped up in shiny gold like a giant candy. It has been sitting here very, very quietly since before your grandparents were grown-ups…',
    steps: {
      what: {
        text: 'This is the bottom half of Eagle, the spaceship that brought the very first people to the Moon! Eagle had two parts, like a bunk bed. The bottom bunk is this landing platform. The top bunk was a tiny cabin for two astronauts.',
        highlight: 'body',
      },
      why: {
        text: 'In July 1969, three astronauts flew to the Moon on a mission called Apollo 11. Eagle had one big job: carry Neil Armstrong and Buzz Aldrin gently down to the ground, and then send them back up again.',
      },
      did: {
        text: 'On July 20, 1969, Eagle floated down on its rocket engine and its four legs touched the dust. Then Neil climbed down the ladder and took the first human steps on the Moon. One small step… one GIANT leap!',
        highlight: 'ladder',
      },
      discovered: {
        text: 'The astronauts scooped up Moon rocks to bring home and set up science gadgets. One is a special mirror. Scientists on Earth still bounce laser light off it today to measure how far away the Moon is!',
      },
      happened: {
        text: 'When it was time to leave, the top half blasted off and used this bottom half as its launch pad. The top half is NOT here. Only the legs and platform stayed, and they have not moved since July 21, 1969.',
        highlight: 'legs',
      },
      matters: {
        text: 'On one leg there is a metal sign. It says: "We came in peace for all mankind." It is a hello from everyone on Earth, and it is still here, waiting on the Moon.',
        highlight: 'plaque',
      },
    },
  },
  adultsStory: {
    hook: 'A squat, foil-wrapped platform on four landing legs, standing in the grey dust of a lunar sea. Nothing has touched it for more than half a century.',
    steps: {
      what: {
        text: 'This is the descent stage of Eagle, Lunar Module LM-5. The Apollo Lunar Module was a two-stage spacecraft built to fly only in vacuum: an ascent stage holding the crew cabin, and beneath it this octagonal descent stage carrying the landing engine, propellant tanks, four landing legs and the ladder. Only the lower stage is here.',
        highlight: 'body',
      },
      why: {
        text: 'Apollo 11 launched on July 16, 1969 with a single objective: land two people on the Moon and return them safely. While Michael Collins stayed in lunar orbit aboard Columbia, the Lunar Module had to carry Neil Armstrong and Buzz Aldrin down to the surface, shelter them there, and get them back up.',
      },
      did: {
        text: 'On July 20, 1969 the throttleable descent engine slowed Eagle out of orbit. Armstrong took manual control to fly past a boulder-strewn crater and set down in the Sea of Tranquility with very little descent propellant to spare. The stage then served as base camp for a moonwalk of about two and a half hours.',
        highlight: 'engine',
      },
      discovered: {
        text: 'The crew returned about 21.5 kg of lunar rock and soil and left a small experiments package beside the lander, including a passive seismometer and a laser retroreflector. That reflector needs no power, and observatories on Earth still range to it to measure the Earth–Moon distance.',
      },
      happened: {
        text: 'On July 21, 1969 the ascent stage fired its engine, using the descent stage as a launch platform, and carried the crew back to lunar orbit. The ascent stage was later jettisoned in orbit and its final fate was not tracked. The descent stage never moved again: it remains at Tranquility Base.',
        highlight: 'legs',
      },
      matters: {
        text: 'Fixed to the leg that carries the ladder is a stainless-steel plaque signed by the three astronauts and President Richard Nixon. It ends with the words "We came in peace for all mankind." The crew came home on July 24, 1969. The platform stayed: the first human outpost on another world.',
        highlight: 'plaque',
      },
    },
  },
  guess: {
    question: 'What do you think this is?',
    kidQuestion: 'What could this golden thing be?',
    options: ['A weather station', 'The landing stage of a crewed Moon lander', 'A fuel tank dropped from orbit'],
    answer: 1,
    explain: 'It is the descent stage of the Apollo 11 Lunar Module, Eagle. The crew cabin on top flew away; this half stayed.',
  },
  facts: [
    { label: 'What remains', value: 'Descent stage only. The ascent stage (crew cabin) left the surface on July 21, 1969.' },
    { label: 'Crew on the surface', value: 'Neil Armstrong and Buzz Aldrin (Michael Collins remained in lunar orbit).' },
    { label: 'Lunar samples returned', value: 'About 21.5 kg' },
    { label: 'Plaque', value: 'On the ladder leg: "We came in peace for all mankind."' },
  ],
  timeline: [
    { date: 'July 16, 1969', kind: 'LAUNCH', text: 'Apollo 11 launches from Kennedy Space Center.' },
    { date: 'July 20, 1969', kind: 'LANDING', text: 'Eagle lands in the Sea of Tranquility; first steps on the Moon.' },
    { date: 'July 21, 1969', kind: 'DEPARTURE', text: 'The ascent stage lifts off and returns to lunar orbit. The descent stage stays.' },
    { date: 'July 24, 1969', kind: 'MILESTONE', text: 'The crew splashes down safely on Earth.' },
  ],
  fate: {
    status: 'on-surface',
    headline: 'Still standing at Tranquility Base',
    summary: 'The descent stage remains exactly where it landed on July 20, 1969. The ascent stage is not on the surface at this site: it returned the crew to orbit and was jettisoned there.',
    kidSummary: 'The bottom half is still right where it landed. The top half flew away with the astronauts!',
  },
  missionStatus: 'Mission complete (1969). Descent stage remains on the Moon.',
  location: 'Mare Tranquillitatis (Sea of Tranquility) — Tranquility Base',
  coordinates: coord(0.67, 23.47),
  locationAccuracy: 'illustrative',
  model: { kind: 'lm-descent', note: RECONSTRUCTION_NOTE },
  assets: [],
  audio: AUDIO.eagle,
  sources: [SRC.apollo11, SRC.apolloNssdc],
}

// ---------------------------------------------------------------------------------------------
// 9.2 Lunar Roving Vehicles (three separate stories)
// ---------------------------------------------------------------------------------------------
interface LrvSpec {
  n: 15 | 16 | 17
  site: string
  coords: StoryCoordinates
  crew: string
  dates: string
  km: string
  title: string
  hookKids: string
  hookAdults: string
  didKids: string
  didAdults: string
  foundKids: string
  foundAdults: string
  happenedKids: string
  happenedAdults: string
  extraFact: { label: string; value: string }
  timeline: Story['timeline']
  highlightDid?: string
}

function lrv(s: LrvSpec): Story {
  return {
    id: `moon-lrv-apollo-${s.n}`,
    world: 'moon',
    collection: COLLECTION,
    mission: `Apollo ${s.n}`,
    equipmentName: `Lunar Roving Vehicle — Apollo ${s.n}`,
    equipmentType: 'crewed-rover',
    title: s.title,
    subtitle: `Apollo ${s.n} · Lunar Roving Vehicle · ${s.dates}`,
    kidsStory: {
      hook: s.hookKids,
      steps: {
        what: {
          text: `It is a Moon Buggy! Its real name is the Lunar Roving Vehicle. It is an electric car with two seats, four wheels and no roof. This one belonged to the astronauts of Apollo ${s.n}.`,
          highlight: 'seats',
        },
        why: {
          text: 'Walking in a big puffy space suit is slow and tiring. With a car, astronauts could zoom much farther from their lander, carry tools, and bring back more Moon rocks.',
        },
        did: { text: s.didKids, highlight: s.highlightDid ?? 'wheels' },
        discovered: { text: s.foundKids },
        happened: { text: s.happenedKids, highlight: 'camera' },
        matters: {
          text: 'Its tires are not rubber. They are made of springy metal wire, so they can never go flat! Engineers still study this little car when they design new Moon rovers.',
          highlight: 'wheels',
        },
      },
    },
    adultsStory: {
      hook: s.hookAdults,
      steps: {
        what: {
          text: `The Lunar Roving Vehicle was a battery-powered, two-seat electric car of about 210 kg, flown folded against the side of the Lunar Module and unfolded on the surface. This is the one driven on Apollo ${s.n} by ${s.crew}.`,
          highlight: 'seats',
        },
        why: {
          text: 'On the first landings astronauts explored on foot and stayed within a short walk of the lander. The rover extended their reach to kilometres, carried tools, samples and a television camera, and turned the last three Apollo missions into true geological field expeditions.',
        },
        did: { text: s.didAdults, highlight: s.highlightDid ?? 'wheels' },
        discovered: { text: s.foundAdults },
        happened: { text: s.happenedAdults, highlight: 'camera' },
        matters: {
          text: 'Each wheel had its own electric motor and a tyre woven from zinc-coated steel wire with titanium treads, a design made for vacuum and extreme temperatures. The three rovers remain the only crewed vehicles ever driven on another world, and a reference for the next generation of lunar rovers.',
          highlight: 'wheels',
        },
      },
    },
    guess: {
      question: 'What do you think this is?',
      kidQuestion: 'Hmm… what has four wheels on the Moon?',
      options: ['A robot rover driven from Earth', 'A broken satellite', 'A car that astronauts drove'],
      answer: 2,
      explain: `It is the Apollo ${s.n} Lunar Roving Vehicle: an electric car driven by astronauts, not a remote-controlled robot.`,
    },
    facts: [
      { label: 'Distance driven', value: `${s.km} km` },
      { label: 'Crew', value: s.crew },
      { label: 'Power', value: 'Two silver-zinc batteries; one electric motor per wheel.' },
      s.extraFact,
    ],
    timeline: s.timeline,
    fate: {
      status: 'on-surface',
      headline: 'Parked near its landing site',
      summary: `The Apollo ${s.n} rover was never meant to return. It was parked a short distance from the Lunar Module and remains at ${s.site}.`,
      kidSummary: 'It is still parked on the Moon, right where the astronauts left it!',
    },
    missionStatus: `Mission complete (${s.dates.slice(-4)}). Rover remains on the Moon.`,
    location: s.site,
    coordinates: s.coords,
    locationAccuracy: 'illustrative',
    model: { kind: 'lrv', variant: `apollo-${s.n}`, note: RECONSTRUCTION_NOTE },
    assets: [],
    audio: AUDIO.lrv,
    sources: [SRC.lrv, SRC.apolloNssdc],
  }
}

const lrv15 = lrv({
  n: 15,
  site: 'Hadley–Apennine (Hadley Rille)',
  coords: coord(26.13, 3.63, 'Apollo 15 landing site (the rover is parked nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'David Scott and James Irwin',
  dates: 'July–August 1971',
  km: '27.8',
  title: 'The First Car on the Moon',
  hookKids: 'Wait a second… are those WHEELS? And seats? Who parks a car next to a mountain on the Moon?!',
  hookAdults: 'Four wire wheels and two empty seats at the foot of the lunar Apennine mountains, beside a canyon carved by ancient lava.',
  didKids: 'In 1971 astronauts Dave Scott and Jim Irwin became the first people ever to drive on the Moon! They drove 27.8 kilometers over three trips, all the way to the edge of a giant canyon called Hadley Rille.',
  didAdults: 'Deployed on July 31, 1971, it was the first wheeled vehicle driven by humans on another world. Over three excursions it covered 27.8 km, taking the crew to the edge of Hadley Rille and onto the lower slopes of Mount Hadley Delta.',
  foundKids: 'Thanks to the buggy, they found a sparkly white rock that is about four billion years old. People call it the Genesis Rock. It is a piece of the Moon\'s very first crust!',
  foundAdults: 'The rover made possible the collection of sample 15415, the "Genesis Rock": an anorthosite about four billion years old, a fragment of the Moon\'s early crust.',
  happenedKids: 'When the trip was over, Dave parked the buggy and pointed its TV camera at the lander. The camera filmed the astronauts blasting off for home. The buggy stayed behind.',
  happenedAdults: 'Scott parked the rover east of the Lunar Module so its remotely operated television camera could watch the lift-off on August 2, 1971. It has stood at Hadley ever since.',
  extraFact: { label: 'First', value: 'First crewed vehicle driven on another world.' },
  timeline: [
    { date: 'July 26, 1971', kind: 'LAUNCH', text: 'Apollo 15 launches.' },
    { date: 'July 30, 1971', kind: 'LANDING', text: 'Lunar Module Falcon lands at Hadley–Apennine.' },
    { date: 'July 31, 1971', kind: 'DEPLOYED', text: 'First drive of a Lunar Roving Vehicle.' },
    { date: 'August 2, 1971', kind: 'DEPARTURE', text: 'The crew lifts off. The rover stays at Hadley.' },
  ],
})

const lrv16 = lrv({
  n: 16,
  site: 'Descartes Highlands',
  coords: coord(-8.97, 15.5, 'Apollo 16 landing site (the rover is parked nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'John Young and Charles Duke',
  dates: 'April 1972',
  km: '26.7',
  title: 'The Highland Racer',
  hookKids: 'Something with wheels is parked up in the bright, bumpy hills of the Moon. Vroom vroom… but who was driving?',
  hookAdults: 'A small open-frame vehicle rests among the pale, cratered hills of the lunar highlands, far from the dark volcanic plains.',
  didKids: 'In April 1972 astronauts John Young and Charlie Duke drove this buggy 26.7 kilometers through the Moon\'s bright highlands. John even did a test drive called the "Grand Prix", bouncing and skidding while Charlie filmed it!',
  didAdults: 'Between April 21 and 23, 1972 it carried Young and Duke 26.7 km across the Descartes Highlands, the only Apollo landing in the lunar highlands. Young also drove it hard through a filmed engineering test nicknamed the "Grand Prix" to record how it handled in one-sixth gravity.',
  foundKids: 'Scientists thought these hills were made by volcanoes. Surprise! The rocks the astronauts collected were smashed-together rocks made by giant space-rock crashes instead.',
  foundAdults: 'Before the flight, geologists expected volcanic rock at Descartes. The samples gathered along the rover\'s traverses were instead mostly breccias formed by impacts, overturning the prediction and changing how the highlands were understood.',
  happenedKids: 'At the end, the buggy was parked so its camera could watch the astronauts lift off. Then everything went quiet. It is still sitting in the highlands today.',
  happenedAdults: 'The rover was parked to televise the ascent, which came a few hours after the last excursion (April 23, 1972 in the United States; April 24 UTC), and was left in the Descartes Highlands, where it remains.',
  extraFact: { label: 'Only highland site', value: 'Apollo 16 was the only Apollo landing in the lunar highlands.' },
  timeline: [
    { date: 'April 16, 1972', kind: 'LAUNCH', text: 'Apollo 16 launches.' },
    { date: 'April 21, 1972', kind: 'DEPLOYED', text: 'First of three rover excursions in the Descartes Highlands.' },
    { date: 'April 23–24, 1972', kind: 'DEPARTURE', text: 'Last excursion; the crew lifts off hours later and the rover stays.' },
  ],
})

const lrv17 = lrv({
  n: 17,
  site: 'Taurus–Littrow Valley',
  coords: coord(20.19, 30.77, 'Apollo 17 landing site (the rover is parked nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'Eugene Cernan and Harrison Schmitt',
  dates: 'December 1972',
  km: '35.9',
  title: 'The Last Drive — and a Duct-Tape Repair',
  hookKids: 'Another set of wheels! But look closely… one fender looks funny. Is that… PAPER taped onto a Moon car?!',
  hookAdults: 'A rover parked in a mountain-ringed valley. One rear fender is not original: it is a rectangle of stiff paper, held on with tape and clamps.',
  didKids: 'In December 1972 astronauts Gene Cernan and Jack Schmitt drove 35.9 kilometers, farther than any other Moon buggy. But a hammer bumped a fender and broke it. Moon dust sprayed everywhere! So they made a new fender out of maps and sticky duct tape. It worked!',
  didAdults: 'In December 1972 it carried Cernan and geologist Harrison Schmitt 35.9 km, the longest distance of the three rovers. Early in the first excursion a hammer caught the right rear fender and broke off its extension, showering the crew with abrasive dust. Before the second excursion they taped four laminated maps together and clamped them on as a replacement. The improvised fender held.',
  highlightDid: 'fender',
  foundKids: 'With their fixed-up buggy they found something amazing: orange soil! It was made of tiny glass beads from a fiery fountain of lava, billions of years ago.',
  foundAdults: 'The traverses reached Shorty crater, where Schmitt spotted orange soil: microscopic beads of volcanic glass from an ancient lava fountain. The mission returned about 110 kg of samples, the most of any Apollo flight.',
  happenedKids: 'This buggy filmed the very last astronauts leaving the Moon. Nobody has driven on the Moon since. It is still parked in the valley, waiting.',
  happenedAdults: 'Parked a short distance from the lander, its camera televised the lift-off of the last crew to walk on the Moon on December 14, 1972. The rover has been at Taurus–Littrow ever since.',
  extraFact: { label: 'Field repair', value: 'Replacement fender made from four laminated maps, duct tape and clamps.' },
  timeline: [
    { date: 'December 7, 1972', kind: 'LAUNCH', text: 'Apollo 17 launches.' },
    { date: 'December 11, 1972', kind: 'DEPLOYED', text: 'First excursion; the right rear fender extension is broken.' },
    { date: 'December 12, 1972', kind: 'MILESTONE', text: 'Fender rebuilt from maps and duct tape before the second excursion.' },
    { date: 'December 14, 1972', kind: 'DEPARTURE', text: 'The last crew leaves the Moon. The rover stays.' },
  ],
})

// ---------------------------------------------------------------------------------------------
// 9.3 ALSEP stations (five separate stories; Apollo 13 never landed)
// ---------------------------------------------------------------------------------------------
interface AlsepSpec {
  n: 12 | 14 | 15 | 16 | 17
  site: string
  coords: StoryCoordinates
  crew: string
  deployed: string
  title: string
  instruments: string
  hookKids: string
  hookAdults: string
  didKids: string
  didAdults: string
  foundKids: string
  foundAdults: string
  extraTimeline?: Story['timeline']
  highlightDid?: string
}

function alsep(s: AlsepSpec): Story {
  return {
    id: `moon-alsep-apollo-${s.n}`,
    world: 'moon',
    collection: COLLECTION,
    mission: `Apollo ${s.n}`,
    equipmentName: `ALSEP Science Station — Apollo ${s.n}`,
    equipmentType: 'science-station',
    title: s.title,
    subtitle: `Apollo ${s.n} · Apollo Lunar Surface Experiments Package · deployed ${s.deployed}`,
    kidsStory: {
      hook: s.hookKids,
      steps: {
        what: {
          text: `It is a science station called ALSEP! Think of it as a robot laboratory. A box in the middle is the "brain". Wires run out to science gadgets all around it. Apollo ${s.n} astronauts set this one up.`,
          highlight: 'central',
        },
        why: {
          text: 'Astronauts could only stay on the Moon for a few days. Scientists wanted to keep learning for YEARS. So the astronauts left a lab that could work all by itself and send messages to Earth.',
          highlight: 'antenna',
        },
        did: { text: s.didKids, highlight: s.highlightDid ?? 'instruments' },
        discovered: { text: s.foundKids },
        happened: {
          text: 'The station had a special nuclear battery, so it kept working through the freezing two-week Moon nights. On September 30, 1977, NASA switched all the stations off. They are still sitting here, silent.',
          highlight: 'rtg',
        },
        matters: {
          text: 'Scientists are STILL studying the messages these stations sent, and finding new things! That is like finding a new secret in a very old diary.',
        },
      },
    },
    adultsStory: {
      hook: s.hookAdults,
      steps: {
        what: {
          text: `The Apollo Lunar Surface Experiments Package was an automated science station carried on Apollo 12 and 14 to 17. It had three elements: a Central Station that gathered data and talked to Earth, a set of instruments cabled to it, and a radioisotope thermoelectric generator. This station was laid out by ${s.crew}. Its instruments: ${s.instruments}.`,
          highlight: 'central',
        },
        why: {
          text: 'A crew could stay for days; understanding the Moon required years of continuous measurement. ALSEP was designed to keep observing after the astronauts left, building a geophysical network across several landing sites.',
          highlight: 'antenna',
        },
        did: { text: s.didAdults, highlight: s.highlightDid ?? 'instruments' },
        discovered: { text: s.foundAdults },
        happened: {
          text: 'Power came from an RTG that converts the heat of decaying plutonium-238 into electricity, so the station ran through the two-week lunar night. As output and budgets declined, NASA ended ALSEP operations on September 30, 1977. The hardware was simply switched off and remains in place.',
          highlight: 'rtg',
        },
        matters: {
          text: 'The ALSEP records are still the only long-term surface geophysics data set from the Moon. Researchers continue to re-analyse them with modern methods, and they shape the design of the next generation of lunar stations.',
        },
      },
    },
    guess: {
      question: 'What do you think this is?',
      kidQuestion: 'Boxes, wires and gadgets… what is it?',
      options: ['An automatic science station', 'Parts that fell off a rocket', 'A campsite for astronauts'],
      answer: 0,
      explain: `It is the Apollo ${s.n} ALSEP: a science station that kept working by itself after the astronauts went home.`,
    },
    facts: [
      { label: 'Instruments at this station', value: s.instruments },
      { label: 'Power', value: 'Radioisotope thermoelectric generator (heat from plutonium-238).' },
      { label: 'Deployed by', value: s.crew },
      { label: 'Not at Apollo 13', value: 'Apollo 13 did not land, so it deployed no ALSEP.' },
    ],
    timeline: [
      { date: s.deployed, kind: 'DEPLOYED', text: `Apollo ${s.n} ALSEP is set up at ${s.site}.` },
      ...(s.extraTimeline ?? []),
      { date: 'September 30, 1977', kind: 'OPERATIONS END', text: 'NASA ends ALSEP operations; the stations are switched off.' },
    ],
    fate: {
      status: 'on-surface',
      headline: 'Switched off, still in place',
      summary: `The Apollo ${s.n} station was commanded off with the rest of the network on September 30, 1977. All of its hardware remains at ${s.site}.`,
      kidSummary: 'It was switched off in 1977, but every piece is still sitting on the Moon.',
    },
    missionStatus: 'Operations ended September 30, 1977. Hardware remains on the Moon.',
    location: s.site,
    coordinates: s.coords,
    locationAccuracy: 'illustrative',
    model: { kind: 'alsep', variant: `apollo-${s.n}`, note: RECONSTRUCTION_NOTE },
    assets: [],
    audio: AUDIO.alsep,
    sources: [SRC.apolloNssdc],
  }
}

const alsep12 = alsep({
  n: 12,
  site: 'Oceanus Procellarum (Ocean of Storms)',
  coords: coord(-3.01, -23.42, 'Apollo 12 landing site (the station stands nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'Charles "Pete" Conrad and Alan Bean',
  deployed: 'November 19, 1969',
  title: "The Moon's First Permanent Science Laboratory",
  instruments: 'passive seismometer, magnetometer, solar wind spectrometer, ion detector and cold cathode gauge',
  hookKids: 'Psst… look! A box with a funny antenna, and wires going everywhere like spaghetti. Nobody is here, but it looks like somebody was doing science!',
  hookAdults: 'A low metal box with a helical antenna, cables fanning out across the dust to a ring of smaller instruments. No footprints have been added here since 1969.',
  didKids: 'This was the very FIRST one, set up on November 19, 1969. Its seismometer is like a super-sensitive ear on the ground. It listened for moonquakes, which are earthquakes on the Moon!',
  didAdults: 'Deployed on November 19, 1969, it was the first full ALSEP. Its passive seismometer began recording at once; days later the discarded Lunar Module ascent stage was deliberately crashed into the Moon, and the instrument recorded the ground "ringing" for close to an hour.',
  foundKids: 'When a piece of spaceship was crashed into the Moon on purpose, the ground kept shaking for almost an hour. Scientists said the Moon rang like a bell!',
  foundAdults: 'That long reverberation revealed a dry, heavily fractured outer crust very unlike Earth\'s. The magnetometer and solar-wind instruments measured the Moon\'s weak local magnetic fields and the stream of particles reaching its surface.',
})

const alsep14 = alsep({
  n: 14,
  site: 'Fra Mauro Highlands',
  coords: coord(-3.65, -17.47, 'Apollo 14 landing site (the station stands nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'Alan Shepard and Edgar Mitchell',
  deployed: 'February 5, 1971',
  title: 'The Station That Thumped the Moon',
  instruments: 'passive seismometer, active seismic experiment, ion detector, cold cathode gauge and charged particle experiment',
  hookKids: 'More boxes and wires! And a long line of little sensors stretched across the ground. Somebody was listening very carefully here…',
  hookAdults: 'A central box, a finned generator, and a straight cable lined with small sensors laid out across the Fra Mauro hills.',
  didKids: 'On February 5, 1971, astronaut Ed Mitchell walked along with a "thumper" stick. Thump! Thump! Each thump made a tiny shake, and sensors in the ground listened to it, like tapping on a watermelon to hear what is inside.',
  didAdults: 'Activated on February 5, 1971, this station added an Active Seismic Experiment. Mitchell fired small charges from a hand-held "thumper" along a line of geophones, sending seismic waves through the upper layers of the regolith.',
  highlightDid: 'instruments',
  foundKids: 'The thumps showed that the top of the Moon is a thick blanket of dust and broken rock. And this station kept sending science to Earth for more than six years!',
  foundAdults: 'The thumper profile measured the thickness and structure of the loose surface layer at Fra Mauro. Together with the Apollo 12 seismometer it formed the first two-station seismic network on another world, and it transmitted until the network shutdown in 1977: 6 years, 7 months and 25 days.',
  extraTimeline: [{ date: 'February 5, 1971', kind: 'MILESTONE', text: 'Station activated; thumper experiment performed.' }],
})

const alsep15 = alsep({
  n: 15,
  site: 'Hadley–Apennine',
  coords: coord(26.13, 3.63, 'Apollo 15 landing site (the station stands nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'David Scott and James Irwin',
  deployed: 'July 31, 1971',
  title: "Taking the Moon's Temperature",
  instruments: 'passive seismometer, magnetometer, solar wind spectrometer, ion detector, cold cathode gauge and heat flow experiment',
  hookKids: 'A science spot near the mountains! There are boxes, wires… and two little holes drilled into the ground. Why would anyone drill holes in the Moon?',
  hookAdults: 'An instrument array near the foot of the Apennine mountains, with two slender probes sunk into holes drilled in the regolith.',
  didKids: 'On July 31, 1971, astronaut Dave Scott drilled holes in the ground. It was really hard work! Then he slid long thermometers inside to take the Moon\'s temperature from the inside.',
  didAdults: 'Deployed on July 31, 1971, this was the first station with a Heat Flow Experiment. Scott fought a stubborn drill to sink two holes into the regolith, and temperature probes were lowered into them.',
  foundKids: 'The thermometers found a tiny bit of heat leaking out from deep inside the Moon. The Moon is not completely cold inside!',
  foundAdults: 'The probes made the first direct measurement of heat escaping from the lunar interior. With its seismometer, this station completed a three-point network with Apollo 12 and 14, allowing moonquakes to be located.',
})

const alsep16 = alsep({
  n: 16,
  site: 'Descartes Highlands',
  coords: coord(-8.97, 15.5, 'Apollo 16 landing site (the station stands nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'John Young and Charles Duke',
  deployed: 'April 21, 1972',
  title: 'The Highland Listening Post',
  instruments: 'passive seismometer, active seismic experiment, magnetometer and heat flow experiment (lost when its cable broke)',
  hookKids: 'A science station up in the hills! But uh-oh… one of the wires looks like it snapped. What happened here?',
  hookAdults: 'An instrument array in the lunar highlands. One flat cable ends abruptly, torn from its connector.',
  didKids: 'On April 21, 1972, astronauts set up this station. Oops! John Young\'s boot got tangled in a wire and it snapped, so one experiment could not work. Even astronauts trip sometimes! The other gadgets worked great.',
  didAdults: 'Deployed on April 21, 1972. During set-up Young caught his boot on the Heat Flow Experiment cable and tore it from the Central Station, ending that experiment before it began. The seismometers and magnetometer worked as planned.',
  foundKids: 'This station became the fourth "ear" listening to the Moon. With four ears in different places, scientists could tell exactly where each moonquake came from.',
  foundAdults: 'It became the fourth and final node of the Apollo passive seismic network. Its magnetometer recorded some of the strongest local surface magnetic fields measured on the Moon.',
  highlightDid: 'instruments',
})

const alsep17 = alsep({
  n: 17,
  site: 'Taurus–Littrow Valley',
  coords: coord(20.19, 30.77, 'Apollo 17 landing site (the station stands nearby). Rounded from NASA NSSDCA tables.'),
  crew: 'Eugene Cernan and Harrison Schmitt',
  deployed: 'December 11, 1972',
  title: 'The Last Laboratory',
  instruments: 'heat flow experiment, lunar surface gravimeter, atmospheric composition experiment, ejecta and meteorites experiment and seismic profiling experiment',
  hookKids: 'The last science station on the Moon! Its gadgets look different from the others. What new tricks did this one have?',
  hookAdults: 'The final instrument array left by Apollo, in a valley between massifs. Its set of experiments is unlike any of the earlier stations.',
  didKids: 'In December 1972, the last Moon astronauts set up this station with brand-new gadgets. One sniffed for the Moon\'s super-thin air. One watched for tiny space dust. Another took the Moon\'s temperature again.',
  didAdults: 'Deployed on December 11, 1972, it carried an almost entirely new instrument set and no passive seismometer. After the crew left, explosive charges placed along their traverses were detonated by remote command for the seismic profiling experiment.',
  foundKids: 'It measured heat coming from inside the Moon one more time, and found tiny wisps of gas above the ground. The Moon has an "almost-nothing" atmosphere!',
  foundAdults: 'It returned a second heat-flow measurement and detected traces of gases such as argon and helium in the extremely thin lunar exosphere. The gravimeter did not work as designed, a reminder that not every experiment succeeded.',
})

// ---------------------------------------------------------------------------------------------
// 9.4 Surveyor landers (seven separate stories; 2 and 4 are impact sites, not intact landers)
// ---------------------------------------------------------------------------------------------
interface SurveyorSpec {
  n: 1 | 3 | 5 | 6 | 7
  site: string
  coords: StoryCoordinates
  launched: string
  landed: string
  title: string
  variant: string
  hookKids: string
  hookAdults: string
  didKids: string
  didAdults: string
  foundKids: string
  foundAdults: string
  happenedKids: string
  happenedAdults: string
  highlightDid: string
  extraFact: { label: string; value: string }
  extraTimeline?: Story['timeline']
}

function surveyor(s: SurveyorSpec): Story {
  return {
    id: `moon-surveyor-${s.n}`,
    world: 'moon',
    collection: COLLECTION,
    mission: `Surveyor ${s.n}`,
    equipmentName: `Surveyor ${s.n} Lunar Lander`,
    equipmentType: 'robotic-lander',
    title: s.title,
    subtitle: `Surveyor ${s.n} · Robotic soft lander · landed ${s.landed}`,
    kidsStory: {
      hook: s.hookKids,
      steps: {
        what: {
          text: `It is Surveyor ${s.n}, a robot lander! It has three legs, a tall pole with a sun-catching panel on top, and a TV camera eye. No people rode on it. It flew to the Moon all by itself.`,
          highlight: 'legs',
        },
        why: {
          text: 'Before astronauts could land, NASA had a scary question: is the Moon\'s dust so deep that a spaceship would sink? The Surveyor robots went first to check that the ground was safe.',
        },
        did: { text: s.didKids, highlight: s.highlightDid },
        discovered: { text: s.foundKids },
        happened: { text: s.happenedKids },
        matters: {
          text: 'The Surveyor robots were the brave scouts. Because they proved the ground was safe, astronauts could follow. Every Moon landing since owes them a thank-you!',
        },
      },
    },
    adultsStory: {
      hook: s.hookAdults,
      steps: {
        what: {
          text: `Surveyor ${s.n} was one of seven robotic landers built for NASA under the management of the Jet Propulsion Laboratory: a triangular aluminium frame on three shock-absorbing legs, with a mast carrying a solar panel and antenna, a television camera, and a landing radar that controlled its vernier engines.`,
          highlight: 'legs',
        },
        why: {
          text: 'Before Apollo, no one knew whether the lunar surface could bear the weight of a crewed lander or would swallow it in dust. The Surveyor program was sent to demonstrate soft landing and to measure the surface that astronauts would have to trust.',
        },
        did: { text: s.didAdults, highlight: s.highlightDid },
        discovered: { text: s.foundAdults },
        happened: { text: s.happenedAdults },
        matters: {
          text: 'Five successful Surveyors showed that the lunar surface was firm enough for Apollo and returned the first detailed pictures and soil measurements from the ground. They are the direct ancestors of every robotic lander that followed.',
        },
      },
    },
    guess: {
      question: 'What do you think this is?',
      kidQuestion: 'Three legs and a camera eye… what is it?',
      options: ['A robot lander that came before the astronauts', 'An astronaut\'s tent', 'A television satellite that fell down'],
      answer: 0,
      explain: `It is Surveyor ${s.n}, a robotic lander sent to test the surface before any astronaut arrived.`,
    },
    facts: [
      { label: 'Launched', value: s.launched },
      { label: 'Soft landing', value: s.landed },
      { label: 'Program result', value: 'Five soft landings (Surveyor 1, 3, 5, 6, 7); two failures (Surveyor 2 and 4).' },
      s.extraFact,
    ],
    timeline: [
      { date: s.launched, kind: 'LAUNCH', text: `Surveyor ${s.n} launches on an Atlas-Centaur rocket.` },
      { date: s.landed, kind: 'LANDING', text: `Soft landing at ${s.site}.` },
      ...(s.extraTimeline ?? []),
    ],
    fate: {
      status: 'on-surface',
      headline: 'Still standing where it landed',
      summary: `Surveyor ${s.n} was built to land, not to leave. After its surface operations ended it fell silent and remains at ${s.site}.`,
      kidSummary: 'Its job is done, and it is still standing on its three legs on the Moon.',
    },
    missionStatus: 'Mission complete. Lander remains on the Moon.',
    location: s.site,
    coordinates: s.coords,
    locationAccuracy: 'illustrative',
    model: { kind: 'surveyor', variant: s.variant, note: RECONSTRUCTION_NOTE },
    assets: [],
    audio: AUDIO.surveyor,
    sources: [SRC.surveyor, SRC.impacts],
  }
}

const surveyorCoord = (lat: number, lon: number) =>
  coord(lat, lon, 'Rounded from NASA NSSDCA tables; published values differ by a few hundredths of a degree between sources.')

const surveyor1 = surveyor({
  n: 1,
  site: 'Oceanus Procellarum (Ocean of Storms)',
  coords: surveyorCoord(-2.47, -43.34),
  launched: 'May 30, 1966',
  landed: 'June 2, 1966',
  title: 'The Robot That Landed First',
  variant: 'camera',
  hookKids: 'A lonely three-legged robot on a big flat plain. It looks like it has been waiting a long, long time. Who sent it?',
  hookAdults: 'A three-legged frame with a single mast, alone on a wide volcanic plain. It arrived three years before any human.',
  didKids: 'On June 2, 1966, Surveyor 1 landed softly on its very first try! Then its camera started snapping pictures. It took more than 11,000 photos, including photos of its own foot.',
  didAdults: 'On June 2, 1966, on the program\'s first attempt, Surveyor 1 became the first American spacecraft to soft-land on another world. Its television camera returned more than 11,000 images of the surrounding plain and of its own footpads.',
  highlightDid: 'camera',
  foundKids: 'Look at its foot! It only sank a tiny bit into the dust. That told scientists the Moon\'s ground is firm enough to stand on. Phew!',
  foundAdults: 'The footpads had sunk only a few centimetres. That single observation answered the program\'s central question: the mare surface was firm enough to support a landing spacecraft.',
  happenedKids: 'Surveyor 1 worked for months, even waking up after freezing Moon nights. Its last message came in January 1967. It is still standing on the Ocean of Storms.',
  happenedAdults: 'It survived several lunar nights; the last contact was in January 1967. The lander remains on Oceanus Procellarum.',
  extraFact: { label: 'First', value: 'First American soft landing on another world.' },
  extraTimeline: [{ date: 'January 1967', kind: 'LAST CONTACT', text: 'Final contact with Surveyor 1.' }],
})

const surveyor3 = surveyor({
  n: 3,
  site: 'Oceanus Procellarum (Ocean of Storms)',
  coords: surveyorCoord(-3.02, -23.42),
  launched: 'April 17, 1967',
  landed: 'April 20, 1967',
  title: 'The Robot That Got Visitors',
  variant: 'scoop-nocam',
  hookKids: 'This three-legged robot is sitting inside a crater. And guess what? Something is missing from it. Somebody TOOK a piece!',
  hookAdults: 'A lander resting on the inner slope of a shallow crater. Its television camera is missing: cut away by hand.',
  didKids: 'Surveyor 3 landed on April 20, 1967, but its engines forgot to turn off, so it bounced like a kangaroo before it stopped! Then it used a little scoop on an arm to dig in the Moon dirt.',
  didAdults: 'On April 20, 1967 its engines failed to cut off at touchdown and the lander hopped twice before settling inside a crater. It then used a surface sampler, a small motorised scoop, to dig trenches and press on the soil.',
  highlightDid: 'scoop',
  foundKids: 'The scoop showed that Moon dirt is a bit like damp sand. You can dig it, and it holds its shape.',
  foundAdults: 'The trenches showed how lunar soil behaves mechanically: fine-grained, slightly cohesive, and stronger with depth. These were the first excavations on another world.',
  happenedKids: 'Two and a half years later, Apollo 12 astronauts landed close by and WALKED over to visit it! They snipped off its camera and took it home to Earth. The rest of the robot is still in its crater.',
  happenedAdults: 'In November 1969 Apollo 12 landed about 180 m away. Pete Conrad and Alan Bean walked to the lander, removed its camera and other parts, and returned them to Earth so engineers could study the effects of 31 months on the Moon. The rest of Surveyor 3 is still there.',
  extraFact: { label: 'Visited by', value: 'Apollo 12 astronauts, November 1969: the only probe visited by humans on another world.' },
  extraTimeline: [{ date: 'November 20, 1969', kind: 'MILESTONE', text: 'Apollo 12 astronauts visit the lander and remove its camera.' }],
})

const surveyor5 = surveyor({
  n: 5,
  site: 'Mare Tranquillitatis (Sea of Tranquility)',
  coords: surveyorCoord(1.46, 23.19),
  launched: 'September 8, 1967',
  landed: 'September 11, 1967',
  title: 'The Robot Chemist',
  variant: 'alpha',
  hookKids: 'A robot lander with a little box lowered down onto the ground on a string. What is that box doing? Is it… tasting the Moon?',
  hookAdults: 'A lander on the Sea of Tranquility with a small boxlike instrument lowered to the soil beneath it.',
  didKids: 'Surveyor 5 almost did not make it! It had a leak on the way, so engineers quickly invented a new landing plan. It landed safely on September 11, 1967, and lowered a little chemistry box onto the ground.',
  didAdults: 'A helium leak in flight forced engineers to redesign the descent sequence while the spacecraft was on its way. It still landed safely on September 11, 1967 and lowered an alpha-scattering instrument onto the soil.',
  highlightDid: 'alpha',
  foundKids: 'The chemistry box found out what Moon dirt is made of. It is a lot like basalt, the dark rock that volcanoes make on Earth!',
  foundAdults: 'The instrument performed the first chemical analysis of another world from its surface. The composition resembled terrestrial basalt, evidence that the dark lunar maria are volcanic.',
  happenedKids: 'Its last message came in December 1967. It still sits in the Sea of Tranquility, the same "sea" where the first astronauts landed two years later.',
  happenedAdults: 'Its last transmission came in December 1967. The lander remains in Mare Tranquillitatis, the same mare where Apollo 11 landed in 1969.',
  extraFact: { label: 'First', value: 'First in-place chemical analysis of lunar soil.' },
  extraTimeline: [{ date: 'December 1967', kind: 'LAST DATA', text: 'Final transmission from Surveyor 5.' }],
})

const surveyor6 = surveyor({
  n: 6,
  site: 'Sinus Medii (Central Bay)',
  coords: surveyorCoord(0.47, -1.43),
  launched: 'November 7, 1967',
  landed: 'November 10, 1967',
  title: 'The Robot That Hopped',
  variant: 'alpha',
  hookKids: 'Look at the ground near this robot. There are footprints from its three feet… in TWO different places! Did it jump?!',
  hookAdults: 'A lander in the very centre of the Moon\'s near side. Beside it are the imprints of its own footpads, a couple of metres away.',
  didKids: 'It did jump! After landing on November 10, 1967, Surveyor 6 fired its little engines again a week later. It hopped up about as high as a basketball hoop and landed a few steps to the side.',
  didAdults: 'After landing on November 10, 1967, controllers re-ignited its vernier engines on November 17 for about 2.5 seconds. The lander rose roughly 4 m and came down about 2.4 m away: the first powered lift-off from the lunar surface.',
  highlightDid: 'engine',
  foundKids: 'After the hop, its camera looked back at its old footprints and the spot its engines blasted. That showed how Moon dust behaves when a rocket fires on it. Very handy for astronauts later!',
  foundAdults: 'Photographing its original footprints and the engine-blasted soil showed how the surface responds to rocket exhaust, valuable knowledge for a crewed lift-off. With this flight the program had met its obligations to Apollo.',
  happenedKids: 'Surveyor 6 sent its last message in December 1967. It still stands in the middle of the Moon\'s face, a few steps from where it first landed.',
  happenedAdults: 'Contact ended in December 1967. Surveyor 6 remains in Sinus Medii, a short hop from its original landing point.',
  extraFact: { label: 'First', value: 'First lift-off from the lunar surface (about 2.4 m sideways).' },
  extraTimeline: [
    { date: 'November 17, 1967', kind: 'MILESTONE', text: 'Engines re-fired: the lander hops about 2.4 m.' },
    { date: 'December 1967', kind: 'LAST CONTACT', text: 'Final contact with Surveyor 6.' },
  ],
})

const surveyor7 = surveyor({
  n: 7,
  site: 'Outer rim of Tycho crater (southern highlands)',
  coords: surveyorCoord(-40.98, -11.51),
  launched: 'January 7, 1968',
  landed: 'January 10, 1968',
  title: 'The Last Scout, Among the Mountains',
  variant: 'scoop-alpha',
  hookKids: 'This robot is far away from all the others, up in rough, rocky mountains near a giant crater. Brave little robot! Why did it come all the way out here?',
  hookAdults: 'A lander far from the smooth plains, on rugged highland ground thrown out by one of the Moon\'s youngest great craters.',
  didKids: 'The first four robots landed on flat plains. Surveyor 7 was the daredevil! On January 10, 1968, it landed in the bumpy highlands near Tycho crater, with both a digging scoop AND a chemistry box.',
  didAdults: 'With Apollo\'s needs met, the final Surveyor was sent for science. On January 10, 1968 it landed on the ejecta blanket of Tycho crater carrying both a surface sampler and an alpha-scattering instrument, and returned about 21,000 images.',
  highlightDid: 'scoop',
  foundKids: 'It found that mountain dirt is different from plains dirt. When the chemistry box got stuck, the scoop arm gave it a helpful push. Teamwork!',
  foundAdults: 'Its analysis showed highland material chemically distinct from the maria, with less iron. When the alpha-scattering instrument failed to lower fully, controllers used the scoop to push it into place. It also detected laser beams aimed at it from Earth.',
  happenedKids: 'Surveyor 7 sent its last message in February 1968. It was the last Surveyor ever, and it is still up there by Tycho.',
  happenedAdults: 'The last contact was in February 1968, closing the Surveyor program. The lander remains near the rim of Tycho.',
  extraFact: { label: 'Only highland Surveyor', value: 'The only Surveyor to land in the lunar highlands.' },
  extraTimeline: [{ date: 'February 1968', kind: 'LAST CONTACT', text: 'Final contact; the Surveyor program ends.' }],
})

/** Surveyor 2 and 4 never soft-landed. They are historical impact markers, not intact landers. */
const surveyor2: Story = {
  id: 'moon-surveyor-2',
  world: 'moon',
  collection: COLLECTION,
  mission: 'Surveyor 2',
  equipmentName: 'Surveyor 2 — Impact Site',
  equipmentType: 'impact-site',
  title: 'The Robot That Tumbled',
  subtitle: 'Surveyor 2 · Failed landing · impact September 23, 1966',
  kidsStory: {
    hook: 'Hmm, this one is different. No legs standing up. No camera looking around. Just a little crater and some twisted bits of metal. What happened here?',
    steps: {
      what: { text: 'These are the remains of Surveyor 2, a robot lander that was supposed to land softly, just like its sister Surveyor 1. Sadly, it crashed instead.', highlight: 'debris' },
      why: { text: 'It had the same job as the other Surveyors: check that the Moon is safe for astronauts, and take lots of pictures of a new place.' },
      did: { text: 'On the way to the Moon, it had to fire three small engines to steer. Only two worked! With a push on one side only, the robot started to spin like a top. Engineers tried 39 times to fix it.' },
      discovered: { text: 'It could not take any pictures of the Moon. But engineers learned exactly what went wrong, and they made the next robots better. Mistakes can be teachers!' },
      happened: { text: 'Still spinning, Surveyor 2 hit the Moon on September 23, 1966, somewhere near a big crater called Copernicus. Nobody knows the exact spot.', highlight: 'crater' },
      matters: { text: 'Going to space is REALLY hard, and not every try works. Surveyor 2 reminds us that explorers keep going, even after a crash.' },
    },
  },
  adultsStory: {
    hook: 'No lander stands here. Only a small, fresh crater and scattered fragments: the mark of a mission that never slowed down.',
    steps: {
      what: { text: 'This marker represents Surveyor 2, the second lander of the program. It did not soft-land. What remains is impact debris, not an intact spacecraft.', highlight: 'debris' },
      why: { text: 'It was to repeat the success of Surveyor 1 at a second candidate Apollo site, Sinus Medii, and photograph the surface there.' },
      did: { text: 'Launched on September 20, 1966, it attempted a mid-course correction the next day. One of its three vernier engines failed to ignite, and the unbalanced thrust sent the spacecraft tumbling. Controllers made 39 attempts to recover it.' },
      discovered: { text: 'No lunar science was returned. The failure investigation, however, fed directly into the engine and procedure checks used on the later, successful Surveyors.' },
      happened: { text: 'Contact was lost on September 22, and the tumbling spacecraft struck the Moon on September 23, 1966 (the date differs by a day between time zones and sources), southeast of Copernicus crater. The exact point of impact has never been identified.', highlight: 'crater' },
      matters: { text: 'Two of seven Surveyors were lost. The program\'s record is part of its lesson: the soft landings that paved the way for Apollo were not routine, and each failure tightened the engineering that followed.' },
    },
  },
  guess: {
    question: 'What do you think happened here?',
    kidQuestion: 'A crater and broken bits… what happened?',
    options: ['Astronauts left their rubbish here', 'A robot lander crashed instead of landing', 'A meteorite made of metal fell here'],
    answer: 1,
    explain: 'It is the impact site of Surveyor 2, which tumbled out of control and hit the Moon in September 1966.',
  },
  facts: [
    { label: 'Outcome', value: 'Failed: no soft landing. Impact, not an intact lander.' },
    { label: 'Cause', value: 'One of three vernier engines did not ignite during the mid-course correction.' },
    { label: 'Impact site', value: 'Southeast of Copernicus crater. Exact location unknown.' },
  ],
  timeline: [
    { date: 'September 20, 1966', kind: 'LAUNCH', text: 'Surveyor 2 launches.' },
    { date: 'September 22, 1966', kind: 'LAST CONTACT', text: 'Contact lost with the tumbling spacecraft.' },
    { date: 'September 23, 1966', kind: 'IMPACT', text: 'Impact on the Moon near Copernicus crater.' },
  ],
  fate: {
    status: 'impact-remains',
    headline: 'Destroyed on impact',
    summary: 'Surveyor 2 struck the Moon out of control. Its wreckage lies somewhere southeast of Copernicus crater; the site has not been located.',
    kidSummary: 'It crashed on the Moon. Its pieces are somewhere near Copernicus crater, but nobody has found them.',
  },
  missionStatus: 'Mission failed (1966). Impact debris on the Moon; site not located.',
  location: 'Southeast of Copernicus crater (exact impact point unknown)',
  coordinates: {
    lat: 5.5,
    lon: -12.0,
    precision: 'approximate',
    note: 'Estimated impact point listed by NASA NSSDCA. The crash site has never been identified; other sources give different estimates.',
  },
  locationAccuracy: 'illustrative',
  model: { kind: 'impact', variant: 'surveyor-2', note: 'Illustrative impact marker. The real debris field has never been imaged.' },
  assets: [],
  audio: AUDIO.surveyor,
  sources: [SRC.surveyor, SRC.impacts],
  accuracyNotes: ['Impact date is given as September 22 or 23, 1966 depending on source and time zone.', 'Impact coordinates are an estimate; the site has not been located.'],
}

const surveyor4: Story = {
  id: 'moon-surveyor-4',
  world: 'moon',
  collection: COLLECTION,
  mission: 'Surveyor 4',
  equipmentName: 'Surveyor 4 — Lost Before Landing',
  equipmentType: 'impact-site',
  title: 'The Robot That Went Silent',
  subtitle: 'Surveyor 4 · Failed landing · contact lost July 17, 1967',
  kidsStory: {
    hook: 'Another spot with no robot standing on it. Just scattered pieces and a big question mark. This one is a real space mystery…',
    steps: {
      what: { text: 'This spot remembers Surveyor 4, a robot lander that never got to say "I made it!" What is left is wreckage, not a robot standing on its legs.', highlight: 'debris' },
      why: { text: 'It was heading for the very middle of the Moon\'s face, a place called Central Bay, to dig with a scoop and take pictures.' },
      did: { text: 'The whole trip went perfectly. Everything worked! The big landing rocket was firing to slow it down. It was only two and a half minutes from landing…' },
      discovered: { text: '…and then, silence. Its radio signal just stopped. It never sent a single picture, so it could not discover anything on the Moon.' },
      happened: { text: 'Nobody knows for sure what happened on July 17, 1967. Maybe its landing rocket exploded. Scientists think its pieces fell in Central Bay, but nobody has found them.', highlight: 'crater' },
      matters: { text: 'Four months later, Surveyor 6 landed safely in the very same area and finished the job. When one explorer cannot finish, another carries on!' },
    },
  },
  adultsStory: {
    hook: 'A scatter of fragments in the middle of the lunar near side, and no certainty about how they got here.',
    steps: {
      what: { text: 'This marker represents Surveyor 4. It did not soft-land. Whatever reached the surface is wreckage; no intact lander exists at this site.', highlight: 'debris' },
      why: { text: 'Carrying a surface sampler like Surveyor 3, it was targeted at Sinus Medii, in the centre of the near side, a candidate Apollo landing zone.' },
      did: { text: 'Launched on July 14, 1967, it flew a flawless mission until the terminal descent. With its solid-propellant retro-rocket still firing, about two and a half minutes before touchdown, the radio signal ended abruptly.' },
      discovered: { text: 'No surface data were returned. The loss could not be reproduced or conclusively explained, but the following mission flew with the same design and succeeded.' },
      happened: { text: 'Contact was lost on July 17, 1967 and never regained. NASA concluded the spacecraft may have exploded; the cause remains uncertain. Any debris is presumed to lie in Sinus Medii, but the impact has never been located.', highlight: 'crater' },
      matters: { text: 'Surveyor 6 landed safely in the same region four months later and completed the survey of Sinus Medii. Surveyor 4 remains one of the unresolved losses of early lunar exploration.' },
    },
  },
  guess: {
    question: 'What do you think happened here?',
    kidQuestion: 'Scattered pieces and a mystery… what happened?',
    options: ['A lander lost contact moments before touchdown', 'A lunar rover ran out of battery', 'An antenna was left by astronauts'],
    answer: 0,
    explain: 'It marks Surveyor 4, whose signal was lost about two and a half minutes before touchdown in July 1967.',
  },
  facts: [
    { label: 'Outcome', value: 'Failed: no soft landing. Not an intact lander.' },
    { label: 'Contact lost', value: 'About 2.5 minutes before touchdown, during the retro-rocket burn.' },
    { label: 'Cause', value: 'Unknown. A possible explosion was suspected but never confirmed.' },
  ],
  timeline: [
    { date: 'July 14, 1967', kind: 'LAUNCH', text: 'Surveyor 4 launches.' },
    { date: 'July 17, 1967', kind: 'LAST CONTACT', text: 'Signal lost about 2.5 minutes before touchdown.' },
    { date: 'July 17, 1967', kind: 'IMPACT', text: 'Presumed impact in Sinus Medii (not confirmed, not located).' },
  ],
  fate: {
    status: 'impact-remains',
    headline: 'Lost moments before landing',
    summary: 'Contact with Surveyor 4 ended during its final descent. Its remains are presumed to be in Sinus Medii, but the impact site is unknown.',
    kidSummary: 'Its signal stopped just before landing. Its pieces are probably in Central Bay, but nobody knows exactly where.',
  },
  missionStatus: 'Mission failed (1967). Presumed impact; site unknown.',
  location: 'Sinus Medii (target area; actual impact point unknown)',
  coordinates: null,
  locationAccuracy: 'illustrative',
  model: { kind: 'impact', variant: 'surveyor-4', note: 'Illustrative impact marker. The real site is unknown and has never been imaged.' },
  assets: [],
  audio: AUDIO.surveyor,
  sources: [SRC.surveyor, SRC.impacts],
  accuracyNotes: ['No coordinates are shown: NASA lists the impact location as unknown (the landing target was near 0.4°N, 1.3°W).'],
}

export const MOON_STORIES: Story[] = [
  eagle,
  lrv15,
  lrv16,
  lrv17,
  alsep12,
  alsep14,
  alsep15,
  alsep16,
  alsep17,
  surveyor1,
  surveyor2,
  surveyor3,
  surveyor4,
  surveyor5,
  surveyor6,
  surveyor7,
]

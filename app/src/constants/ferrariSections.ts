import type { Section } from '../types'

export const FERRARI_SECTIONS: Section[] = [
  {
    id: 'heritage',
    title: 'THE GTO',
    subtitle: '1962 — Maranello',
    copy: 'GT Omologato. The letters that mean everything. Built to homologate for racing, the Ferrari 250 GTO was not meant to be driven on roads. It happened to be road-legal. Thirty-nine were made. All thirty-nine are accounted for.',
    progressStart: 0,
    progressEnd: 0.17,
  },
  {
    id: 'design',
    title: 'THE FORM',
    subtitle: 'Scaglietti Coachwork',
    copy: 'Sergio Scaglietti shaped the aluminium by instinct — no wind tunnel, no computer. The elongated nose, the fastback roofline, the muscular haunches: proportions arrived at through feel, corrected by eye.',
    features: [
      'Hand-beaten aluminium coachwork',
      'Aerodynamic nose with triple vents',
      'Fastback roofline for drag reduction',
      'Six-carburettor air intake ports',
    ],
    progressStart: 0.17,
    progressEnd: 0.36,
  },
  {
    id: 'engine',
    title: 'THE ENGINE',
    subtitle: 'Tipo 168/62, 3.0L V12',
    copy: 'Twelve cylinders. Six Weber carburettors. The Tipo 168/62 V12 was derived directly from Ferrari\'s Formula 1 programme — a racing engine made barely street-tolerable. It did not idle so much as threaten.',
    stats: [
      { value: '300',  label: 'Horsepower',   unit: 'HP'  },
      { value: '174',  label: 'Top Speed',    unit: 'mph' },
      { value: '6.1',  label: '0–60 mph',     unit: 'sec' },
      { value: '2953', label: 'Displacement', unit: 'cc'  },
    ],
    progressStart: 0.36,
    progressEnd: 0.54,
  },
  {
    id: 'racing',
    title: 'THE CIRCUIT',
    subtitle: 'GT Class Dominance',
    copy: 'Le Mans 1962. Sebring 1962. The Tour de France Automobile. The 250 GTO did not merely compete — it annihilated its class with a methodical consistency that left rivals without answers. Three consecutive GT World Championships.',
    stats: [
      { value: '3',    label: 'GT World Titles', unit: ''         },
      { value: '1962', label: 'Le Mans Class Win', unit: ''       },
      { value: '39',   label: 'Built',            unit: 'total'   },
      { value: '1',    label: 'Category',         unit: 'all-time'},
    ],
    progressStart: 0.54,
    progressEnd: 0.72,
  },
  {
    id: 'legacy',
    title: 'THE LEGEND',
    subtitle: 'Seven Decades',
    copy: 'In 2018, chassis 3413 GT changed hands privately for an estimated seventy million dollars — the highest sum ever recorded for a motor car. The 250 GTO is not merely a machine. It is the definitive argument for the automobile as art.',
    stats: [
      { value: '$70M', label: 'Auction Record',  unit: ''           },
      { value: '39',   label: 'Ever Built',      unit: ''           },
      { value: '1962', label: 'First Victory',   unit: ''           },
      { value: '1',    label: 'Without Equal',   unit: 'of a kind'  },
    ],
    progressStart: 0.72,
    progressEnd: 0.82,
  },
  {
    id: 'stars',
    title: 'THE DRIVERS',
    subtitle: 'Those Who Raced It',
    copy: 'The 250 GTO was not bought. It was allocated — to drivers Ferrari trusted to extract its full measure.',
    progressStart: 0.82,
    progressEnd: 0.91,
  },
  {
    id: 'acquire',
    title: 'ACQUIRE',
    subtitle: 'Own a Legend',
    copy: 'A 250 GTO ownership inquiry is not a transaction. It is a dialogue between serious parties, conducted with complete discretion. Each chassis carries its own provenance — its own chain of custody from Maranello to the present day.',
    progressStart: 0.91,
    progressEnd: 1.00,
  },
]

export const FERRARI_TOTAL_SCROLL_HEIGHT = '2000vh'

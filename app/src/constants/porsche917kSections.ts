import type { Section } from '../types'

export const PORSCHE_917K_SECTIONS: Section[] = [
  {
    id: 'heritage',
    title: 'THE 917',
    subtitle: '1970 — Le Mans',
    copy: 'The FIA changed the rules for 1969: Group 5 sports cars must be built in series of at least 25 units. Porsche\'s response was the 917 — twenty-five cars built in six months for a single purpose. Ferdinand Piëch drove the first one himself to prove it was road-legal.',
    progressStart: 0,
    progressEnd: 0.17,
  },
  {
    id: 'design',
    title: 'THE FORM',
    subtitle: 'Kurzheck — Short Tail',
    copy: 'The long-tail 917L was faster on the straight. The short-tail 917K was faster everywhere else. The K\'s truncated rear deck and revised front spoiler created a more stable platform in corners and braking. The Gulf livery — powder blue and orange — became the most recognisable racing colour combination in history.',
    features: [
      'Kurzheck short-tail bodywork',
      'Full aluminium spaceframe chassis',
      'Adjustable front and rear aerodynamics',
      'Gulf Oil JW Automotive livery, 1970–71',
    ],
    progressStart: 0.17,
    progressEnd: 0.36,
  },
  {
    id: 'engine',
    title: 'THE ENGINE',
    subtitle: '4.9L Flat-12, Air-Cooled',
    copy: 'Twelve cylinders. Four camshafts. Air-cooled, because Porsche had never needed water. The 4,907cc flat-twelve produced 580 bhp at 8,400 rpm in standard form — 630 in the 5.0L final specification. At Le Mans, drivers reported the engine\'s note changed quality at 7,000 rpm, becoming something that sounded almost organic.',
    stats: [
      { value: '580',   label: 'Horsepower',   unit: 'HP'    },
      { value: '240',   label: 'Top Speed',    unit: 'km/h'  },
      { value: '3.3',   label: '0–100 km/h',  unit: 'sec'   },
      { value: '4,907', label: 'Displacement', unit: 'cc'    },
    ],
    progressStart: 0.36,
    progressEnd: 0.54,
  },
  {
    id: 'race',
    title: 'THE RACE',
    subtitle: 'Le Mans 1970',
    copy: 'Car #23. Hans Herrmann and Richard Attwood. Twenty-four hours. The 1970 24 Heures du Mans was Porsche\'s first overall Le Mans victory — delivered by the oldest driver in the race (Herrmann, 41) and a British privateer (Attwood) who had qualified but not started a Formula 1 race that season.',
    stats: [
      { value: '1970',  label: 'First Win',          unit: ''     },
      { value: '#23',   label: 'Winning Car',         unit: ''     },
      { value: '343',   label: 'Laps Completed',      unit: ''     },
      { value: '2',     label: 'Consecutive Wins',    unit: ''     },
    ],
    progressStart: 0.54,
    progressEnd: 0.72,
  },
  {
    id: 'legacy',
    title: 'THE LEGEND',
    subtitle: 'The Fastest Racing Car of Its Era',
    copy: 'The 917 won Le Mans twice. It lapped Monza at over 241 km/h in long-tail form. Its flat-twelve was the direct ancestor of the turbocharged 936 that won Le Mans again in 1976. Steve McQueen drove a 917 for the 1971 film Le Mans — the most technically authentic racing film ever made.',
    stats: [
      { value: '2',     label: 'Le Mans Victories',  unit: ''         },
      { value: '241',   label: 'Top Speed',          unit: 'km/h'     },
      { value: '1970',  label: 'Racing Dominance',   unit: '– 1971'   },
      { value: '∞',     label: 'Cultural Legacy',    unit: ''         },
    ],
    progressStart: 0.72,
    progressEnd: 0.82,
  },
  {
    id: 'stars',
    title: 'THE DRIVERS',
    subtitle: 'Those Who Raced It',
    copy: 'The 917 demanded everything. Its early handling required courage before the aerodynamic revisions arrived. The drivers who mastered it were the finest racing drivers of their generation.',
    progressStart: 0.82,
    progressEnd: 0.91,
  },
  {
    id: 'acquire',
    title: 'ACQUIRE',
    subtitle: 'Own a Legend',
    copy: 'Authentic Porsche 917 examples are among the rarest and most historically significant racing cars in private hands. Acquisition requires full provenance documentation, chassis number verification, and period racing history confirmation. We conduct introductions only between serious, qualified parties.',
    progressStart: 0.91,
    progressEnd: 1.00,
  },
]

export const PORSCHE_917K_TOTAL_SCROLL_HEIGHT = '2000vh'

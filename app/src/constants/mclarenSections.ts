import type { Section } from '../types'

export const MCLAREN_SECTIONS: Section[] = [
  {
    id: 'heritage',
    title: 'THE F1',
    subtitle: '1993 — Woking',
    copy: 'Gordon Murray did not set out to build the fastest car in the world. He set out to build the perfect one. The McLaren F1 arrived at 240 miles per hour as a consequence of that ambition, not its objective.',
    progressStart: 0,
    progressEnd: 0.14,
  },
  {
    id: 'design',
    title: 'THE FORM',
    subtitle: 'Gordon Murray, Designer',
    copy: 'Every panel, every gram, every millimetre was contested. The carbon monocoque chassis was the first ever used in a road car. The bodywork was shaped not by fashion but by function — and arrived at a shape that happened to be beautiful.',
    features: [
      'Full carbon fibre monocoque chassis',
      'Central driving position — three seats',
      'BMW S70/2 V12 — naturally aspirated',
      'Gold-lined engine bay for heat reflection',
    ],
    progressStart: 0.14,
    progressEnd: 0.29,
  },
  {
    id: 'engine',
    title: 'THE ENGINE',
    subtitle: 'BMW S70/2, 6.1L V12',
    copy: 'Paul Rosche of BMW Motorsport was given a single brief: the lightest, most powerful naturally aspirated road car engine ever made. The S70/2 delivered 627 horsepower from 6.1 litres and weighed just 266 kilograms.',
    stats: [
      { value: '627',   label: 'Horsepower',   unit: 'HP'  },
      { value: '240',   label: 'Top Speed',    unit: 'mph' },
      { value: '3.2',   label: '0–60 mph',     unit: 'sec' },
      { value: '6064',  label: 'Displacement', unit: 'cc'  },
    ],
    progressStart: 0.29,
    progressEnd: 0.44,
  },
  {
    id: 'racing',
    title: 'THE RECORD',
    subtitle: 'Fastest Production Car',
    copy: 'On 31 March 1998, a standard production McLaren F1 was driven to 240.1 miles per hour on a closed runway in Ehra-Lessien. It held the title of fastest production car for twelve years. It remains the fastest naturally aspirated road car ever made.',
    stats: [
      { value: '240',  label: 'Top Speed',      unit: 'mph'    },
      { value: '106',  label: 'Cars Built',      unit: 'total'  },
      { value: '12',   label: 'Years as Fastest', unit: 'yrs'  },
      { value: '1',    label: 'Le Mans Overall',  unit: 'win'   },
    ],
    progressStart: 0.44,
    progressEnd: 0.58,
  },
  {
    id: 'legacy',
    title: 'THE LEGACY',
    subtitle: 'Three Decades',
    copy: 'In 1995, a privateer McLaren F1 GTR entered Le Mans without factory support and finished first overall — ahead of all the purpose-built prototypes. It was not supposed to happen. Nothing about the McLaren F1 was.',
    stats: [
      { value: '1995', label: 'Le Mans Victory',  unit: ''         },
      { value: '106',  label: 'Road Cars Built',  unit: ''         },
      { value: '$20M', label: 'Current Value',    unit: 'est.'     },
      { value: '1',    label: 'Without Equal',    unit: 'of a kind'},
    ],
    progressStart: 0.58,
    progressEnd: 0.72,
  },
  {
    id: 'stars',
    title: 'THE REGISTER',
    subtitle: 'Those Who Understood',
    copy: 'One hundred and six were built. Each found an owner who grasped that the F1 was not a possession — it was a responsibility.',
    progressStart: 0.72,
    progressEnd: 0.87,
  },
  {
    id: 'acquire',
    title: 'ACQUIRE',
    subtitle: 'Own a Legend',
    copy: 'A McLaren F1 acquisition is a matter of patient discretion. Each of the one hundred and six chassis carries a documented history from Woking to the present day. We present only those examples whose provenance is beyond question.',
    progressStart: 0.87,
    progressEnd: 1.00,
  },
]

export const MCLAREN_TOTAL_SCROLL_HEIGHT = '2000vh'

import type { Section } from '../types'

export const PORSCHE_911_SECTIONS: Section[] = [
  {
    id: 'heritage',
    title: 'THE 911',
    subtitle: '1963 — Zuffenhausen',
    copy: 'It was called the 901 until Peugeot objected. Ferry Porsche\'s son drew a fastback on a napkin. The flat-six behind the rear axle defied every engineering convention — and outlasted all of them. Sixty years later, the shape is still in production.',
    progressStart: 0,
    progressEnd: 0.17,
  },
  {
    id: 'design',
    title: 'THE FORM',
    subtitle: 'Butzi Porsche, 1963',
    copy: 'Ferdinand "Butzi" Porsche III drew the 911\'s shape without a single concession to convention. The fastback roofline, the rounded haunches, the drawn-back headlights — a silhouette so resolved that every subsequent 911 is recognisably its descendant. No redesign was ever necessary. Only evolution.',
    features: [
      'Ferdinand Porsche III body design',
      'Rear-engine, rear-wheel drive layout',
      'Torsion-bar independent suspension',
      'Panoramic curved windscreen',
    ],
    progressStart: 0.17,
    progressEnd: 0.36,
  },
  {
    id: 'engine',
    title: 'THE ENGINE',
    subtitle: '2.0L Air-Cooled Flat-Six',
    copy: 'No water. No radiator. No compromise. The air-cooled flat-six mounted behind the rear axle was Porsche\'s engineering declaration of independence from convention. It produced 130 bhp in 1963. By 1973 it produced 210. By 1974, 260 in the RS 3.0. The architecture was inexhaustible.',
    stats: [
      { value: '130',   label: 'Horsepower',   unit: 'HP (1963)'  },
      { value: '210',   label: 'Top Speed',    unit: 'km/h'       },
      { value: '9.1',   label: '0–60 mph',     unit: 'sec'        },
      { value: '1,991', label: 'Displacement', unit: 'cc'         },
    ],
    progressStart: 0.36,
    progressEnd: 0.54,
  },
  {
    id: 'lineage',
    title: 'THE LINEAGE',
    subtitle: 'Six Decades Unbroken',
    copy: 'Every Porsche 911 ever built traces its DNA directly to this car. The 930 Turbo. The 964. The 993 — last of the air-cooled. The 997 GT3. The 992. An unbroken lineage of successive refinement across sixty-one years of continuous production. No other automobile has endured so completely.',
    stats: [
      { value: '61',    label: 'Years in Production', unit: ''     },
      { value: '1M+',   label: '911s Built',           unit: 'est.' },
      { value: '1963',  label: 'Introduction',         unit: ''     },
      { value: '1',     label: 'Model Line',           unit: 'enduring' },
    ],
    progressStart: 0.54,
    progressEnd: 0.72,
  },
  {
    id: 'legacy',
    title: 'THE LEGEND',
    subtitle: 'Early Production',
    copy: 'Early Urmodell 911s — the first two production years, pre-1966 — are among the most coveted early Porsches in existence. Matching-numbers examples in original specification achieve significant sums. A 1964 901 prototype would be priceless. Most importantly: they still drive precisely as intended.',
    stats: [
      { value: '\'63',  label: 'Urmodell Debut',       unit: ''      },
      { value: '232',   label: 'First Year Production', unit: 'units' },
      { value: '901',   label: 'Original Designation',  unit: ''      },
      { value: '1',     label: 'Architecture',          unit: 'eternal'},
    ],
    progressStart: 0.72,
    progressEnd: 0.82,
  },
  {
    id: 'stars',
    title: 'THE CUSTODIANS',
    subtitle: 'Those Who Drove It',
    copy: 'The 911 was driven by engineers, driven by champions, driven by anyone fortunate enough to acquire one. Its history is the history of everyone who ever trusted a machine to take them further than caution would allow.',
    progressStart: 0.82,
    progressEnd: 0.91,
  },
  {
    id: 'acquire',
    title: 'ACQUIRE',
    subtitle: 'Own a Legend',
    copy: 'An early Porsche 911 inquiry is a dialogue between the knowledgeable. Matching numbers, original paint, documented history — the criteria are well understood among those serious about the subject. We present only provenance-documented examples.',
    progressStart: 0.91,
    progressEnd: 1.00,
  },
]

export const PORSCHE_911_TOTAL_SCROLL_HEIGHT = '2000vh'

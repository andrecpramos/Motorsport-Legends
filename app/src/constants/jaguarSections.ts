import type { Section } from '../types'

export const JAGUAR_SECTIONS: Section[] = [
  {
    id: 'heritage',
    title: 'THE E-TYPE',
    subtitle: '1961 — Coventry',
    copy: '"The most beautiful car ever made." Enzo Ferrari said it at the Geneva Motor Show in March 1961, within moments of first seeing the car. It was a compliment that arrived without hesitation, from a man who gave none easily.',
    progressStart: 0,
    progressEnd: 0.17,
  },
  {
    id: 'design',
    title: 'THE FORM',
    subtitle: 'Malcolm Sayer, Aerodynamicist',
    copy: 'Malcolm Sayer was not a stylist. He was an aerodynamicist who had designed aircraft. The E-Type\'s curves were computed before they were drawn — mathematical equations resolved into aluminium and steel, then covered in glass.',
    features: [
      'Monocoque construction — aircraft derived',
      'Long bonnet over an inline-six',
      'Independent rear suspension — first for Jaguar',
      'Rack-and-pinion steering',
    ],
    progressStart: 0.17,
    progressEnd: 0.36,
  },
  {
    id: 'engine',
    title: 'THE ENGINE',
    subtitle: 'XK 3.8L Straight-Six',
    copy: 'The XK engine had already won Le Mans with the C-Type and D-Type. In the E-Type it was tuned for the road, though it retained the same dual overhead cam architecture that had humiliated every rival on the Sarthe circuit.',
    stats: [
      { value: '265',  label: 'Horsepower',   unit: 'HP'  },
      { value: '150',  label: 'Top Speed',    unit: 'mph' },
      { value: '7.1',  label: '0–60 mph',     unit: 'sec' },
      { value: '3781', label: 'Displacement', unit: 'cc'  },
    ],
    progressStart: 0.36,
    progressEnd: 0.54,
  },
  {
    id: 'racing',
    title: 'THE CIRCUIT',
    subtitle: 'A Racing Bloodline',
    copy: 'The E-Type\'s lineage was the D-Type, which had won Le Mans three consecutive times. In period competition the E-Type proved formidable — particularly in the hands of Graham Hill and Roy Salvadori who understood its balance.',
    features: [
      'Direct descendant of the Le Mans D-Type',
      'E2A prototype raced at Le Mans 1960',
      'Disc brakes on all four wheels',
      'Graham Hill — 1961 Oulton Park Gold Cup',
    ],
    progressStart: 0.54,
    progressEnd: 0.72,
  },
  {
    id: 'legacy',
    title: 'THE LEGACY',
    subtitle: 'Six Decades',
    copy: 'In 1996, the New York Museum of Modern Art acquired a 1963 E-Type for its permanent collection — one of only eight automobiles ever considered worthy of inclusion. It joined the collection not as a curio, but as design in its purest form.',
    stats: [
      { value: '1961', label: 'Debut Year',       unit: ''        },
      { value: '1963', label: 'MoMA Collection',  unit: ''        },
      { value: '3',    label: 'Le Mans Victories', unit: 'D-Type' },
      { value: '150',  label: 'Top Speed',        unit: 'mph'     },
    ],
    progressStart: 0.72,
    progressEnd: 0.82,
  },
  {
    id: 'stars',
    title: 'THE REGISTER',
    subtitle: 'Those Who Understood',
    copy: 'The E-Type did not seek famous owners. It simply had a way of finding those who recognised beauty without instruction.',
    progressStart: 0.82,
    progressEnd: 0.91,
  },
  {
    id: 'acquire',
    title: 'ACQUIRE',
    subtitle: 'Own a Legend',
    copy: 'The finest E-Types occupy a rarefied category: matching-numbers, original-colour examples with complete history. Each one presented here has been subject to full provenance research and concours-standard preparation.',
    progressStart: 0.91,
    progressEnd: 1.00,
  },
]

export const JAGUAR_TOTAL_SCROLL_HEIGHT = '2000vh'

export interface RivalryMoment {
  number: string
  title: string
  text: string
}

export interface RivalryVideo {
  title: string
  description: string
  youtubeId: string
}

export interface RivalryData {
  slug: string
  year: string
  title: string
  subtitle: string
  sideA: string
  sideB: string
  colorA: string  // "R, G, B" format
  colorB: string
  tagline: string
  context: string
  contextYear: string
  sideABio: string
  sideBBio: string
  moments: RivalryMoment[]
  mainNarrativeTitle: string
  mainNarrative: string
  legacy: string
  videos: RivalryVideo[]
  photos: { caption: string; year: string }[]
}

export const RIVALRIES: RivalryData[] = [
  // ── Ford vs Ferrari ───────────────────────────────────────────────────
  {
    slug:     'ford-vs-ferrari',
    year:     '1966',
    title:    'Ford vs Ferrari',
    subtitle: 'Le Mans · 1966',
    sideA:    'Ford',
    sideB:    'Ferrari',
    colorA:   '35, 85, 175',
    colorB:   '215, 45, 38',
    tagline:  'An empire\'s pride against a dynasty\'s legacy.',

    contextYear: '1963–1966',
    context: 'In 1963, Enzo Ferrari opened negotiations to sell his company to the Ford Motor Company. The deal collapsed at the last moment when Ferrari refused to cede control of his racing programme. Henry Ford II was incensed. He dispatched the full resources of the largest automobile manufacturer on earth to do exactly that — defeat Ferrari at Le Mans.',

    sideABio: 'Henry Ford II committed an unprecedented sum to building a car that could defeat Ferrari at Le Mans. The GT40 MkII, with a 7-litre V8 producing 485 horsepower, was the result of that obsession. Carroll Shelby and Ken Miles prepared the cars. Thirty-two engineers from Ford\'s Advanced Vehicles division crossed the Atlantic.',

    sideBBio: 'Enzo Ferrari had won Le Mans six consecutive times. His 330 P3 was the product of decades of Italian engineering tradition. Ferrari had never needed to worry about American money or American horsepower. The old man was not concerned. He had been wrong before. He would not be wrong about this.',

    moments: [
      {
        number: '01',
        title:  'The Rejected Deal',
        text:   'On 21 May 1963, Ford executives flew to Maranello with an $18 million offer. Ferrari signed the preliminary agreement. Then, reading the fine print, he discovered Ford would control his racing budget. He tore up the papers, called the Americans "liars", and showed them the door.',
      },
      {
        number: '02',
        title:  'Two Years of Failure',
        text:   'Ford\'s first attempt in 1964 ended in humiliation — all three GT40s retired. In 1965, all three retired again. Ferrari won both years with ease. The press mocked the Dearborn giant. Ford engineers worked in secret through the winter, rebuilding from first principles.',
      },
      {
        number: '03',
        title:  'Ken Miles\' Perfect Race',
        text:   'Ken Miles led the 1966 race from the front in car #1, lapping all but two competitors. With victory certain, Ford Public Relations orchestrated a three-car formation finish for the photograph. Because car #2 had started from further back on the grid and thus covered more total distance, Miles was classified second. He never raced again. He died six weeks later testing a Ford J-car.',
      },
      {
        number: '04',
        title:  'The 1-2-3 Photograph',
        text:   'The image of three Ford GT40s crossing the finish line together at the 1966 24 Hours of Le Mans became one of the most reproduced photographs in motorsport history. It ran on the front page of every major newspaper in America. Henry Ford II flew to France personally to receive the trophy.',
      },
      {
        number: '05',
        title:  'Ferrari\'s Response',
        text:   'Enzo Ferrari, asked about the defeat, said only: "The Americans were very fast." He returned the following year with a new car. Ford won again in 1967. Ferrari would not win Le Mans outright again until 1981.',
      },
    ],

    mainNarrativeTitle: 'The Twenty-Four Hours',
    mainNarrative: 'At 4 pm on 18 June 1966, the flag dropped at the Circuit de la Sarthe and fifty-five cars launched into the French summer. Ford had entered eight GT40s. Ferrari had five 330 P3s. By midnight, mechanical attrition had reduced the Ford fleet to three. Ken Miles, in car #1, drove what witnesses later called the most technically precise race in Le Mans history — lap times consistent to within fractions of a second across twenty-four hours. At 2 pm on 19 June, three Ford cars crossed the line together. It was the moment Henry Ford II had paid for. It was also, quietly, the moment Carroll Shelby and Ken Miles had been robbed of.',

    legacy: 'The 1966 Le Mans proved that industrial capital could defeat artisan mastery — at sufficient cost. Ford spent what some estimates place at $120 million in today\'s terms to win a single sports car race. Ferrari recovered. The GT40 was retired. The image endures: three blue Ford GT40s, side by side, at the finish line in France. The film *Ford v Ferrari* (2019) dramatised the story. The original #1 GT40 — the car Ken Miles should have won in — sold at auction in 2012 for $11 million.',

    videos: [
      {
        title:       '1966 Le Mans — Race Highlights',
        description: 'Original footage from the 1966 24 Hours of Le Mans. The Ford GT40s\' domination in what became one of the most dramatic races in the event\'s history.',
        youtubeId:   '',
      },
      {
        title:       'The GT40 Story',
        description: 'A documentary account of the GT40\'s development — from Henry Ford\'s rejected acquisition to the Le Mans triumph and the controversy that shadowed it.',
        youtubeId:   '',
      },
    ],

    photos: [
      { caption: 'Ford GT40 MkII at full speed on the Mulsanne Straight, 1966', year: '1966' },
      { caption: 'Henry Ford II with Carroll Shelby in the Le Mans pit lane', year: '1966' },
      { caption: 'Ken Miles at the wheel of car #1 during the night hours', year: '1966' },
      { caption: 'The formation finish — cars #1, #2, and #5', year: '1966' },
      { caption: 'Enzo Ferrari at Maranello, summer 1966', year: '1966' },
      { caption: 'The preliminary contract signing at Maranello, May 1963', year: '1963' },
    ],
  },

  // ── Lauda vs Hunt ─────────────────────────────────────────────────────
  {
    slug:     'lauda-vs-hunt',
    year:     '1976',
    title:    'Lauda vs Hunt',
    subtitle: 'Formula 1 · 1976',
    sideA:    'Niki Lauda',
    sideB:    'James Hunt',
    colorA:   '190, 30, 30',
    colorB:   '210, 175, 60',
    tagline:  'One man walked from fire. The other drove into history.',

    contextYear: '1976',
    context: 'The 1976 Formula 1 season began as a coronation. Niki Lauda had won the 1975 championship with clinical authority. His Ferrari 312T was the fastest car on the grid. James Hunt had joined McLaren, replacing Emerson Fittipaldi. The season was expected to be Lauda\'s second act. By August, it had become something else entirely.',

    sideABio: 'Niki Lauda was the antithesis of the romantic racing driver. He was systematic, precise, and merciless in his self-criticism. He tested obsessively, demanded engineering perfection, and won races by margin management rather than spectacle. The Austrian was, by 1976, the finest racing driver on earth. Then came the Nürburgring.',

    sideBBio: 'James Hunt was everything Lauda was not. Beautiful, chaotic, publicly dissolute, and faster than almost anyone when the mood took him. His 1975 season at Hesketh had shown glimpses of genius between crashes. McLaren gave him a car worthy of his talent. In the wet, under pressure, he was extraordinary.',

    moments: [
      {
        number: '01',
        title:  'The Nürburgring Fire',
        text:   'On Lap 2 of the German Grand Prix, 1 August 1976, Lauda\'s Ferrari left the road at Bergwerk and caught fire. Trapped in the cockpit, he inhaled burning gases for over a minute. Four drivers — Arturo Merzario, Bretton Lunger, Harald Ertl, and Guy Edwards — stopped their cars and pulled him free. His last rites were administered twice.',
      },
      {
        number: '02',
        title:  'Forty-Two Days',
        text:   'Forty-two days after the accident, Lauda drove in the Italian Grand Prix at Monza. His face was not yet healed. His eyelids were burned. He qualified fourth and finished fourth — losing ten points to Hunt in his absence but refusing, absolutely, to let the championship end at a German hospital.',
      },
      {
        number: '03',
        title:  'The British GP Reversal',
        text:   'Hunt won the British Grand Prix at Brands Hatch, only to be disqualified months later for a technical infringement relating to a first-lap restart. The points were redistributed. The championship calculations changed daily through September and October.',
      },
      {
        number: '04',
        title:  'Japan — Three Points',
        text:   'At the final race, the Japanese Grand Prix at Fuji Speedway, Lauda needed fourth place. Hunt needed third. It rained so heavily that standing water covered the circuit. Lauda completed two installation laps, decided the conditions were unsurvivable, and drove into the pit lane. He has never regretted it.',
      },
      {
        number: '05',
        title:  'Hunt Wins by One Point',
        text:   'Hunt needed third place to become champion. He was sixth with ten laps remaining. Mechanical retirements ahead promoted him to third. He crossed the line and did not know he was champion until his mechanics told him. Lauda, watching from the Ferrari motorhome, said nothing publicly. The final margin: 69 points to 68.',
      },
    ],

    mainNarrativeTitle: 'The Decision at Fuji',
    mainNarrative: 'The rain at Fuji was not unusual by the standards of 1976. Formula 1 ran in conditions that would halt a modern race before the formation lap. Lauda pulled out after two installation laps, citing visibility near zero and standing water across the entire circuit. His words afterward were precise: "I am not prepared to risk my life for a points championship when the conditions make racing suicidal." He was booed. The Italian press called him a coward. His own teammates were uncertain. Later, everyone understood. The bravery was not in staying on track. The bravery was in saying, out loud, that no race was worth dying for — five months after he had nearly died at the Nürburgring.',

    legacy: 'Lauda won the championship in 1977 and, after a two-year retirement, again in 1984 — by half a point from a certain Alain Prost. Hunt, brilliant and exhausting to himself, retired in 1979 and died of a heart attack in 1993, aged 45. The 1976 season is regularly voted the greatest in Formula 1 history. The film *Rush* (2013), directed by Ron Howard, is the most accurate depiction of a motorsport season ever committed to cinema.',

    videos: [
      {
        title:       '1976 Season Review — The Championship',
        description: 'The complete story of the 1976 Formula 1 season — from Lauda\'s early dominance through the Nürburgring fire to the rain-soaked decision at Fuji.',
        youtubeId:   '',
      },
      {
        title:       'Niki Lauda — The Return',
        description: 'Documentary footage covering the accident, the rescue, and Lauda\'s extraordinary return to racing at Monza — forty-two days after the fire.',
        youtubeId:   '',
      },
    ],

    photos: [
      { caption: 'Niki Lauda\'s Ferrari 312T2 at speed, early 1976 season', year: '1976' },
      { caption: 'James Hunt at the wheel of the McLaren M23', year: '1976' },
      { caption: 'Lauda at the Nürburgring, before the accident, August 1976', year: '1976' },
      { caption: 'Hunt celebrates victory at the British Grand Prix, Brands Hatch', year: '1976' },
      { caption: 'Lauda returns at Monza — forty-two days after the fire', year: '1976' },
      { caption: 'Fuji Speedway in the rain — the final race of the season', year: '1976' },
    ],
  },

  // ── Senna vs Prost ────────────────────────────────────────────────────
  {
    slug:     'senna-vs-prost',
    year:     '1988',
    title:    'Senna vs Prost',
    subtitle: 'Formula 1 · 1988–1989',
    sideA:    'Ayrton Senna',
    sideB:    'Alain Prost',
    colorA:   '210, 60, 45',
    colorB:   '175, 165, 145',
    tagline:  'One garage. Two champions. The greatest rivalry in sport.',

    contextYear: '1988–1989',
    context: 'In 1988, McLaren signed both the reigning world champion and the man who would become the greatest racing driver of his generation. The Honda turbocharged V6 in their MP4/4 was so powerful, so dominant, that the only question remaining was which McLaren driver would win. That question destroyed a friendship, defined an era, and produced some of the most extraordinary racing the sport has ever witnessed.',

    sideABio: 'Ayrton Senna was not a racing driver in the conventional sense. He was a mystic who happened to be an engineer. He spoke of being carried by God on his fastest qualifying laps. He worked with Honda engineers through the night before races. He drove in rain that others could not see in, at speeds others could not imagine. He was, in the absolute sense of the word, different.',

    sideBBio: 'Alain Prost was "The Professor." Three world championships. A calculating intelligence applied to racing that no one had matched. He managed tyres, conserved fuel, and won by the smallest necessary margin. Against Senna, he found for the first time an opponent he could not outthink. Their relationship began in mutual respect and ended in a collision at 150 mph.',

    moments: [
      {
        number: '01',
        title:  'The MP4/4 Dominance',
        text:   'The McLaren-Honda MP4/4 won fifteen of sixteen races in 1988. The one race it failed to win — Monza — was won by Gerhard Berger in a Ferrari, a result the Italian crowd received as a tribute to Enzo Ferrari, who had died that summer. The MP4/4 is the most statistically dominant racing car in Formula 1 history.',
      },
      {
        number: '02',
        title:  'Monaco 1984 — The Stopped Race',
        text:   'Before they were teammates, they were already rivals. At Monaco 1984, Senna — then at Toleman — was closing on leader Prost in the rain at a second per lap when race director Jacky Ickx stopped the race. Prost was declared winner. Senna never forgot it. Senna never forgot anything.',
      },
      {
        number: '03',
        title:  'Suzuka 1988 — "Beyond My Control"',
        text:   'At the Japanese Grand Prix, Senna stalled at the start and dropped to fourteenth. He drove back to second place, overtook Prost for the lead, and won the championship. Afterward, he gave a press conference in which he described being carried by a force beyond his own control. Prost watched from the corner of the room.',
      },
      {
        number: '04',
        title:  'The Divided Garage',
        text:   'In 1989, the relationship collapsed entirely. Prost, already committed to Ferrari for 1990, accused Senna of reading his private engineering notes. There were lawyers. There was public silence in the McLaren motorhome for months. Ron Dennis, who ran the team, said afterward it was the biggest mistake and greatest achievement of his career simultaneously.',
      },
      {
        number: '05',
        title:  'Suzuka 1989 — The Chicane',
        text:   'At the 1989 Japanese Grand Prix, Senna attempted to pass Prost at the chicane. Prost turned in. They collided. Prost retired. Senna restarted, won the race, and was disqualified for taking the chicane shortcut during the incident. Prost was declared champion. Senna called it a conspiracy. He may have been right.',
      },
    ],

    mainNarrativeTitle: 'One Garage',
    mainNarrative: 'Ron Dennis said afterward that having both drivers in the same team was the biggest mistake and the greatest achievement of his career simultaneously. They shared data. They shared engineers. They shared a garage that was, by 1989, divided as completely as any wall could divide it. Senna had one set of mechanics; Prost had another. The two men did not speak. Between them, they won every race. The Honda engine was so powerful that no other team was competitive. The tragedy of 1988 and 1989 is that the greatest driver rivalry in Formula 1 history was conducted entirely within one team — and that the team was so dominant, the sport outside that garage was nearly irrelevant.',

    legacy: 'Senna won three world championships. Prost won four. They are the two greatest Formula 1 drivers of their era, and the debate about which was superior has never been resolved. Senna died at the San Marino Grand Prix on 1 May 1994, on Lap 7 at Imola. Prost was among the pallbearers at his funeral in São Paulo. They had reconciled in Paris that spring, on the eve of the season. Prost has spoken about it rarely. When he does, he does not finish the sentence.',

    videos: [
      {
        title:       '1988 Season Review — The Dominance',
        description: 'The complete story of the 1988 Formula 1 season: fifteen victories, one garage, and the beginning of the most consequential rivalry in the sport\'s history.',
        youtubeId:   '',
      },
      {
        title:       'Senna vs Prost — The Full Story',
        description: 'Documentary coverage of the five-year rivalry between Ayrton Senna and Alain Prost, from Monaco 1984 to their reconciliation in Paris, spring 1994.',
        youtubeId:   '',
      },
    ],

    photos: [
      { caption: 'McLaren MP4/4 — the most dominant Formula 1 car ever built', year: '1988' },
      { caption: 'Senna and Prost at a McLaren press conference, early 1988', year: '1988' },
      { caption: 'Senna at Monaco — the qualifying lap that defined an era', year: '1987' },
      { caption: 'The collision at Suzuka — Prost and Senna at the chicane, Lap 47', year: '1989' },
      { caption: 'Prost at Ferrari, 1990 — the rivalry from separate garages', year: '1990' },
      { caption: 'Senna at Imola, San Marino Grand Prix, 1994', year: '1994' },
    ],
  },
]

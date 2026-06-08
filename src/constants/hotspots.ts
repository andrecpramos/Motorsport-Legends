// ─── Hotspot data ─────────────────────────────────────────────────────────────
//
// Positions are in the car's animated ref-group local space.
// The model is scaled to ~5.5 units at its longest dimension (Z axis).
// Approximate bounding box in ref-group space:
//   Z: -2.5 (rear) to +2.5 (front)
//   X: -1.1 (left) to +1.1 (right)
//   Y: 0.05 (floor) to ~1.3 (roof)
//
// Adjust X/Y/Z values after a visual check in the running app.

export interface HotspotData {
  id:       string
  position: [number, number, number]
  sections: string[]   // section IDs during which this hotspot is shown
  label:    string     // short name shown in the marker tooltip
  title:    string     // full heading in the detail panel
  detail:   string     // precise technical/historical description
  category: 'engineering' | 'design' | 'interior'
}

// ─── Ferrari 250 GTO hotspots ─────────────────────────────────────────────────
// Sections: heritage, design, engine, racing, legacy, stars, acquire

export const FERRARI_HOTSPOTS: HotspotData[] = [
  // ── Design section (low side profile) ─────────────────────────────────────
  {
    id:       'coachwork',
    position: [0.88, 0.52, 0.0],
    sections: ['design'],
    label:    'Scaglietti Body',
    title:    'Hand-Beaten Aluminium Coachwork',
    detail:   'Sergio Scaglietti shaped every panel by hand without a wind tunnel or computer — the elongated nose, the fastback roofline, the muscular rear haunches. Each GTO body is dimensionally unique. The aluminium skin was stretched over wooden bucks at the Scaglietti carrozzeria in Modena, a method unchanged since the pre-war era.',
    category: 'design',
  },
  {
    id:       'nose-vents',
    position: [0.0, 0.42, 2.1],
    sections: ['design'],
    label:    'Triple Nose Vents',
    title:    'Aerodynamic Triple-Vent Nose',
    detail:   'The three oval vents cut into the nose were not a styling exercise — they feed cold air to the six Weber carburettors below. Their placement and geometry were determined empirically across test sessions at Monza and Modena. Together with the rear lip spoiler, they give the GTO a drag coefficient of approximately 0.34 Cd.',
    category: 'design',
  },

  // ── Engine section (front 3/4 view) ───────────────────────────────────────
  {
    id:       'v12-engine',
    position: [0.0, 0.68, 1.7],
    sections: ['engine'],
    label:    'Tipo 168 V12',
    title:    'Tipo 168/62 — 3.0L V12, 300 HP',
    detail:   'Derived directly from Ferrari\'s Formula 1 programme, the Tipo 168/62 is a 3.0-litre, 60° V12 producing 300 horsepower at 7,500 rpm. Bore × stroke: 73 × 58.8 mm. The engine was deliberately de-tuned from its racing specification so that privateer drivers could manage it on the road — barely.',
    category: 'engineering',
  },
  {
    id:       'carburettors',
    position: [0.28, 0.60, 1.4],
    sections: ['engine'],
    label:    'Weber Carbs',
    title:    'Six Weber 38 DCN Carburettors',
    detail:   'Six twin-choke Weber 38 DCN carburettors feed the V12 — one per two cylinders. Each required individual bench calibration and periodic re-jetting between races as the engine wore in. No two GTOs ran identical carburettor settings. Setting them required an ear for the engine\'s particular voice.',
    category: 'engineering',
  },

  // ── Racing section (cockpit view) ─────────────────────────────────────────
  {
    id:       'cockpit',
    position: [0.35, 0.78, 0.25],
    sections: ['racing'],
    label:    'Cockpit',
    title:    'Stripped Racing Cockpit',
    detail:   'The GTO\'s interior is devoid of comfort by design — no carpets, minimal sound deadening, a thin leather-rimmed Nardi wheel and a bare aluminium tunnel. The bucket seat was moulded to each driver\'s measurements at the Scuderia\'s request. Weight saved here is weight denied to the fuel load at Le Mans.',
    category: 'interior',
  },
  {
    id:       'instruments',
    position: [0.12, 0.70, 0.50],
    sections: ['racing'],
    label:    'Instruments',
    title:    'Veglia Borletti Instrument Panel',
    detail:   'The Veglia Borletti instrument cluster — 8,000 rpm tachometer, oil pressure, oil temperature, fuel pressure, water temperature — is mounted ahead of the driver on a drilled aluminium plinth. The large-diameter Nardi steering wheel was deliberately offset slightly right to centre the driver\'s sightline with the apex.',
    category: 'interior',
  },
]

// ─── Jaguar E-Type hotspots ───────────────────────────────────────────────────
// Sections: heritage, design, engine, racing, legacy, stars, acquire

export const JAGUAR_HOTSPOTS: HotspotData[] = [
  // ── Design section (low side profile) ─────────────────────────────────────
  {
    id:       'bodywork',
    position: [0.88, 0.48, -0.2],
    sections: ['design'],
    label:    'Sayer Coachwork',
    title:    'Malcolm Sayer\'s Aerodynamic Shell',
    detail:   'Malcolm Sayer was an aerodynamicist who designed Bristol Aeroplane Company aircraft before joining Jaguar. The E-Type\'s body was not styled — it was computed. Every curve resolved a mathematical equation. The result achieved a drag coefficient of approximately 0.44 Cd, exceptional for 1961 and achieved entirely without a wind tunnel.',
    category: 'design',
  },
  {
    id:       'long-bonnet',
    position: [0.15, 0.65, 2.0],
    sections: ['design'],
    label:    'Long Bonnet',
    title:    'Iconic 1,500mm Bonnet',
    detail:   'The E-Type\'s bonnet extends 1,500 mm ahead of the firewall — longer than the entire wheelbase of many contemporary sports cars. Its length is structural as much as aesthetic: the monocoque chassis terminates at the bulkhead, and the bonnet is a stressed panel that opens as a single unit including the front wings and headlight nacelles.',
    category: 'design',
  },

  // ── Engine section (front 3/4 view) ───────────────────────────────────────
  {
    id:       'xk-engine',
    position: [0.0, 0.68, 1.9],
    sections: ['engine'],
    label:    'XK Engine',
    title:    'XK 3.8L Straight-Six, DOHC',
    detail:   'The XK engine had already won Le Mans in the C-Type and D-Type before finding its way into the E-Type. The 3.8-litre twin-cam straight-six produces 265 bhp at 5,500 rpm and 260 lb·ft at 4,000 rpm. Its seven main-bearing crankshaft was over-engineered by the standards of the era, contributing to the XK\'s remarkable longevity in production service.',
    category: 'engineering',
  },
  {
    id:       'monocoque',
    position: [0.65, 0.22, 1.4],
    sections: ['engine'],
    label:    'Monocoque',
    title:    'Aircraft-Derived Monocoque Body',
    detail:   'The E-Type was the first Jaguar to use a monocoque structure — a technique borrowed from aircraft construction in which the outer skin carries structural load. The forward monocoque section terminates at the firewall; ahead of it, a separate tubular subframe carries the engine, front suspension and the hinged bonnet structure. Torsional rigidity: exceptional for 1961.',
    category: 'engineering',
  },

  // ── Racing section (cockpit view) ─────────────────────────────────────────
  {
    id:       'cockpit',
    position: [0.30, 0.75, 0.20],
    sections: ['racing'],
    label:    'Cockpit',
    title:    'Driver\'s Cockpit',
    detail:   'The E-Type cockpit is narrow — deliberately so. The transmission tunnel occupies significant space, and the door aperture is narrowed by the deep sill that forms part of the monocoque structure. Entry requires a specific choreography. Once inside, the driver sits low, surrounded by a sweeping dashboard and a sky-filling panoramic windscreen.',
    category: 'interior',
  },
  {
    id:       'instruments',
    position: [0.10, 0.68, 0.45],
    sections: ['racing'],
    label:    'Instruments',
    title:    'Smiths Instrument Cluster',
    detail:   'The binnacle ahead of the driver carries a Smiths 160 mph speedometer and 8,000 rpm tachometer alongside oil pressure, water temperature and fuel gauges. The centre console houses the starter toggle, ignition and choke controls. In period competition, the tachometer was the primary instrument — the driver never looked at the speedometer.',
    category: 'interior',
  },
]

// ─── McLaren F1 hotspots ──────────────────────────────────────────────────────
// Sections: heritage, design, engine, racing, legacy, stars, acquire

export const MCLAREN_HOTSPOTS: HotspotData[] = [
  // ── Design section (low side profile) ─────────────────────────────────────
  {
    id:       'carbon-body',
    position: [1.20, 0.55, 0.0],
    sections: ['design'],
    label:    'Carbon Monocoque',
    title:    'Full Carbon Fibre Monocoque Chassis',
    detail:   'The McLaren F1 was the first road car to use a full carbon fibre monocoque chassis — a technology that had existed in Formula 1 since 1981 but had never been considered viable for a road car. The tub weighs just 106 kg. Steve Nichols, who designed the McLaren MP4/4, oversaw its engineering. Its rigidity exceeds any contemporary steel equivalent by an order of magnitude.',
    category: 'engineering',
  },
  {
    id:       'air-intake',
    position: [0.75, 0.85, -0.8],
    sections: ['design'],
    label:    'Air Scoops',
    title:    'Roof-Mounted Air Intake Scoops',
    detail:   'Two twin roof-mounted NACA ducts deliver cold air to the BMW V12 at the rear. Their shape, placement and cross-section were determined through CFD modelling — the same tools that Gordon Murray used for the McLaren MP4 Formula 1 programme. At 240 mph, ram-effect increases intake pressure by approximately 12%, contributing to the engine\'s power advantage at high speed.',
    category: 'engineering',
  },

  // ── Engine section (mid-rear view) ────────────────────────────────────────
  {
    id:       'bmw-v12',
    position: [0.0, 0.70, -1.8],
    sections: ['engine'],
    label:    'BMW S70/2',
    title:    'BMW S70/2 — 6.1L V12, 627 HP',
    detail:   'Gordon Murray specified the brief to Paul Rosche of BMW Motorsport: lightest, most powerful naturally aspirated road car engine ever made, using no forced induction, no exotic materials, no race-derived service intervals. Rosche delivered a 6.1-litre V12 producing 627 horsepower at 7,400 rpm, weighing 266 kg, with a service interval of 20,000 miles. It remains the defining naturally aspirated road car engine.',
    category: 'engineering',
  },
  {
    id:       'gold-lining',
    position: [0.40, 0.62, -1.5],
    sections: ['engine'],
    label:    'Gold Foil Lining',
    title:    '24-Karat Gold Foil Engine Bay',
    detail:   'The McLaren F1\'s engine bay is lined entirely in 24-karat gold foil — not as ostentation, but as engineering. Gold is the most effective commercially available heat reflector at the temperatures the S70/2 generates. Aluminium foil, tested first, reflected 92% of radiant heat. Gold foil reflects 99%. Murray chose gold because no other solution worked as well.',
    category: 'engineering',
  },

  // ── Racing section (cockpit view) ─────────────────────────────────────────
  {
    id:       'center-seat',
    position: [0.0, 0.82, 0.4],
    sections: ['racing'],
    label:    'Central Seat',
    title:    'Central Driving Position',
    detail:   'Gordon Murray positioned the driver\'s seat at the car\'s centreline — a configuration borrowed from single-seater racing and never previously used in a three-seat road car. Two passenger seats flank the driver, offset slightly rearward. The result: perfect weight distribution, identical distance from driver to each side of the car, and a visibility envelope equalled by no other road car.',
    category: 'interior',
  },
  {
    id:       'instruments',
    position: [0.0, 0.75, 0.7],
    sections: ['racing'],
    label:    'Instruments',
    title:    'Formula 1-Derived Instrument Panel',
    detail:   'The instrument cluster wraps around the driver in a wide arc — tachometer, speedometer, oil temperature, oil pressure, fuel level all within sightline without head movement. The primary display is the 9,000 rpm tachometer, its red line at 7,500 rpm. A secondary LCD panel carries trip computer data derived from the McLaren Formula 1 team\'s pit-wall telemetry systems.',
    category: 'interior',
  },
]

export const GULLWING_HOTSPOTS: HotspotData[] = [
  // ── Design section (right-side profile: camera at z≈4, y≈0.5, x≈0.2) ──────

  {
    id:       'bodywork',
    position: [0.90, 0.55, 0.2],   // right mid-flank, visible in profile
    sections: ['design'],
    label:    'Coachwork',
    title:    'Hand-Formed Aluminium Coachwork',
    detail:   'Early 300 SLs were bodied entirely in hand-pressed aluminium, each panel shaped over wooden forming bucks by craftsmen at Sindelfingen. The compound curves — particularly around the rear haunches — were impossible to produce by machine in 1954. No two Gullwings were dimensionally identical.',
    category: 'design',
  },
  {
    id:       'windscreen',
    position: [0.0, 1.05, 0.85],   // centre-top, forward of roof
    sections: ['design'],
    label:    'Windscreen',
    title:    'Curved Panoramic Windscreen',
    detail:   'The full-width wrap-around windscreen — hand-bent from a single sheet of Sekurit safety glass — was among the most technically demanding components in production. Its low, raked angle was dictated by aerodynamics: the 300 SL achieved a drag coefficient of 0.398 Cd, remarkable for 1954.',
    category: 'design',
  },

  // ── Engine section (front-left 3/4: camera at z≈4.8, y≈0.65, x≈-0.3) ─────

  {
    id:       'engine',
    position: [-0.2, 0.65, 2.1],   // front-centre, hood level
    sections: ['engine'],
    label:    'M198 Engine',
    title:    'M198 Straight-Six — 2,996cc',
    detail:   'The 2,996cc inline-six is inclined 50° to the right, lowering the bonnet line and improving weight distribution. It produces 215 bhp at 5,800 rpm in road trim — 240 bhp in the alloy-bodied competition version. Bore × stroke: 85 × 88 mm. Compression ratio: 8.55:1.',
    category: 'engineering',
  },
  {
    id:       'fuel-injection',
    position: [-0.55, 0.50, 1.6],  // left side of engine bay
    sections: ['engine'],
    label:    'Fuel Injection',
    title:    'Bosch Mechanical Fuel Injection',
    detail:   'The first direct mechanical fuel injection system fitted to a production road car. Adapted from the Daimler-Benz DB 601 aero engine used in the Bf 109 fighter, it delivered a precise metered charge to each cylinder — impossible with the carburettors of the day. The system required hand-calibration for each car.',
    category: 'engineering',
  },
  {
    id:       'space-frame',
    position: [0.65, 0.30, 1.8],   // right sill, front section visible
    sections: ['engine'],
    label:    'Space-Frame',
    title:    'Tubular Space-Frame Chassis',
    detail:   'Rudolf Uhlenhaut\'s multi-tubular space-frame — a lattice of 29 mm and 20 mm steel tubes — weighs just 52 kg yet is torsionally stiffer than any contemporary pressed-steel platform. Its intrusion high into the door openings made conventional doors structurally impossible, necessitating the roof-hinged solution.',
    category: 'engineering',
  },

  // ── Doors section (elevated overhead: camera at z≈5.2, y≈2.0) ───────────

  {
    id:       'door-hinge',
    position: [0.25, 1.18, 0.25],  // roofline, driver side
    sections: ['doors'],
    label:    'Door Hinge',
    title:    'Roof-Hinged Door Mechanism',
    detail:   'Each door is hinged from a pivot point at the roofline rather than the A-pillar, opening upward at approximately 90° to the body. A precisely weighted spring-assist counterbalance allows the door to open without effort and hold position. The interior latch — there is no exterior handle — adds to the ceremony of entry.',
    category: 'engineering',
  },

  // ── Interior section (tight overhead cockpit: camera at z≈3.2, y≈1.8) ────

  {
    id:       'instruments',
    position: [0.15, 0.82, 0.55],  // instrument cluster, driver ahead
    sections: ['interior'],
    label:    'Instruments',
    title:    'VDO Instrument Cluster',
    detail:   'The semi-circular arc of VDO instruments — 220 km/h speedometer, 7,000 rpm tachometer, oil pressure, water temperature, and fuel gauge — faces the driver on a 20° incline for minimised glare. At the racing speeds for which this car was conceived, clarity was not a comfort feature. It was survival.',
    category: 'interior',
  },
  {
    id:       'steering-wheel',
    position: [0.38, 0.70, 0.50],  // steering column, driver side
    sections: ['interior'],
    label:    'Steering Wheel',
    title:    'Ivory-Rim Steering Wheel',
    detail:   'The large-diameter three-spoke wheel with its ivory-coloured Bakelite rim was standard specification, though some owners ordered solid wood or leather trim at extra cost. Its diameter — generous relative to the narrow cockpit — is a deliberate choice: lower gearing gave lighter feel at the cost of more lock-to-lock turns.',
    category: 'interior',
  },
]

// ─── Porsche 911 Urmodell hotspots ────────────────────────────────────────────
// Sections: heritage, design, engine, lineage, legacy, stars, acquire

export const PORSCHE_911_HOTSPOTS: HotspotData[] = [
  {
    id:       '911-silhouette',
    position: [0.90, 0.50, 0.0],
    sections: ['design'],
    label:    'Butzi Porsche Body',
    title:    'Ferdinand "Butzi" Porsche III Design',
    detail:   'Ferdinand Porsche III — grandson of the founder — designed the 911 body without precedent. The fastback roofline, rounded nose and distinctive rear haunches were resolved by intuition. Every subsequent 911, across six decades, has been a refinement of this original sketch. No clean-sheet redesign was ever commercially necessary.',
    category: 'design',
  },
  {
    id:       '911-rear-window',
    position: [0.0, 0.90, -1.6],
    sections: ['design'],
    label:    'Rear Engine Lid',
    title:    'Rear-Engine Fastback Profile',
    detail:   'The 911\'s rear window angle and the gradual slope of the Kamm tail were determined aerodynamically. The flat rear deck above the engine lid reduces lift. The wide C-pillars, unusual for 1963, were a structural necessity of the fastback — and became an immediately recognisable design signature.',
    category: 'design',
  },
  {
    id:       '911-flat-six',
    position: [0.0, 0.65, -1.9],
    sections: ['engine'],
    label:    'Air-Cooled Flat-Six',
    title:    '2.0L Air-Cooled Flat-Six — 130 HP',
    detail:   'The 1,991cc air-cooled flat-six is mounted behind the rear axle, driving the rear wheels. No water. No radiator hoses. No coolant. The cooling fan, belt-driven from the crankshaft, forces air through finned cylinder barrels and heads. The engine note — a mechanical whirr followed by a rising bark — is unlike any other car ever made.',
    category: 'engineering',
  },
  {
    id:       '911-cockpit',
    position: [0.35, 0.80, 0.30],
    sections: ['lineage'],
    label:    'Driver\'s Cockpit',
    title:    'Original Cockpit Layout',
    detail:   'The 911 cockpit was designed around the driver with unusual care for 1963. Five dials in a continuous arc ahead of the driver — tachometer centred, speedometer to the right, ancillary gauges to the left. The wheel is large, the seating position upright. The view ahead is unobstructed. It established a template Porsche would follow for thirty years.',
    category: 'interior',
  },
]

// ─── Porsche 917K hotspots ────────────────────────────────────────────────────
// Sections: heritage, design, engine, race, legacy, stars, acquire

export const PORSCHE_917K_HOTSPOTS: HotspotData[] = [
  {
    id:       '917k-body',
    position: [0.90, 0.28, 0.0],
    sections: ['design'],
    label:    'Kurzheck Body',
    title:    'Short-Tail Kurzheck Aerodynamic Body',
    detail:   'The K in 917K stands for Kurzheck — short tail. The original long-tail 917L was faster in a straight line but dangerously unstable. A team of aerodynamicists from Stuttgart University revised the rear bodywork, adding a spoiler and truncating the tail. The 917K was 10 km/h slower on the Mulsanne Straight but lapped Le Mans faster overall.',
    category: 'design',
  },
  {
    id:       '917k-nose',
    position: [0.0, 0.32, 2.2],
    sections: ['design'],
    label:    'Front Spoiler',
    title:    'Adjustable Front Aerodynamic Package',
    detail:   'The 917K\'s nose features an adjustable front splitter that could be configured differently for each circuit. At Le Mans, it was set for maximum straightline stability; at Brands Hatch, for cornering grip. The twin headlight pods — fixed, forward-facing — illuminate the track while the enclosed wheel arches reduce aerodynamic drag.',
    category: 'design',
  },
  {
    id:       '917k-flat12',
    position: [0.0, 0.58, -1.8],
    sections: ['engine'],
    label:    'Flat-12 Engine',
    title:    'Porsche Type 912 — 4.9L Flat-12, 580 HP',
    detail:   'Twelve air-cooled horizontally-opposed cylinders. Four overhead camshafts. 580 horsepower at 8,400 rpm in the 4.9-litre specification — 630 in the 5.0-litre 1971 variant. The engine weighs 229 kg. Its wide, flat profile lowers the 917\'s centre of gravity and places mass ahead of the rear axle, contributing to the revised model\'s improved handling balance.',
    category: 'engineering',
  },
  {
    id:       '917k-cockpit',
    position: [0.0, 0.72, 0.5],
    sections: ['race'],
    label:    'Cockpit',
    title:    'Le Mans Specification Cockpit',
    detail:   'The 917K\'s cockpit is spartan even by racing standards. A single bucket seat, full roll cage, fire suppression system, and the instruments the driver needs: tachometer, oil temperature, oil pressure, water temperature. The steering wheel detaches for entry. At Le Mans, two drivers share the car across twenty-four hours — the seat, therefore, is adjustable.',
    category: 'interior',
  },
]

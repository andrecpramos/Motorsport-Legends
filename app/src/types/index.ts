export interface Section {
  id: string
  title: string
  subtitle: string
  copy: string
  stats?: Stat[]
  features?: string[]
  progressStart: number
  progressEnd: number
}

export interface Stat {
  value: string
  label: string
  unit?: string
}

export interface CarTransform {
  carRotY: number
  carY: number
  camZ: number
  camY: number
  camX: number
}

export interface Keyframe extends CarTransform {
  progress: number
}

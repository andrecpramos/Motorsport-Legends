import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; carName?: string }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgb(var(--color-background, 8 7 5))' }}
        >
          <div className="text-center space-y-3">
            <p
              className="font-display font-light italic text-2xl"
              style={{ color: 'rgba(220,215,205,0.4)' }}
            >
              {this.props.carName ?? '3D Experience'}
            </p>
            <p
              className="font-body text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(176,148,90,0.55)' }}
            >
              Unable to load 3D experience
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

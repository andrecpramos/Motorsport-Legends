import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description?: string
}

/**
 * Imperatively sets document.title and meta[name=description] on mount.
 * No extra library required — works with the existing Vite/React setup.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    if (!description) return
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) {
      const prev = meta.getAttribute('content') ?? ''
      meta.setAttribute('content', description)
      return () => { meta.setAttribute('content', prev) }
    }
  }, [description])

  return null
}

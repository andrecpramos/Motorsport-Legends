import { useEffect } from 'react'

interface CarSchemaProps {
  name:        string
  description: string
  brand:       string
  modelDate:   string
  /** Canonical page URL, e.g. https://legends.cars/ferrari */
  url:         string
}

/**
 * Injects a schema.org/Car JSON-LD script into <head>.
 * Cleaned up on unmount so each car page has its own structured data.
 */
export function CarSchemaOrg({ name, description, brand, modelDate, url }: CarSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Car',
      name,
      description,
      brand:     { '@type': 'Brand', name: brand },
      modelDate,
      url,
      offers: {
        '@type':         'Offer',
        availability:    'https://schema.org/InStock',
        priceCurrency:   'GBP',
        seller: {
          '@type': 'Organization',
          name:    'Legends Classic Automobiles',
          url:     'https://legends.cars',
        },
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id   = 'car-schema'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => { document.getElementById('car-schema')?.remove() }
  }, [name, description, brand, modelDate, url])

  return null
}

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface CarCardProps {
  index:      number
  name:       string
  subtitle:   string
  descriptor: string
  year:       string
  origin:     string
  href:       string
}

export function CarCard({ index, name, subtitle, descriptor, year, origin, href }: CarCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  // Subtle tilt on hover
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const cardVariants = {
    hidden:  { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' as const, delay: index * 0.15 },
    },
  }

  return (
    <motion.a
      ref={cardRef}
      href={href}
      // Use anchor href instead of Link for Framer Motion ref compat; router handles it
      onClick={(e) => { e.preventDefault() }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative flex flex-col border border-ink/[0.08] bg-surface/20 backdrop-blur-sm
                 hover:border-accent/30 transition-colors duration-500 cursor-pointer select-none
                 overflow-hidden"
      aria-label={`Explore the ${name}`}
    >
      {/* Subtle ambient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(176,148,90,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Index number */}
      <div className="px-8 pt-8 pb-0">
        <span className="font-body text-[10px] tracking-[0.5em] text-ink/55 uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-8 pb-10 pt-6 gap-6">
        {/* Car name */}
        <div>
          <div className="overflow-hidden pb-1">
            <motion.h2
              className="font-display font-light italic text-ink leading-none group-hover:text-accent/90 transition-colors duration-500"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
              whileHover={{ y: 0 }}
            >
              {name}
            </motion.h2>
          </div>
          <p
            className="font-display font-light text-accent/70 tracking-[0.12em] mt-1"
            style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.35rem)' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div
            className="h-px bg-accent/25 transition-all duration-700 group-hover:bg-accent/50"
            style={{ width: '2rem' }}
          />
          <div className="w-[3px] h-[3px] rounded-full bg-accent/25 group-hover:bg-accent/50 transition-colors duration-700" />
        </div>

        {/* Meta */}
        <div className="space-y-1">
          <p className="font-body text-[11px] italic text-ink/80 leading-relaxed">
            {descriptor}
          </p>
          <div className="flex items-center gap-4 pt-1">
            <span className="font-body text-[9px] tracking-[0.4em] text-ink/65 uppercase">{year}</span>
            <span className="font-body text-[9px] tracking-[0.4em] text-ink/55 uppercase">{origin}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2 flex items-center gap-3">
          <span className="font-body text-[10px] tracking-[0.35em] text-accent/80 uppercase group-hover:text-accent transition-colors duration-400">
            Explore
          </span>
          <div className="h-px w-5 bg-accent/30 group-hover:w-10 group-hover:bg-accent/60 transition-all duration-500" />
        </div>
      </div>

      {/* Bottom accent line — expands on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/0 group-hover:bg-accent/25 transition-colors duration-700" />
    </motion.a>
  )
}

// Wrapper that handles actual navigation via react-router-dom
export function CarCardLink(props: CarCardProps) {
  return (
    <Link to={props.href} className="contents">
      <CarCardInner {...props} />
    </Link>
  )
}

function CarCardInner({ index, name, subtitle, descriptor, year, origin }: CarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
      className="group relative flex flex-col border border-ink/[0.08] bg-surface/20 backdrop-blur-sm
                 hover:border-accent/30 transition-colors duration-500 cursor-pointer select-none
                 overflow-hidden h-full"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(176,148,90,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="px-8 pt-8 pb-0">
        <span className="font-body text-[10px] tracking-[0.5em] text-ink/55 uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-col flex-1 px-8 pb-10 pt-6 gap-6">
        <div>
          <div className="overflow-hidden pb-1">
            <h2
              className="font-display font-light italic text-ink leading-none group-hover:text-accent/90 transition-colors duration-500"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
            >
              {name}
            </h2>
          </div>
          <p
            className="font-display font-light text-accent/70 tracking-[0.12em] mt-1"
            style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.35rem)' }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px bg-accent/25 transition-all duration-700 group-hover:bg-accent/50 w-8" />
          <div className="w-[3px] h-[3px] rounded-full bg-accent/25 group-hover:bg-accent/50 transition-colors duration-700" />
        </div>

        <div className="space-y-1">
          <p className="font-body text-[11px] italic text-ink/80 leading-relaxed">
            {descriptor}
          </p>
          <div className="flex items-center gap-4 pt-1">
            <span className="font-body text-[9px] tracking-[0.4em] text-ink/65 uppercase">{year}</span>
            <span className="font-body text-[9px] tracking-[0.4em] text-ink/55 uppercase">{origin}</span>
          </div>
        </div>

        <div className="mt-auto pt-2 flex items-center gap-3">
          <span className="font-body text-[10px] tracking-[0.35em] text-accent/80 uppercase group-hover:text-accent transition-colors duration-400">
            Explore
          </span>
          <div className="h-px w-5 bg-accent/30 group-hover:w-10 group-hover:bg-accent/60 transition-all duration-500" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-accent/0 group-hover:bg-accent/25 transition-colors duration-700" />
    </motion.div>
  )
}

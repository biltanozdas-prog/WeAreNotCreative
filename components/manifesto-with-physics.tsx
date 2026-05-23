"use client"

import { useEffect, useRef } from "react"
import Matter from "matter-js"

const SERVICES = [
  { num: "01", name: "Brand Strategy", desc: "So your brand knows what it stands for.", dark: true },
  { num: "02", name: "Visual Systems", desc: "So it looks the same everywhere it lives.", dark: false },
  { num: "03", name: "Creative Direction", desc: "So every touchpoint carries conviction.", dark: true },
  { num: "04", name: "Brand Architecture", desc: "So your portfolio makes sense.", dark: false },
  { num: "05", name: "Digital Experiences", desc: "So the web works as hard as you do.", dark: true },
  { num: "06", name: "Objects & Products", desc: "So the idea exists in your hands.", dark: false },
  { num: "07", name: "Content & Campaign Systems", desc: "So the message keeps moving.", dark: true },
]

const BOX_W = 200
const BOX_H = 90

interface Props {
  headline?: string
  body?: string
}

export function ManifestoWithPhysics({ headline, body }: Props) {
  const physicsRef = useRef<HTMLDivElement>(null)
  const boxEls = useRef<HTMLDivElement[]>([])
  const bodies = useRef<Matter.Body[]>([])
  const frameRef = useRef<number>(0)
  const dragging = useRef<{ body: Matter.Body; offX: number; offY: number } | null>(null)

  useEffect(() => {
    const container = physicsRef.current
    if (!container) return

    const W = container.offsetWidth
    const H = container.offsetHeight

    // Gentle gravity — the deck settles softly and stays put until dragged.
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.4 } })

    const ground = Matter.Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, friction: 0.9 })
    const wallL = Matter.Bodies.rectangle(-25, H / 2, 50, H * 4, { isStatic: true })
    const wallR = Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 4, { isStatic: true })
    Matter.Composite.add(engine.world, [ground, wallL, wallR])

    // Seed the boxes ALREADY STACKED near the bottom — visible on first paint,
    // no long fall. They settle in place and wait to be dragged.
    bodies.current = []
    const cx = W / 2
    const baseY = H - BOX_H / 2 - 6
    SERVICES.forEach((_, i) => {
      const x = cx + (Math.random() * 48 - 24)
      const y = Math.max(BOX_H / 2 + 4, baseY - i * (BOX_H * 0.92))
      const body = Matter.Bodies.rectangle(x, y, BOX_W, BOX_H, {
        restitution: 0.08,
        friction: 0.9,
        frictionAir: 0.02,
        angle: (Math.random() - 0.5) * 0.14,
        label: `box-${i}`,
      })
      bodies.current.push(body)
      Matter.Composite.add(engine.world, body)
    })

    const runner = Matter.Runner.create()
    Matter.Runner.run(runner, engine)

    function loop() {
      bodies.current.forEach((body, i) => {
        const el = boxEls.current[i]
        if (!el) return
        const { x, y } = body.position
        el.style.transform = `translate(${x - BOX_W / 2}px, ${y - BOX_H / 2}px) rotate(${body.angle}rad)`
      })
      frameRef.current = requestAnimationFrame(loop)
    }
    frameRef.current = requestAnimationFrame(loop)

    function getBody(mx: number, my: number) {
      for (let i = bodies.current.length - 1; i >= 0; i--) {
        const b = bodies.current[i]
        if (Math.abs(b.position.x - mx) < BOX_W / 2 && Math.abs(b.position.y - my) < BOX_H / 2) {
          return b
        }
      }
      return undefined
    }

    function startDrag(mx: number, my: number) {
      const b = getBody(mx, my)
      if (!b) return
      Matter.Body.setStatic(b, true)
      dragging.current = { body: b, offX: mx - b.position.x, offY: my - b.position.y }
    }
    function moveDrag(mx: number, my: number) {
      if (!dragging.current) return
      const { body, offX, offY } = dragging.current
      const nx = Math.max(BOX_W / 2, Math.min(W - BOX_W / 2, mx - offX))
      const ny = Math.max(BOX_H / 2, Math.min(H - BOX_H / 2, my - offY))
      Matter.Body.setPosition(body, { x: nx, y: ny })
      Matter.Body.setVelocity(body, { x: 0, y: 0 })
    }
    function endDrag() {
      if (!dragging.current) return
      Matter.Body.setStatic(dragging.current.body, false)
      dragging.current = null
    }

    const onDown = (e: MouseEvent) => {
      const r = container.getBoundingClientRect()
      startDrag(e.clientX - r.left, e.clientY - r.top)
    }
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const r = container.getBoundingClientRect()
      moveDrag(e.clientX - r.left, e.clientY - r.top)
    }
    const onTouchDown = (e: TouchEvent) => {
      const r = container.getBoundingClientRect()
      startDrag(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      const r = container.getBoundingClientRect()
      moveDrag(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top)
    }

    container.addEventListener("mousedown", onDown)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", endDrag)
    container.addEventListener("touchstart", onTouchDown, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", endDrag)

    return () => {
      cancelAnimationFrame(frameRef.current)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      container.removeEventListener("mousedown", onDown)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", endDrag)
      container.removeEventListener("touchstart", onTouchDown)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", endDrag)
    }
  }, [])

  return (
    <section className="bg-background relative z-10 grid grid-cols-1 md:grid-cols-2 border-b border-foreground items-stretch">
      {/* LEFT — Manifesto */}
      <div className="flex flex-col justify-between px-8 md:px-[60px] py-16 md:py-[120px] md:border-r border-foreground">
        <div>
          <p className="font-sans font-light text-[11px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-10">
            Manifesto
          </p>
          <h2 className="font-sans font-black text-[8vw] md:text-[5.5vw] leading-[0.88] uppercase text-foreground max-w-[95%] text-balance tracking-[-0.03em] mb-8 md:mb-12">
            {headline ?? "Design as a Cultural Practice."}
          </h2>
          <p className="font-sans font-light text-[15px] md:text-[18px] leading-[1.65] text-muted-foreground max-w-[480px] md:ml-[6ch]">
            {body ??
              "We work with independent brands, cultural institutions and creative leaders who need clarity without compromise. From identity systems to editorial direction — we shape how ideas become visible."}
          </p>
        </div>
        <a
          href="/contact"
          className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] border-b-2 border-foreground pb-0.5 hover:opacity-60 transition-opacity mt-10 md:mt-0 w-fit no-underline text-foreground"
        >
          Start a Project
        </a>
      </div>

      {/* RIGHT — interactive physics service deck */}
      <div
        ref={physicsRef}
        className="relative overflow-hidden bg-background touch-none w-full h-full min-h-[580px] md:min-h-[660px]"
        style={{ cursor: "grab" }}
      >
        {SERVICES.map((svc, i) => (
          <div
            key={svc.num}
            ref={(el) => {
              if (el) boxEls.current[i] = el
            }}
            className={`absolute select-none border border-foreground px-4 py-3.5 ${
              svc.dark ? "bg-foreground text-background" : "bg-background text-foreground"
            }`}
            style={{ width: BOX_W, height: BOX_H, top: 0, left: 0, willChange: "transform" }}
          >
            <p className={`text-[8px] tracking-[.12em] mb-1.5 ${svc.dark ? "text-white/30" : "text-foreground/30"}`}>
              {svc.num}
            </p>
            <p className="text-[12px] font-black tracking-[-0.015em] uppercase leading-[1.05] mb-1">
              {svc.name}
            </p>
            <p className={`text-[9px] leading-[1.4] ${svc.dark ? "text-white/45" : "text-foreground/45"}`}>
              {svc.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

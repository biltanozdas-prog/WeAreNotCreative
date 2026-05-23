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

const BOX_W = 188
const BOX_H = 76
const SECTION_H = 480

export function ServicesPhysics() {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const boxEls = useRef<HTMLDivElement[]>([])
  const bodies = useRef<Matter.Body[]>([])
  const frameRef = useRef<number>(0)
  const dragging = useRef<{ body: Matter.Body; offX: number; offY: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const W = container.offsetWidth
    const H = container.offsetHeight

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.8 } })
    engineRef.current = engine

    // Invisible bounds so boxes can't escape the section
    const ground = Matter.Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, friction: 0.8, label: "ground" })
    const wallL = Matter.Bodies.rectangle(-25, H / 2, 50, H * 4, { isStatic: true })
    const wallR = Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 4, { isStatic: true })
    Matter.Composite.add(engine.world, [ground, wallL, wallR])

    bodies.current = []
    const cols = 3
    SERVICES.forEach((_, i) => {
      const col = i % cols
      const slot = W / cols
      const x = slot * col + slot / 2 + (Math.random() * 40 - 20)
      const y = -60 - i * 80
      const body = Matter.Bodies.rectangle(x, y, BOX_W, BOX_H, {
        restitution: 0.1,
        friction: 0.8,
        frictionAir: 0.015,
        angle: (Math.random() - 0.5) * 0.3,
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

    function getBodyAt(x: number, y: number) {
      for (let i = bodies.current.length - 1; i >= 0; i--) {
        const b = bodies.current[i]
        if (Math.abs(b.position.x - x) < BOX_W / 2 && Math.abs(b.position.y - y) < BOX_H / 2) {
          return b
        }
      }
      return undefined
    }

    function startDrag(mx: number, my: number) {
      const body = getBodyAt(mx, my)
      if (!body) return
      Matter.Body.setStatic(body, true)
      dragging.current = { body, offX: mx - body.position.x, offY: my - body.position.y }
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

    const onMouseDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      startDrag(e.clientX - rect.left, e.clientY - rect.top)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const rect = container.getBoundingClientRect()
      moveDrag(e.clientX - rect.left, e.clientY - rect.top)
    }
    const onTouchStart = (e: TouchEvent) => {
      const rect = container.getBoundingClientRect()
      startDrag(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      const rect = container.getBoundingClientRect()
      moveDrag(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top)
    }

    container.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", endDrag)
    container.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", endDrag)

    return () => {
      cancelAnimationFrame(frameRef.current)
      Matter.Runner.stop(runner)
      Matter.Engine.clear(engine)
      container.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", endDrag)
      container.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", endDrag)
    }
  }, [])

  return (
    <section className="bg-background border-t border-foreground border-b border-foreground">
      {/* Eyebrow header strip */}
      <div className="flex justify-between items-center px-8 md:px-[60px] py-5 border-b border-foreground/10">
        <h2 className="text-[clamp(13px,1.6vw,20px)] font-black tracking-[-0.02em] uppercase">
          What We Do
        </h2>
        <p className="text-[8px] md:text-[9px] tracking-[.18em] uppercase text-foreground/40">
          Drag the boxes
        </p>
      </div>

      {/* Physics arena — full width */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-background touch-none"
        style={{ height: SECTION_H, cursor: "grab" }}
      >
        {SERVICES.map((svc, i) => (
          <div
            key={svc.num}
            ref={(el) => {
              if (el) boxEls.current[i] = el
            }}
            className={`absolute select-none border border-foreground px-3 py-3 ${
              svc.dark ? "bg-foreground text-background" : "bg-background text-foreground"
            }`}
            style={{ width: BOX_W, height: BOX_H, top: 0, left: 0, willChange: "transform" }}
          >
            <p className={`text-[8px] tracking-[.12em] mb-1 ${svc.dark ? "text-white/30" : "text-foreground/30"}`}>
              {svc.num}
            </p>
            <p className="text-[11px] font-black tracking-[-0.015em] uppercase leading-[1.1] mb-1">
              {svc.name}
            </p>
            <p className={`text-[9px] leading-[1.4] ${svc.dark ? "text-white/40" : "text-foreground/40"}`}>
              {svc.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

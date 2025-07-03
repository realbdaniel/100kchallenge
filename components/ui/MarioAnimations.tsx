'use client'

import { useEffect, useState } from 'react'

interface FloatingElement {
  id: string
  emoji: string
  x: number
  y: number
  size: 'small' | 'medium' | 'large' | 'xlarge'
  animationClass: string
  duration: number
}

export default function MarioAnimations() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  // Enemy emojis reminiscent of Mario
  const enemies = ['👾', '🐛', '🦎', '🐍', '🕷️', '🦂', '🐙', '🦑']
  const powerUps = ['🍄', '⭐', '🔥', '⚡', '💎', '🎃', '🌟', '✨']
  const coins = ['💰', '💰', '💰', '💰']

  useEffect(() => {
    const spawnElement = () => {
      const isEnemy = Math.random() < 0.4
      const isPowerUp = Math.random() < 0.3
      const isCoin = Math.random() < 0.5

      let emoji: string
      let animationClass: string
      let size: 'small' | 'medium' | 'large' | 'xlarge'

      if (isEnemy) {
        emoji = enemies[Math.floor(Math.random() * enemies.length)]
        const speeds = ['enemy-scroll-slow', 'enemy-scroll', 'enemy-scroll-fast']
        animationClass = speeds[Math.floor(Math.random() * speeds.length)]
        size = Math.random() < 0.3 ? 'large' : 'medium'
      } else if (isPowerUp) {
        emoji = powerUps[Math.floor(Math.random() * powerUps.length)]
        animationClass = 'power-up-float'
        size = Math.random() < 0.5 ? 'large' : 'medium'
      } else {
        emoji = coins[Math.floor(Math.random() * coins.length)]
        animationClass = Math.random() < 0.5 ? 'coin-spin' : 'coin-float'
        size = 'large'
      }

      const newElement: FloatingElement = {
        id: Math.random().toString(36).substr(2, 9),
        emoji,
        x: -100,
        y: Math.random() * (window.innerHeight - 100),
        size,
        animationClass,
        duration: 25 + Math.random() * 25
      }

      setElements(prev => [...prev, newElement])

      // Remove element after animation
      setTimeout(() => {
        setElements(prev => prev.filter(el => el.id !== newElement.id))
      }, newElement.duration * 1000)
    }

    // Spawn initial elements
    const initialSpawn = () => {
      for (let i = 0; i < 8; i++) {
        setTimeout(spawnElement, i * 1000)
      }
    }

    initialSpawn()

    // Continue spawning elements
    const interval = setInterval(spawnElement, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Floating elements */}
      <div className="floating-elements">
        {elements.map(element => (
          <div
            key={element.id}
            className={`floating-element ${element.size} ${element.animationClass}`}
            style={{
              top: `${element.y}px`,
              left: `${element.x}px`,
              animationDuration: `${element.duration}s`
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* Static decorative elements */}
      <div className="floating-elements">
        {/* Bouncing money bags - positioned away from title area */}
        <div className="floating-element xlarge mario-bounce" style={{ top: '45%', left: '8%' }}>
          💰
        </div>
        <div className="floating-element xlarge mario-bounce" style={{ top: '65%', right: '12%', animationDelay: '1s' }}>
          💰
        </div>
        <div className="floating-element xlarge mario-bounce" style={{ top: '85%', left: '25%', animationDelay: '0.5s' }}>
          💰
        </div>
      </div>

      {/* Parallax background elements */}
      <div className="parallax-bg">
        <div className="parallax-layer parallax-layer-2">
          <div className="floating-element" style={{ top: '5%', left: '5%', fontSize: '4rem' }}>☁️</div>
          <div className="floating-element" style={{ top: '50%', left: '50%', fontSize: '4rem' }}>☁️</div>
          <div className="floating-element" style={{ top: '75%', left: '75%', fontSize: '4rem' }}>☁️</div>
          <div className="floating-element" style={{ top: '90%', left: '90%', fontSize: '4rem' }}>☁️</div>
        </div>
      </div>
    </>
  )
} 
const createSecondTicker = () => {
  let accumulator = 0
  let seconds = 0

  return {
    update(delta: number) {
      accumulator += delta

      const ticks = Math.floor(accumulator / 1000)
      if (ticks > 0) {
        accumulator -= ticks * 1000
        seconds += ticks
        return seconds
      }

      return null
    },
    reset() {
      accumulator = 0
      seconds = 0
    },
  }
}
const formatTimeHHMMSS = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n: number) => String(n).padStart(2, "0")

  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

export const createTimer = () => {
  const ticker = createSecondTicker()

  let lastTime = 0
  let paused = false
  let animationId = 0

  const loop = (now: number) => {
    if (paused) return

    const delta = now - lastTime
    lastTime = now

    const second = ticker.update(delta)
    if (second !== null) {
      console.log(formatTimeHHMMSS(second))
    }

    animationId = requestAnimationFrame(loop)
  }

  return {
    start() {
      paused = false
      lastTime = performance.now()
      animationId = requestAnimationFrame(loop)
    },
    pause() {
      paused = true
      cancelAnimationFrame(animationId)
    },
  }
}

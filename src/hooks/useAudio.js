import { useCallback, useRef, useEffect } from 'react'

/* ─────────────────────────────────────────────
   useAudio — Web Speech API wrapper
   Provides:
     speak(text, lang?)   — TTS pronunciation
     playCorrect()        — positive chime (AudioContext)
     playWrong()          — error buzz
     playLevelUp()        — level up fanfare
   No external dependencies — uses browser APIs only
   ───────────────────────────────────────────── */

export function useAudio({ enabled = true, lang = 'es-ES' } = {}) {
  const synthRef    = useRef(null)
  const ctxRef      = useRef(null)
  const voicesRef   = useRef([])

  // ── Init Speech Synthesis ────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    synthRef.current = window.speechSynthesis

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  // ── Get AudioContext (lazy) ──────────────────
  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }

  // ── Speak text ──────────────────────────────
  const speak = useCallback((text, overrideLang) => {
    if (!enabled || !synthRef.current || !text) return
    synthRef.current.cancel()

    const utt  = new SpeechSynthesisUtterance(text)
    const useLang = overrideLang || lang

    // Try to find a matching voice
    const voices = voicesRef.current
    const match  = voices.find(v => v.lang === useLang)
      || voices.find(v => v.lang.startsWith(useLang.split('-')[0]))
    if (match) utt.voice = match

    utt.lang  = useLang
    utt.rate  = 0.85   // slightly slower for kids
    utt.pitch = 1.1    // slightly higher for friendliness
    utt.volume = 1

    synthRef.current.speak(utt)
  }, [enabled, lang])

  // ── Stop speaking ───────────────────────────
  const stop = useCallback(() => {
    synthRef.current?.cancel()
  }, [])

  // ── Tone generator helper ────────────────────
  function playTone({ freq = 440, type = 'sine', duration = 0.15, gain = 0.3, delay = 0, detune = 0 }) {
    if (!enabled) return
    try {
      const ctx  = getCtx()
      const osc  = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.type        = type
      osc.frequency.value = freq
      osc.detune.value    = detune
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay)
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.02)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration)

      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + duration + 0.05)
    } catch { /* AudioContext blocked before user gesture — ignore */ }
  }

  // ── Correct answer — happy chime ─────────────
  const playCorrect = useCallback(() => {
    playTone({ freq: 523, duration: 0.12, gain: 0.25 })          // C5
    playTone({ freq: 659, duration: 0.12, gain: 0.25, delay: 0.1 }) // E5
    playTone({ freq: 784, duration: 0.2,  gain: 0.3,  delay: 0.2 }) // G5
  }, [enabled])

  // ── Wrong answer — soft buzz ─────────────────
  const playWrong = useCallback(() => {
    playTone({ freq: 220, type: 'sawtooth', duration: 0.18, gain: 0.15 })
    playTone({ freq: 196, type: 'sawtooth', duration: 0.18, gain: 0.12, delay: 0.15 })
  }, [enabled])

  // ── Level up — fanfare ───────────────────────
  const playLevelUp = useCallback(() => {
    const notes = [
      { freq: 523, delay: 0 },
      { freq: 659, delay: 0.1 },
      { freq: 784, delay: 0.2 },
      { freq: 1047,delay: 0.3 },
    ]
    notes.forEach(n => playTone({ freq: n.freq, duration: 0.25, gain: 0.3, delay: n.delay }))
  }, [enabled])

  // ── Badge unlock — sparkle ───────────────────
  const playBadge = useCallback(() => {
    [0, 0.08, 0.16, 0.24].forEach((delay, i) => {
      playTone({ freq: 880 + i * 220, duration: 0.1, gain: 0.2, delay })
    })
  }, [enabled])

  // ── Button click — subtle tick ────────────────
  const playClick = useCallback(() => {
    playTone({ freq: 800, type: 'sine', duration: 0.06, gain: 0.08 })
  }, [enabled])

  return { speak, stop, playCorrect, playWrong, playLevelUp, playBadge, playClick }
}

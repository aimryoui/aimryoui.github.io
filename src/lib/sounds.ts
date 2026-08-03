import { useAudioStore } from "@/stores/audio-store"

type AudioContextCtor = typeof AudioContext

function getAudioContextCtor(): AudioContextCtor | undefined {
    if (typeof window === "undefined") return undefined
    return (
        (window as unknown as { AudioContext?: AudioContextCtor })
            .AudioContext ??
        (window as unknown as { webkitAudioContext?: AudioContextCtor })
            .webkitAudioContext
    )
}

const HOVER_SOUNDS = ["tick", "button"] as const

type HoverSoundType = (typeof HOVER_SOUNDS)[number] | false
type PressSoundType =
    | "button"
    | "link"
    | "input"
    | "zoom-in"
    | "zoom-out"
    | false

interface HoverConfigs {
    duration: number
    gain: number
    transientDecay: number
    transientMultiplier: number
    modes: { frequency: number; decay: number; gain: number; phase: number }[]
}

interface PressConfigs {
    duration: number
    gain: number
    attack: number
    release: number
    pitchSweep: number
    baseFreq: number
    sweepDirection: "up" | "down"
    sweepSpeed: number
    oscDecay: number
    noiseMix: number
}

const HOVER_PRESETS: Record<Exclude<HoverSoundType, false>, HoverConfigs> = {
    tick: {
        duration: 0.016,
        gain: 0.14,
        transientDecay: 0.0006,
        transientMultiplier: 0.075,
        modes: [
            { frequency: 2400, decay: 0.0015, gain: 0.6, phase: 0 },
            { frequency: 4200, decay: 0.0008, gain: 0.3, phase: 0.65 },
            { frequency: 6800, decay: 0.0004, gain: 0.1, phase: 1.3 }
        ]
    },
    button: {
        duration: 0.016,
        gain: 0.18,
        transientDecay: 0.00038,
        transientMultiplier: 0.035,
        modes: [
            { frequency: 980, decay: 0.0038, gain: 0.5, phase: 0 },
            { frequency: 1820, decay: 0.0024, gain: 0.3, phase: 0.65 },
            { frequency: 3160, decay: 0.00115, gain: 0.12, phase: 1.3 }
        ]
    }
}

const PRESS_PRESETS: Record<Exclude<PressSoundType, false>, PressConfigs> = {
    button: {
        duration: 0.015,
        gain: 0.7,
        attack: 0.0005,
        release: 0.002,
        pitchSweep: 1050,
        baseFreq: 150,
        sweepDirection: "down",
        sweepSpeed: 250,
        oscDecay: 0.003,
        noiseMix: 0
    },

    link: {
        duration: 0.012,
        gain: 0.75,
        attack: 0.0002,
        release: 0.003,
        pitchSweep: 800,
        baseFreq: 1200,
        sweepDirection: "down",
        sweepSpeed: 300,
        oscDecay: 0.004,
        noiseMix: 0
    },

    input: {
        duration: 0.3,
        gain: 0.5,
        attack: 0.002,
        release: 0.006,
        pitchSweep: 1200,
        baseFreq: 400,
        sweepDirection: "down",
        sweepSpeed: 60,
        oscDecay: 0.01,
        noiseMix: 0
    },

    "zoom-in": {
        duration: 0.2,
        gain: 0.2,
        attack: 0.1,
        release: 0.1,
        pitchSweep: 100,
        baseFreq: 130,
        sweepDirection: "up",
        sweepSpeed: 4,
        oscDecay: 10,
        noiseMix: 0
    },

    "zoom-out": {
        duration: 0.2,
        gain: 0.2,
        attack: 0.1,
        release: 0.1,
        pitchSweep: 100,
        baseFreq: 230,
        sweepDirection: "down",
        sweepSpeed: 4,
        oscDecay: 10,
        noiseMix: 0
    }
}

let ctx: AudioContext | null = null
let consumers = 0

const buffers = new Map<string, AudioBuffer>()
const gains = new Map<string, GainNode>()

function buildHoverBuffer(
    context: AudioContext,
    type: Exclude<HoverSoundType, false>
): AudioBuffer {
    const config = HOVER_PRESETS[type]
    const sampleRate = context.sampleRate
    const length = Math.ceil(config.duration * sampleRate)
    const buffer = context.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    let peak = 0
    let previousNoise = 0
    for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        const attack = Math.min(1, t / 0.00012)
        const fadeOut = Math.min(1, (config.duration - t) / 0.001)

        let resonance = 0
        for (const mode of config.modes) {
            resonance +=
                Math.sin(2 * Math.PI * mode.frequency * t + mode.phase) *
                Math.exp(-t / mode.decay) *
                mode.gain
        }

        const noise = Math.random() * 2 - 1
        const transient =
            (noise - previousNoise) *
            Math.exp(-t / config.transientDecay) *
            config.transientMultiplier
        previousNoise = noise

        data[i] = (resonance + transient) * attack * fadeOut
        peak = Math.max(peak, Math.abs(data[i]))
    }

    if (peak > 0) {
        const norm = 0.9 / peak
        for (let i = 0; i < length; i++) data[i] *= norm
    }
    return buffer
}

function buildPressBuffer(
    context: AudioContext,
    type: Exclude<PressSoundType, false>
): AudioBuffer {
    const config = PRESS_PRESETS[type]
    const sampleRate = context.sampleRate
    const length = Math.ceil(config.duration * sampleRate)
    const buffer = context.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    let peak = 0
    let lastNoise = 0

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate

        const attackEnv = Math.min(1, t / config.attack)
        const fadeOutEnv = Math.min(1, (config.duration - t) / config.release)

        let freq = config.baseFreq
        if (config.pitchSweep > 0) {
            if (config.sweepDirection === "down") {
                freq =
                    config.baseFreq +
                    config.pitchSweep * Math.exp(-t * config.sweepSpeed)
            } else {
                freq =
                    config.baseFreq +
                    config.pitchSweep * (1 - Math.exp(-t * config.sweepSpeed))
            }
        }

        let osc =
            Math.sin(2 * Math.PI * freq * t) * Math.exp(-t / config.oscDecay)

        if (config.noiseMix > 0) {
            const whiteNoise = Math.random() * 2 - 1
            lastNoise = (lastNoise + whiteNoise) / 2
            osc = osc * (1 - config.noiseMix) + lastNoise * config.noiseMix
        }

        data[i] = osc * attackEnv * fadeOutEnv
        peak = Math.max(peak, Math.abs(data[i]))
    }

    if (peak > 0) {
        const norm = 0.8 / peak
        for (let i = 0; i < length; i++) data[i] *= norm
    }
    return buffer
}

function ensureContext() {
    if (ctx) return
    const Ctor = getAudioContextCtor()
    if (!Ctor) return
    ctx = new Ctor()
}

function getBufferAndGain(
    type: string,
    isHover: boolean
): { buffer: AudioBuffer; gain: GainNode } | null {
    if (!ctx) return null

    const cacheKey = `${isHover ? "hover" : "press"}-${type}`

    if (!buffers.has(cacheKey)) {
        const buffer = isHover
            ? buildHoverBuffer(ctx, type as Exclude<HoverSoundType, false>)
            : buildPressBuffer(ctx, type as Exclude<PressSoundType, false>)
        buffers.set(cacheKey, buffer)

        const gainNode = ctx.createGain()

        gainNode.gain.value = isHover
            ? HOVER_PRESETS[type as Exclude<HoverSoundType, false>].gain
            : PRESS_PRESETS[type as Exclude<PressSoundType, false>].gain

        gainNode.connect(ctx.destination)
        gains.set(cacheKey, gainNode)
    }

    const buffer = buffers.get(cacheKey)
    const gain = gains.get(cacheKey)

    if (!buffer || !gain) {
        throw new Error(`Cannot find sound in cache for: ${cacheKey}`)
    }

    return { buffer, gain }
}

function prepareContext() {
    ensureContext()
    if (ctx?.state === "suspended") {
        void ctx.resume().catch(() => undefined)
    }
}

interface SoundEngine {
    prepare: () => void
    playHover: (type: HoverSoundType) => void
    playPress: (type: PressSoundType) => void
    dispose: () => void
    getContext: () => AudioContext | null
}

function createSoundEngine(): SoundEngine {
    consumers++
    let disposed = false

    const playSound = (type: string, isHover: boolean) => {
        if (disposed) return
        prepareContext()
        const node = getBufferAndGain(type, isHover)
        if (!ctx || !node) return

        const source = ctx.createBufferSource()
        source.buffer = node.buffer
        source.connect(node.gain)

        source.onended = () => {
            source.disconnect()
        }
        source.start()
    }

    return {
        prepare() {
            if (disposed) return
            prepareContext()
        },
        playHover(type: HoverSoundType) {
            if (type === false) return
            playSound(type, true)
        },
        playPress(type: PressSoundType) {
            if (type === false) return
            playSound(type, false)
        },
        dispose() {
            if (disposed) return
            disposed = true

            consumers = Math.max(0, consumers - 1)

            if (consumers === 0 && ctx) {
                void ctx.close()
                ctx = null
                buffers.clear()
                gains.clear()
            }
        },
        getContext() {
            if (disposed) return null
            ensureContext()
            return ctx
        }
    }
}

function playHoverSound(type: HoverSoundType = "tick") {
    if (type === false || !useAudioStore.getState().isAudioEnabled) return
    const engine = createSoundEngine()
    engine.playHover(type)
    setTimeout(() => {
        engine.dispose()
    }, 500)
}

function playPressSound(type: PressSoundType = "button") {
    if (type === false || !useAudioStore.getState().isAudioEnabled) return
    const engine = createSoundEngine()
    engine.playPress(type)
    setTimeout(() => {
        engine.dispose()
    }, 500)
}

export type { HoverSoundType, PressSoundType }
export { createSoundEngine, HOVER_SOUNDS, playHoverSound, playPressSound }

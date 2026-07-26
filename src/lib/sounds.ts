const TICK_DURATION = 0.008
const TICK_GAIN = 0.045

const PRESS_DURATION = 0.015
const PRESS_GAIN = 0.175

const MODES = [
    { frequency: 2400, decay: 0.0015, gain: 0.6, phase: 0 },
    { frequency: 4200, decay: 0.0008, gain: 0.3, phase: 0.65 },
    { frequency: 6800, decay: 0.0004, gain: 0.1, phase: 1.3 }
] as const

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

let ctx: AudioContext | null = null
let tickGain: GainNode | null = null
let pressGain: GainNode | null = null
let consumers = 0

let clickBuffer: AudioBuffer | null = null
let pressBuffer: AudioBuffer | null = null

function buildClickBuffer(context: AudioContext): AudioBuffer {
    const sampleRate = context.sampleRate
    const length = Math.ceil(TICK_DURATION * sampleRate)
    const buffer = context.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    let peak = 0
    let previousNoise = 0
    for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        const attack = Math.min(1, t / 0.0001)
        const fadeOut = Math.min(1, (TICK_DURATION - t) / 0.001)
        let resonance = 0
        for (const mode of MODES) {
            resonance +=
                Math.sin(2 * Math.PI * mode.frequency * t + mode.phase) *
                Math.exp(-t / mode.decay) *
                mode.gain
        }

        const noise = Math.random() * 2 - 1
        const transient =
            (noise - previousNoise) * Math.exp(-t / 0.0006) * 0.075
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

function buildPressBuffer(context: AudioContext): AudioBuffer {
    const sampleRate = context.sampleRate
    const length = Math.ceil(0.015 * sampleRate)
    const buffer = context.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    let peak = 0
    for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        const attack = Math.min(1, t / 0.0005)
        const fadeOut = Math.min(1, (0.015 - t) / 0.002)

        const freq = 1200 * Math.exp(-t * 250) + 150
        const osc = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t / 0.003)

        data[i] = osc * attack * fadeOut
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

    tickGain = ctx.createGain()
    tickGain.gain.value = TICK_GAIN
    tickGain.connect(ctx.destination)

    pressGain = ctx.createGain()
    pressGain.gain.value = PRESS_GAIN
    pressGain.connect(ctx.destination)

    clickBuffer = buildClickBuffer(ctx)
    pressBuffer = buildPressBuffer(ctx)
}

function prepareContext() {
    ensureContext()
    if (ctx?.state === "suspended") {
        void ctx.resume().catch(() => undefined)
    }
}

interface TickPlayer {
    prepare: () => void
    play: () => void
    dispose: () => void
    getContext: () => AudioContext | null
}

function createTickPlayer(): TickPlayer {
    consumers++
    let disposed = false
    let activeSource: AudioBufferSourceNode | null = null

    return {
        prepare() {
            if (disposed) return
            prepareContext()
        },
        play() {
            if (disposed) return
            prepareContext()
            if (!ctx || !tickGain || !clickBuffer) return
            activeSource?.stop()
            const source = ctx.createBufferSource()
            source.buffer = clickBuffer
            source.connect(tickGain)
            source.onended = () => {
                source.disconnect()
                if (activeSource === source) activeSource = null
            }
            activeSource = source
            source.start()
        },
        dispose() {
            if (disposed) return
            disposed = true
            activeSource?.stop()
            activeSource = null
            consumers = Math.max(0, consumers - 1)
            if (consumers === 0 && ctx) {
                void ctx.close()
                ctx = null
                tickGain = null
                clickBuffer = null
            }
        },
        getContext() {
            if (disposed) return null
            ensureContext()
            return ctx
        }
    }
}

function playPressSound() {
    if (!ctx || !pressGain || !pressBuffer) return
    prepareContext()
    const source = ctx.createBufferSource()
    source.buffer = pressBuffer
    source.connect(pressGain)
    source.start()
}

export { createTickPlayer, playPressSound }

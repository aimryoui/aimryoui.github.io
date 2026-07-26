import { create } from "zustand"

interface AudioState {
    isAudioEnabled: boolean
    toggleAudio: () => void
}

const useAudioStore = create<AudioState>((set) => ({
    isAudioEnabled: false,
    toggleAudio: () => {
        set((state) => ({ isAudioEnabled: !state.isAudioEnabled }))
    }
}))

export type { AudioState }
export { useAudioStore }

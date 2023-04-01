// doing it this way for now to get around use of hook
import { create } from 'zustand';


export interface MainState {
    darkMode: boolean;
    updateDarkMode: () => void;
}

export const useMainStore = create<MainState>()((set, get) => ({
    darkMode: false,
    updateDarkMode: () => set((state) => ({ darkMode: !state.darkMode }))
}))

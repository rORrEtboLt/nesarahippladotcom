import { create } from 'zustand';

// Hotspot ids correspond to objects in the 3D scene.
export const HOTSPOTS = ['about', 'blog', 'projects', 'support', 'contact'];

export const useSceneStore = create((set) => ({
  active: null,
  hovered: null,
  night: false,
  muted: true,
  ready: false,

  setActive: (id) => set({ active: id }),
  clearActive: () => set({ active: null }),
  setHovered: (id) => set({ hovered: id }),
  toggleNight: () => set((s) => ({ night: !s.night })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setReady: (ready) => set({ ready }),
}));

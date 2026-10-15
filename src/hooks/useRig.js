import { useStore } from '../state/store'

export const RIG = ['flint', 'cinder', 'ember']

/** Amp + cab selection. When linked, the cab follows the amp. */
export function useRig() {
  const { state, api } = useStore()
  return {
    amp: state.amp,
    cab: state.linked ? state.amp : state.cab,
    linked: state.linked,
    pickAmp: (amp) => api.patch((s) => ({ amp, cab: s.linked ? amp : s.cab })),
    pickCab: (cab) => api.patch({ cab, linked: false }),
    toggleLink: () => api.patch((s) => ({ linked: !s.linked, cab: s.amp })),
  }
}

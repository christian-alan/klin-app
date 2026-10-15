import { createContext, useContext, useMemo, useReducer } from 'react'

export const FACTORY_PRESETS = ['Warm Clean', 'Glass Chime', 'Edge of Breakup', 'Kiln Lead', 'Ambient Swell', 'Tape Slapback']

const FLAT_EQ = Array(9).fill(0)
const REVERB_FADERS = [30, 25, 15, 55, 35]

const initialState = {
  view: 'amp', // pedals | amp | cab | eq | fx
  modal: null, // tuner | metronome | settings | null

  // Every continuous control (knobs) lives here, keyed by a stable id.
  kv: {},
  toggles: { GATE: true, DOUBLER: false },
  dirty: false,
  stereo: false,

  preset: { index: 0, user: ['My Rhythm'], pop: null, draft: '' },

  pedalsOn: { SQUEEZE: true, GLOW: false, SCORCH: false, DRIFT: false },
  driftMode: 2,

  amp: 'ember',
  cab: 'ember',
  linked: true,

  mics: [
    { on: true, model: 0, open: false },
    { on: true, model: 5, open: false },
  ],

  eqOn: true,
  gains: FLAT_EQ,

  echoOn: true,
  verbOn: true,
  headMode: 0,
  sync: 1,
  verbMode: 1,
  reverbFaders: REVERB_FADERS,

  metronome: { bpm: 120, playing: false, beat: 0, sig: '4/4', sound: 0, rhythm: 0, accents: null, sigOpen: false },
  tuner: { muted: true, unit: 'cents', footer: true, ref: 440 },
  settings: { rate: 1, buffer: 2, channels: { 'in:Input 1': true, 'out:Output 1': true, 'out:Output 2': true } },
}

function reducer(state, action) {
  switch (action.type) {
    case 'patch': {
      const patch = typeof action.patch === 'function' ? action.patch(state) : action.patch
      return { ...state, ...patch }
    }
    case 'edit': {
      // Like patch, but marks the preset as edited.
      const patch = typeof action.patch === 'function' ? action.patch(state) : action.patch
      return { ...state, ...patch, dirty: true }
    }
    case 'kv':
      return { ...state, kv: { ...state.kv, [action.id]: action.value }, dirty: true }
    case 'loadPreset':
      return {
        ...state,
        kv: {},
        gains: FLAT_EQ,
        reverbFaders: REVERB_FADERS,
        dirty: false,
        preset: { ...state.preset, index: action.index, pop: null },
      }
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const api = useMemo(
    () => ({
      patch: (patch) => dispatch({ type: 'patch', patch }),
      edit: (patch) => dispatch({ type: 'edit', patch }),
      setKv: (id, value) => dispatch({ type: 'kv', id, value }),
      loadPreset: (index) => dispatch({ type: 'loadPreset', index }),
    }),
    [],
  )
  const value = useMemo(() => ({ state, api }), [state, api])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

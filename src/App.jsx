import { ControlStrip } from './components/shell/ControlStrip'
import { Footer } from './components/shell/Footer'
import { ModuleNav } from './components/shell/ModuleNav'
import { RigSelector } from './components/shell/RigSelector'
import { useMetronomeClock, useTunerSignal } from './hooks/useEngines'
import { useFitScale } from './hooks/useFitScale'
import { MetronomeModal } from './modals/MetronomeModal'
import { SettingsModal } from './modals/SettingsModal'
import { TunerModal } from './modals/TunerModal'
import { StoreProvider, useStore } from './state/store'
import { AmpView } from './views/AmpView'
import { CabView } from './views/CabView'
import { EqView } from './views/EqView'
import { FxView } from './views/FxView'
import { PedalsView } from './views/PedalsView'

const WIDTH = 1080
const HEIGHT = 820

const VIEWS = { pedals: PedalsView, amp: AmpView, cab: CabView, eq: EqView, fx: FxView }
const MODALS = { tuner: TunerModal, metronome: MetronomeModal, settings: SettingsModal }

/** Floor colour under the hardware changes with the amp, like a stage. */
const FLOOR = {
  pedals: 'linear-gradient(180deg, transparent 78%, #C6CAE4 78%)',
  amp: { flint: '#DCC3CB', cinder: '#8F5A44', ember: '#C9CDE6' },
}

function Plugin() {
  const { state } = useStore()
  useMetronomeClock()
  useTunerSignal()

  const View = VIEWS[state.view]
  const ActiveModal = state.modal ? MODALS[state.modal] : null
  const floor = state.view === 'amp' ? FLOOR.amp[state.amp] : null

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-shell text-ink">
      <ModuleNav />
      <ControlStrip />
      <main className="relative min-h-0 flex-1" style={{ background: state.view === 'pedals' ? FLOOR.pedals : undefined }}>
        {floor && <div className="absolute inset-x-0 bottom-0 h-[76px]" style={{ background: `linear-gradient(180deg, ${floor}, ${floor})` }} />}
        <View />
        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <RigSelector dark={state.view === 'amp' && state.amp === 'cinder'} />
        </div>
      </main>
      <Footer />
      {ActiveModal && <ActiveModal />}
    </div>
  )
}

export default function App() {
  const scale = useFitScale(WIDTH, HEIGHT)
  return (
    <StoreProvider>
      <div className="grid h-full w-full place-items-center overflow-hidden">
        <div style={{ width: WIDTH * scale, height: HEIGHT * scale }}>
          <div
            className="overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(30,32,70,0.6)]"
            style={{ width: WIDTH, height: HEIGHT, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            <Plugin />
          </div>
        </div>
      </div>
    </StoreProvider>
  )
}

import { useStore } from '../../state/store'
import { Icons } from '../icons'

const MODULES = [
  { id: 'pedals', label: 'Pedals', icon: Icons.pedals },
  { id: 'amp', label: 'Amp', icon: Icons.amp },
  { id: 'cab', label: 'Cabinet', icon: Icons.cab },
  { id: 'eq', label: 'EQ', icon: Icons.eq },
  { id: 'fx', label: 'Time effects', icon: Icons.fx },
]

export function ModuleNav() {
  const { state, api } = useStore()
  return (
    <nav aria-label="Modules" className="flex justify-center gap-7 pt-3 pb-0.5">
      {MODULES.map(({ id, label, icon: Icon }) => {
        const current = state.view === id
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-current={current ? 'page' : undefined}
            onClick={() => api.patch({ view: id })}
            className={`flex h-12 w-[52px] cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent transition-colors ${
              current ? 'text-ink' : 'text-muted hover:text-subtle'
            }`}
          >
            <Icon />
            <span className={`size-1 rounded-full ${current ? 'bg-ink' : ''}`} />
          </button>
        )
      })}
    </nav>
  )
}

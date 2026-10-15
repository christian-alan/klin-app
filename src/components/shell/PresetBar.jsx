import { FACTORY_PRESETS, useStore } from '../../state/store'
import { Icons } from '../icons'

const popover = 'absolute z-30 rounded-xl bg-white shadow-[0_18px_40px_-10px_rgba(30,32,70,0.45)]'

export function PresetBar() {
  const { state, api } = useStore()
  const { preset, dirty } = state
  const all = [...FACTORY_PRESETS.map((n) => ({ n, factory: true })), ...preset.user.map((n) => ({ n, factory: false }))]
  const index = Math.min(preset.index, all.length - 1)
  const current = all[index]
  const pop = preset.pop

  const setPreset = (p) => api.patch((s) => ({ preset: { ...s.preset, ...p } }))
  const go = (i) => api.loadPreset((i + all.length) % all.length)
  const toggle = (name) => setPreset({ pop: pop === name ? null : name, draft: name === 'save' ? `${current.n} copy` : preset.draft })
  const addUser = (name) =>
    api.patch((s) => {
      const user = [...s.preset.user, name]
      return { dirty: false, preset: { ...s.preset, user, index: FACTORY_PRESETS.length + user.length - 1, pop: null } }
    })
  const save = () => preset.draft.trim() && addUser(preset.draft.trim())

  const menu = [
    { label: 'Save', run: () => api.patch((s) => ({ dirty: false, preset: { ...s.preset, pop: null } })) },
    { label: 'Revert changes', disabled: !dirty, run: () => api.loadPreset(index) },
    { label: 'Duplicate', run: () => addUser(`${current.n} copy`) },
    {
      label: 'Delete',
      disabled: current.factory,
      danger: true,
      run: () =>
        api.patch((s) => {
          const user = s.preset.user.filter((_, j) => FACTORY_PRESETS.length + j !== index)
          return { kv: {}, dirty: false, preset: { ...s.preset, user, index: 0, pop: null } }
        }),
    },
    { label: 'Export…', run: () => setPreset({ pop: null }) },
  ]

  return (
    <div className="relative z-30 mx-1 flex flex-1 flex-col gap-2.5 border-x border-hairline px-3.5">
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Previous preset" onClick={() => go(index - 1)} className="grid h-[26px] w-[30px] cursor-pointer place-items-center border-0 bg-transparent">
          <Icons.arrowLeft />
        </button>
        <button type="button" aria-label="Next preset" onClick={() => go(index + 1)} className="grid h-[26px] w-[30px] cursor-pointer place-items-center border-0 bg-transparent">
          <Icons.arrowRight />
        </button>
        <span className="flex-1" />
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={pop === 'save'}
          onClick={() => toggle('save')}
          className="cursor-pointer border-0 bg-transparent px-2 py-1.5 text-[11px] font-semibold tracking-[0.08em]"
        >
          SAVE AS…
        </button>
        <button
          type="button"
          aria-label="More preset actions"
          aria-haspopup="menu"
          aria-expanded={pop === 'menu'}
          onClick={() => toggle('menu')}
          className="grid size-[26px] cursor-pointer place-items-center border-0 bg-transparent"
        >
          <Icons.dots />
        </button>
      </div>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={pop === 'list'}
        onClick={() => toggle('list')}
        className="flex h-11 cursor-pointer items-center justify-between rounded-[10px] border-0 bg-panel px-3.5 text-sm shadow-[0_1px_0_rgba(40,44,80,0.08)]"
      >
        <span className="flex items-baseline gap-2">
          {dirty && <span className="font-semibold text-accent">•</span>}
          <span className="font-medium">{current.n}</span>
          <span className="font-mono text-[11px] text-[#5B6080]">{dirty ? 'edited' : current.factory ? 'Factory' : 'User'}</span>
        </span>
        <Icons.chevron style={{ transform: pop === 'list' ? 'rotate(180deg)' : undefined }} />
      </button>

      {pop === 'list' && (
        <div role="listbox" aria-label="Presets" className={`${popover} left-3.5 right-3.5 top-[84px] max-h-80 overflow-y-auto p-1.5`}>
          {[
            { title: 'FACTORY', items: all.slice(0, FACTORY_PRESETS.length).map((p, i) => ({ ...p, i })) },
            { title: 'USER', items: all.slice(FACTORY_PRESETS.length).map((p, j) => ({ ...p, i: FACTORY_PRESETS.length + j })) },
          ].map((group) => (
            <div key={group.title}>
              <div className="px-2.5 pt-2 pb-1 text-[10px] font-semibold tracking-[0.1em] text-muted">{group.title}</div>
              {group.items.map((p) => (
                <button
                  key={p.i}
                  type="button"
                  role="option"
                  aria-selected={p.i === index}
                  onClick={() => go(p.i)}
                  className={`flex h-[34px] w-full cursor-pointer items-center justify-between rounded-[7px] border-0 px-2.5 text-left text-[13px] ${
                    p.i === index ? 'bg-[#ECEEF8]' : 'bg-transparent hover:bg-[#F4F5FB]'
                  }`}
                >
                  <span>{p.n}</span>
                  {p.i === index && <Icons.check className="text-accent" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {pop === 'save' && (
        <div role="dialog" aria-label="Save preset as" className={`${popover} right-3.5 top-[34px] flex w-[260px] flex-col gap-3 p-3.5`}>
          <label className="flex flex-col gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#5B6080]">
            PRESET NAME
            <input
              autoFocus
              value={preset.draft}
              onChange={(e) => setPreset({ draft: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') setPreset({ pop: null })
              }}
              className="h-9 rounded-lg border border-[#C2C6E2] bg-panel px-2.5 text-sm font-normal tracking-normal text-ink"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setPreset({ pop: null })} className="h-8 cursor-pointer rounded-lg border-0 bg-transparent px-3 text-[13px]">
              Cancel
            </button>
            <button type="button" onClick={save} className="h-8 cursor-pointer rounded-lg border-0 bg-ink px-3.5 text-[13px] font-medium text-panel">
              Save
            </button>
          </div>
        </div>
      )}

      {pop === 'menu' && (
        <div role="menu" aria-label="Preset actions" className={`${popover} right-1.5 top-[34px] w-[190px] p-1.5`}>
          {menu.map((m) => (
            <button
              key={m.label}
              type="button"
              role="menuitem"
              aria-disabled={m.disabled}
              onClick={() => !m.disabled && m.run()}
              className={`flex h-[34px] w-full items-center rounded-[7px] border-0 bg-transparent px-2.5 text-left text-[13px] ${
                m.disabled ? 'cursor-default text-[#A9AED3]' : m.danger ? 'cursor-pointer text-[#B3402A] hover:bg-[#F4F5FB]' : 'cursor-pointer hover:bg-[#F4F5FB]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

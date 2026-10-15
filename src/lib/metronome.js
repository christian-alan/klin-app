/** Beat list for a time signature, accenting the first beat of each group: "7/8 (2+2+3)" → 7 beats. */
export function parseSignature(label) {
  const m = label.match(/^(\d+)\/(\d+)(?: \(([\d+]+)\))?$/)
  const n = parseInt(m[1], 10)
  const d = parseInt(m[2], 10)
  let starts = [0]
  if (m[3]) {
    let acc = 0
    starts = m[3].split('+').map((g) => {
      const s = acc
      acc += parseInt(g, 10)
      return s
    })
  } else if (d === 8 && n % 3 === 0 && n > 3) {
    starts = Array.from({ length: n / 3 }, (_, i) => i * 3)
  }
  return Array.from({ length: n }, (_, i) => (starts.includes(i) ? 'accent' : 'normal'))
}

export type Row = Record<string, unknown>
export function rows(value: unknown): Row[] {
  if (Array.isArray(value)) return value.filter((item): item is Row => !!item && typeof item === 'object')
  if (value && typeof value === 'object') { const object = value as Row; for (const key of ['items','courses','assignments','announcements','grades','sessions','modules','materials','submissions']) if (Array.isArray(object[key])) return rows(object[key]) }
  return []
}
export function field(value: unknown, ...keys: string[]): unknown { if (!value || typeof value !== 'object') return undefined; const object = value as Row; for (const key of keys) if (object[key] !== undefined && object[key] !== null) return object[key] }
export const text = (value: unknown, fallback = '') => typeof value === 'string' || typeof value === 'number' ? String(value) : fallback
export function date(value: unknown, options: Intl.DateTimeFormatOptions = {month:'short',day:'numeric',year:'numeric'}): string { const source = text(value); if (!source) return '—'; const parsed = new Date(source); return Number.isNaN(parsed.getTime()) ? source : new Intl.DateTimeFormat(undefined, options).format(parsed) }
export function time(value: unknown): string { const source = text(value); if (!source) return ''; const [hourSource,minuteSource='0']=source.split(':'); const hour=Number(hourSource),minute=Number(minuteSource); if (!Number.isFinite(hour)||!Number.isFinite(minute)) return source.slice(0,5); return String(hour%12||12)+':'+String(minute).padStart(2,'0')+(hour>=12?' PM':' AM') }


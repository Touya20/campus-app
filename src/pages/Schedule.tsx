import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Download, Users } from 'lucide-react';
import { api } from '../components/features/api';
import { useResource } from '../common/useResource';
import { Page } from '../common/Page';
import { ResourceState } from '../common/ResourceState';
import { Card, EmptyState } from '../ui/Ui';
import { field, rows, text, time, type Row } from '../lib/api';

const weekdays = [
  { dayIndex: 1, short: 'MON', name: 'Monday' },
  { dayIndex: 2, short: 'TUE', name: 'Tuesday' },
  { dayIndex: 3, short: 'WED', name: 'Wednesday' },
  { dayIndex: 4, short: 'THU', name: 'Thursday' },
  { dayIndex: 5, short: 'FRI', name: 'Friday' },
];

const eventColors = [
  'border-blue-200 bg-blue-50 text-slate-800',
  'border-indigo-200 bg-indigo-50 text-slate-800',
  'border-emerald-200 bg-emerald-50 text-slate-800',
  'border-amber-200 bg-amber-50 text-slate-800',
  'border-rose-200 bg-rose-50 text-slate-800',
  'border-cyan-200 bg-cyan-50 text-slate-800',
];

function minutesOf(value: unknown) {
  const [hour, minute = '0'] = text(value).split(':');
  const result = Number(hour) * 60 + Number(minute);
  return Number.isFinite(result) ? result : 0;
}

function timeLabel(hour: number) {
  return `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function addDays(source: Date, count: number) {
  const result = new Date(source);
  result.setDate(result.getDate() + count);
  return result;
}

function dateLabel(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function formatRange(start: Date, end: Date) {
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' });
  const monthYear = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${day.format(start)}–${day.format(end)} ${monthYear.format(end)}`;
  }
  return `${dateLabel(start, { day: '2-digit', month: 'short' })}–${dateLabel(end, { day: '2-digit', month: 'short', year: 'numeric' })}`;
}

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function localCalendarDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

export default function Schedule() {
  const state = useResource(() => api.schedule(), []);
  const sessions: Row[] = rows(state.data);
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<'week' | 'list'>('week');
  const [courseFilter, setCourseFilter] = useState('all');
  const today = new Date();
  const todayIndex = today.getDay();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const [selectedDay, setSelectedDay] = useState(todayIndex >= 1 && todayIndex <= 5 ? todayIndex : 1);

  const weekStart = useMemo(() => {
    const start = new Date(todayYear, todayMonth, todayDate);
    start.setDate(todayDate - ((todayIndex + 6) % 7) + weekOffset * 7);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [todayDate, todayIndex, todayMonth, todayYear, weekOffset]);
  const weekEnd = addDays(weekStart, 4);
  const weekLabel = formatRange(weekStart, weekEnd);

  const courses = useMemo(() => {
    const unique = new Map<string, string>();
    sessions.forEach((session) => {
      const id = text(field(session, 'courseId', 'course_id', 'courseCode', 'course_code', 'courseName', 'course_name'));
      const name = text(field(session, 'courseCode', 'course_code'), text(field(session, 'courseName', 'course_name'), 'Course'));
      if (id) unique.set(id, name);
    });
    return [...unique.entries()].map(([id, label]) => ({ id, label }));
  }, [sessions]);

  const filteredSessions = useMemo(() => sessions.filter((session) => {
    if (courseFilter === 'all') return true;
    return text(field(session, 'courseId', 'course_id', 'courseCode', 'course_code', 'courseName', 'course_name')) === courseFilter;
  }), [sessions, courseFilter]);

  const daySessions = useMemo(() => weekdays.map((day) => ({
    ...day,
    date: addDays(weekStart, day.dayIndex - 1),
    sessions: filteredSessions
      .filter((session) => Number(field(session, 'dayOfWeek', 'day_of_week')) === day.dayIndex)
      .sort((a, b) => minutesOf(field(a, 'startTime', 'start_time')) - minutesOf(field(b, 'startTime', 'start_time'))),
  })), [filteredSessions, weekStart]);

  const classTimes = filteredSessions.flatMap((session) => [
    minutesOf(field(session, 'startTime', 'start_time')),
    minutesOf(field(session, 'endTime', 'end_time')),
  ]).filter((minute) => minute > 0);
  const firstHour = Math.max(6, Math.min(9, classTimes.length ? Math.floor(Math.min(...classTimes) / 60) : 9));
  const lastHour = Math.min(22, Math.max(15, classTimes.length ? Math.ceil(Math.max(...classTimes) / 60) + 1 : 15));
  const hourCount = Math.max(1, lastHour - firstHour);
  const hourHeight = 48;
  const nextClass = useMemo(() => {
    const now = new Date();
    return filteredSessions.map((session) => {
      const weekday = Number(field(session, 'dayOfWeek', 'day_of_week'));
      const start = minutesOf(field(session, 'startTime', 'start_time'));
      const daysUntil = (weekday - now.getDay() + 7) % 7;
      const beginsAt = addDays(now, daysUntil);
      beginsAt.setHours(Math.floor(start / 60), start % 60, 0, 0);
      if (beginsAt <= now) beginsAt.setDate(beginsAt.getDate() + 7);
      return { session, beginsAt };
    }).sort((a, b) => a.beginsAt.getTime() - b.beginsAt.getTime())[0] ?? null;
  }, [filteredSessions]);
  const contactHours = filteredSessions.reduce((total, session) => {
    const duration = minutesOf(field(session, 'endTime', 'end_time')) - minutesOf(field(session, 'startTime', 'start_time'));
    return total + Math.max(0, duration) / 60;
  }, 0);
  const scheduledDays = new Set(filteredSessions.map((session) => Number(field(session, 'dayOfWeek', 'day_of_week')))).size;
  function downloadWeek() {
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Campus Student Portal//Class Schedule//EN',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ];
    filteredSessions.forEach((session, index) => {
      const weekday = Number(field(session, 'dayOfWeek', 'day_of_week'));
      const classDate = addDays(weekStart, weekday - 1);
      const start = minutesOf(field(session, 'startTime', 'start_time'));
      const end = minutesOf(field(session, 'endTime', 'end_time'));
      const startDate = new Date(classDate);
      const endDate = new Date(classDate);
      startDate.setHours(Math.floor(start / 60), start % 60, 0, 0);
      endDate.setHours(Math.floor(end / 60), end % 60, 0, 0);
      const title = text(field(session, 'courseName', 'course_name', 'courseCode', 'course_code'), 'Class session');
      const description = [text(field(session, 'courseCode', 'course_code')), text(field(session, 'instructorName', 'instructor_name'))].filter(Boolean).join(' · ');
      const location = text(field(session, 'room', 'location'));
      lines.push('BEGIN:VEVENT', `UID:campus-${weekOffset}-${index}-${startDate.getTime()}@campus.local`, `DTSTAMP:${localCalendarDate(new Date())}`, `DTSTART:${localCalendarDate(startDate)}`, `DTEND:${localCalendarDate(endDate)}`, `SUMMARY:${escapeCalendarText(title)}`);
      if (description) lines.push(`DESCRIPTION:${escapeCalendarText(description)}`);
      if (location) lines.push(`LOCATION:${escapeCalendarText(location)}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'campus-class-schedule.ics';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function renderEvents(day: typeof daySessions[number]) {
    return day.sessions.map((session, sessionIndex) => {
      const start = minutesOf(field(session, 'startTime', 'start_time'));
      const end = minutesOf(field(session, 'endTime', 'end_time'));
      const top = Math.max(0, (start - firstHour * 60) * hourHeight / 60);
      const height = Math.max(42, (end - start) * hourHeight / 60);
      const colorKey = text(field(session, 'courseId', 'course_id', 'courseCode', 'course_code'), String(sessionIndex));
      const color = eventColors[[...colorKey].reduce((sum, char) => sum + char.charCodeAt(0), 0) % eventColors.length];
      const name = text(field(session, 'courseName', 'course_name'), 'Class session');
      const code = text(field(session, 'courseCode', 'course_code'));
      const room = text(field(session, 'room', 'location'));
      const instructor = text(field(session, 'instructorName', 'instructor_name'));
      return (
        <article key={text(field(session, 'id'), `${day.dayIndex}-${sessionIndex}`)} className={`absolute inset-x-1 z-10 overflow-hidden rounded-md border-l-[3px] p-1.5 shadow-sm sm:inset-x-1.5 sm:p-2 ${color}`} style={{ top: `${top}px`, height: `${height}px`, borderLeftColor: '#355d84' }} title={`${name} · ${time(field(session, 'startTime', 'start_time'))}–${time(field(session, 'endTime', 'end_time'))}`}>
          <p className="truncate text-[9px] font-extrabold leading-3 text-[#315b84] sm:text-[10px]">{code || name}</p>
          <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-3.5 sm:text-[11px]">{name}</p>
          <p className="mt-0.5 truncate text-[9px] leading-3 text-slate-500">{time(field(session, 'startTime', 'start_time'))}–{time(field(session, 'endTime', 'end_time'))}</p>
          {height > 72 && (room || instructor) && <p className="mt-0.5 truncate text-[9px] leading-3 text-slate-500">{[room, instructor].filter(Boolean).join(' · ')}</p>}
        </article>
      );
    });
  }

  function renderCalendar(visibleDays: typeof daySessions) {
    return (
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <div className="grid min-w-[760px] lg:min-w-[850px]" style={{ gridTemplateColumns: `48px repeat(${visibleDays.length}, minmax(0, 1fr))` }}>
          <div className="border-b border-slate-200 bg-slate-50 px-1 py-3" />
          {visibleDays.map((day) => (
            <button key={day.dayIndex} type="button" onClick={() => { setSelectedDay(day.dayIndex); setView('list'); }} aria-label={`Show ${day.name}, ${dateLabel(day.date, { month: 'long', day: 'numeric' })}`} className={`border-b border-l border-slate-200 px-2 py-2 text-center transition hover:bg-blue-50 ${day.dayIndex === todayIndex ? 'bg-blue-50/60' : 'bg-slate-50'} ${view === 'list' && selectedDay === day.dayIndex ? 'ring-2 ring-inset ring-[#315b84]' : ''}`}>
              <span className="block text-[9px] font-bold tracking-wide text-slate-500">{day.short}</span>
              <span className="mt-0.5 block text-xs font-bold text-slate-700">{dateLabel(day.date, { day: '2-digit', month: 'short' })}</span>
            </button>
          ))}
          <div className="relative bg-white" style={{ height: hourCount * hourHeight }}>
            {Array.from({ length: hourCount }, (_, index) => <span key={index} className="absolute right-1.5 -translate-y-1/2 text-[11px] font-medium leading-none text-slate-400" style={{ top: index * hourHeight, fontSize: '11px' }}>{timeLabel(firstHour + index)}</span>)}
          </div>
          {visibleDays.map((day) => (
            <div key={day.dayIndex} className={`relative border-l border-slate-200 ${day.dayIndex === todayIndex ? 'bg-blue-50/10' : 'bg-white'}`} style={{ height: hourCount * hourHeight }}>
              {Array.from({ length: hourCount + 1 }, (_, index) => <div key={index} className="pointer-events-none absolute inset-x-0 border-t border-slate-100" style={{ top: index * hourHeight }} />)}
              {renderEvents(day)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderAgenda(day: typeof daySessions[number]) {
    if (!day.sessions.length) return <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">No classes scheduled for {day.name}.</div>;
    return <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {day.sessions.map((session, index) => <article key={text(field(session, 'id'), `${day.dayIndex}-${index}`)} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <div className="w-28 shrink-0 text-xs font-semibold text-[#315b84]">{time(field(session, 'startTime', 'start_time'))} – {time(field(session, 'endTime', 'end_time'))}</div>
        <div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-800">{text(field(session, 'courseName', 'course_name'), 'Class session')}</p><p className="mt-0.5 text-xs text-slate-500">{[text(field(session, 'courseCode', 'course_code')), text(field(session, 'room', 'location')), text(field(session, 'instructorName', 'instructor_name'))].filter(Boolean).join(' · ') || 'Class details'}</p></div>
      </article>)}
    </div>;
  }

  return (
    <Page
      title="Class Schedule"
      eyebrow="HOME / CLASS SCHEDULE"
      description="Plan your week, one class at a time. All times shown in Philippine Standard Time."
      actions={<button type="button" onClick={downloadWeek} disabled={!filteredSessions.length} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><Download size={14} aria-hidden="true" />Download schedule</button>}
    >
      <ResourceState loading={state.loading} error={state.error} variant="calendar" />
      {!state.loading && !state.error && (sessions.length ? (
        <>
          <div className="mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex h-10 items-center overflow-hidden rounded-lg border border-[#cbd9e8] bg-white shadow-sm">
                <button type="button" aria-label="Previous week" onClick={() => setWeekOffset((offset) => offset - 1)} className="grid h-full w-10 place-items-center text-[#496886] transition hover:bg-[#eaf2fb] hover:text-[#173f68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#315b84]"><ChevronLeft size={17} /></button>
                <span className="flex h-full min-w-44 items-center justify-center gap-2 border-x border-[#dbe5f0] px-3 text-xs font-bold tracking-wide text-[#183b5c]"><CalendarDays size={14} className="text-[#28649a]" aria-hidden="true" />{weekLabel}</span>
                <button type="button" aria-label="Next week" onClick={() => setWeekOffset((offset) => offset + 1)} className="grid h-full w-10 place-items-center text-[#496886] transition hover:bg-[#eaf2fb] hover:text-[#173f68] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#315b84]"><ChevronRight size={17} /></button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex h-10 items-center rounded-lg border border-[#d2deeb] bg-white p-1" aria-label="Calendar view">
                <button type="button" aria-pressed={view === 'week'} onClick={() => setView('week')} className={`h-8 min-w-16 rounded-md px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315b84] ${view === 'week' ? 'bg-[#244f78] text-white shadow-sm' : 'text-[#4b647e] hover:bg-[#edf4fb] hover:text-[#173f68]'}`}>Week</button>
                <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')} className={`h-8 min-w-16 rounded-md px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315b84] ${view === 'list' ? 'bg-[#244f78] text-white shadow-sm' : 'text-[#4b647e] hover:bg-[#edf4fb] hover:text-[#173f68]'}`}>List</button>
              </div>
              <label className="sr-only" htmlFor="schedule-course-filter">Filter by course</label>
              <select id="schedule-course-filter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="h-10 min-w-36 max-w-56 rounded-lg border border-[#d2deeb] bg-white px-3 text-xs font-semibold text-[#294863] outline-none transition hover:border-[#a9bfd7] focus:border-[#315b84] focus:ring-2 focus:ring-blue-100">
                <option value="all">All courses</option>
                {courses.map((course) => <option key={course.id} value={course.id}>{course.label}</option>)}
              </select>
            </div>
          </div>

          {view === 'week' ? <>
            <div className="hidden md:block">{renderCalendar(daySessions)}</div>
          </> : (
            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1 overflow-x-auto">
                  {daySessions.map((day) => <button key={day.dayIndex} type="button" onClick={() => setSelectedDay(day.dayIndex)} aria-pressed={selectedDay === day.dayIndex} className={`shrink-0 rounded-md px-3 py-2 text-[10px] font-bold ${selectedDay === day.dayIndex ? 'bg-[#315b84] text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>{day.short} {dateLabel(day.date, { day: 'numeric' })}</button>)}
                </div>
                <button type="button" onClick={() => setSelectedDay(0)} className={`rounded-md px-3 py-2 text-[10px] font-semibold ${selectedDay === 0 ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-50'}`}>All week</button>
              </div>
              {selectedDay ? renderAgenda(daySessions.find((day) => day.dayIndex === selectedDay) ?? daySessions[0]) : (
                <div className="space-y-2">{daySessions.map((day) => <section key={day.dayIndex} className="rounded-lg border border-slate-200 bg-white">
                  <button type="button" onClick={() => setSelectedDay(day.dayIndex)} className="flex w-full items-center justify-between border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50"><span className="text-[11px] font-bold text-slate-700">{day.name}</span><span className="text-[10px] text-slate-400">{dateLabel(day.date, { day: 'numeric', month: 'short' })}</span></button>
                  {renderAgenda(day)}
                </section>)}</div>
              )}
            </div>
          )}
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <Card>
              <div className="flex items-center gap-2"><CalendarDays size={16} className="text-[#315b84]" aria-hidden="true" /><h2 className="text-sm font-bold text-slate-800">Your next class</h2></div>
              {nextClass ? <div className="mt-3"><p className="text-sm font-semibold text-slate-800">{text(field(nextClass.session, 'courseName', 'course_name'), 'Class session')}</p><p className="mt-1 text-xs text-slate-500">{dateLabel(nextClass.beginsAt, { weekday: 'long', month: 'short', day: 'numeric' })} · {time(field(nextClass.session, 'startTime', 'start_time'))}–{time(field(nextClass.session, 'endTime', 'end_time'))}</p><p className="mt-1 text-xs text-slate-500">{[text(field(nextClass.session, 'room', 'location')), text(field(nextClass.session, 'instructorName', 'instructor_name'))].filter(Boolean).join(' · ') || 'Details will appear when available'}</p></div> : <p className="mt-3 text-xs text-slate-500">No upcoming classes.</p>}
            </Card>
            <Card>
              <div className="flex items-center gap-2"><Users size={16} className="text-[#315b84]" aria-hidden="true" /><h2 className="text-sm font-bold text-slate-800">This week at a glance</h2></div>
              <div className="mt-3 grid grid-cols-3 gap-3"><div><p className="text-lg font-bold text-slate-800">{filteredSessions.length}</p><p className="text-[10px] text-slate-500">class sessions</p></div><div><p className="text-lg font-bold text-slate-800">{contactHours.toFixed(contactHours % 1 ? 1 : 0)}</p><p className="text-[10px] text-slate-500">contact hours</p></div><div><p className="text-lg font-bold text-slate-800">{scheduledDays}</p><p className="text-[10px] text-slate-500">class days</p></div></div>
              <p className="mt-3 border-t border-slate-100 pt-2 text-[10px] text-slate-500">Select a date above to view that day’s classes.</p>
            </Card>
          </div>
        </>
      ) : (
        <Card><EmptyState title="No scheduled classes" detail="Your weekly schedule will appear here when class sessions are published." /></Card>
      ))}
    </Page>
  );
}

import { request } from '../../lib/axios.js';

const idPath = (id: string) => encodeURIComponent(id);

export const api = {
  register: (input: unknown) => request<unknown>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (email: string, password: string) => request<unknown>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request<unknown>('/auth/me'),
  logout: () => request<unknown>('/auth/logout', { method: 'POST' }),

  dashboard: () => request<unknown>('/dashboard'),
  upcoming: () => request<unknown>('/dashboard/upcoming'),
  recentAnnouncements: () => request<unknown>('/dashboard/recent-announcements'),

  courses: (params = '') => request<unknown>('/courses' + params),
  course: (id: string) => request<unknown>('/courses/' + idPath(id)),
  modules: (id: string) => request<unknown>('/courses/' + idPath(id) + '/modules'),
  materials: (id: string) => request<unknown>('/courses/' + idPath(id) + '/materials'),

  assignments: (params = '') => request<unknown>('/assignments' + params),
  upcomingAssignments: () => request<unknown>('/assignments/upcoming'),
  assignment: (id: string) => request<unknown>('/assignments/' + idPath(id)),
  draft: (id: string) => request<unknown>('/assignments/' + idPath(id) + '/drafts'),
  saveDraft: (id: string, content: string) => request<unknown>('/assignments/' + idPath(id) + '/drafts', { method: 'POST', body: JSON.stringify({ content }) }),
  updateDraft: (id: string, content: string) => request<unknown>('/drafts/' + idPath(id), { method: 'PATCH', body: JSON.stringify({ content }) }),
  deleteDraft: (id: string) => request<unknown>('/drafts/' + idPath(id), { method: 'DELETE' }),
  submit: (id: string, content: string) => request<unknown>('/assignments/' + idPath(id) + '/submissions', { method: 'POST', body: JSON.stringify({ content }) }),
  mySubmission: (id: string) => request<unknown>('/assignments/' + idPath(id) + '/submissions/me'),

  schedule: (weekOf?: string) => request<unknown>('/schedule/week' + (weekOf ? '?weekOf=' + encodeURIComponent(weekOf) : '')),
  grades: () => request<unknown>('/grades'),
  courseGrades: (id: string) => request<unknown>('/grades/' + idPath(id)),
  gradeSummary: () => request<unknown>('/grades/summary'),

  announcements: (params = '') => request<unknown>('/announcements' + params),
  announcement: (id: string) => request<unknown>('/announcements/' + idPath(id)),
  markRead: (id: string) => request<unknown>('/announcements/' + idPath(id) + '/read', { method: 'POST' }),

  profile: () => request<unknown>('/students/me'),
  updateProfile: (input: unknown) => request<unknown>('/students/me', { method: 'PATCH', body: JSON.stringify(input) }),
  chat: (messages: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    request<{ reply: string }>('/chat', { method: 'POST', body: JSON.stringify({ messages }), timeoutMs: 45000 }),
};

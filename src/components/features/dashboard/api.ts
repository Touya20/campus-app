import {request} from '../../../lib/axios.js';export const getDashboard=()=>request<unknown>('/dashboard');export const getUpcoming=()=>request<unknown>('/dashboard/upcoming');export const getRecentAnnouncements=()=>request<unknown>('/dashboard/recent-announcements');


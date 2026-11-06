import {request} from '../../../lib/axios.js';export const getWeeklySchedule=()=>request<unknown>('/schedule/week');


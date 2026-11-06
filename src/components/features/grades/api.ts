import {request} from '../../../lib/axios.js';export const getGrades=()=>request<unknown>('/grades');export const getGradeSummary=()=>request<unknown>('/grades/summary');


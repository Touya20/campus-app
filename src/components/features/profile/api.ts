import {request} from '../../../lib/axios.js';export const getProfile=()=>request<unknown>('/students/me');export const updateProfile=(value:unknown)=>request('/students/me',{method:'PATCH',body:JSON.stringify(value)});


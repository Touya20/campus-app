import {request} from '../../../lib/axios.js';export const getCourses=()=>request<unknown>('/courses');export const getCourse=(id:string)=>request<unknown>('/courses/'+id);export const getModules=(id:string)=>request<unknown>('/courses/'+id+'/modules');export const getMaterials=(id:string)=>request<unknown>('/courses/'+id+'/materials');


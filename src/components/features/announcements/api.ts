import {request} from '../../../lib/axios.js';export const getAnnouncements=()=>request<unknown>('/announcements');export const markAnnouncementRead=(id:string)=>request('/announcements/'+id+'/read',{method:'POST'});


import {request} from '../../lib/axios.js';
import {demoApi,enableDemoMode,isDemoId} from '../../demo/data';
async function withDemo<T>(load:()=>Promise<T>,sample:()=>Promise<T>,isEmpty=(result:T)=>result==null||(Array.isArray(result)&&result.length===0)||(typeof result==='object'&&!Array.isArray(result)&&Object.keys(result as object).length===0)):Promise<T>{
  try{
    const result=await load();
    if(!isEmpty(result))return result;
  }catch(error){
    const status=typeof error==='object'&&error!==null&&'status' in error?Number((error as {status?:unknown}).status):0;
    if(status>=400&&status<500&&status!==404)throw error;
  }
  enableDemoMode();
  return sample();
}
export const api={
  register:(input:unknown)=>request<unknown>('/auth/register',{method:'POST',body:JSON.stringify(input)}),
  login:(email:string,password:string)=>request<unknown>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  me:()=>request<unknown>('/auth/me'),
  logout:()=>request<unknown>('/auth/logout',{method:'POST'}),
  dashboard:()=>withDemo(()=>request<unknown>('/dashboard'),demoApi.dashboard,(result)=>{if(result==null)return true;if(typeof result!=='object')return false;const data=result as Record<string,unknown>;return Number(data.courseCount??data.enrolledCourses??0)===0&&Number(data.pendingAssignments??data.assignmentCount??0)===0}),
  upcoming:()=>withDemo(()=>request<unknown>('/dashboard/upcoming'),demoApi.upcoming),
  recentAnnouncements:()=>withDemo(()=>request<unknown>('/dashboard/recent-announcements'),demoApi.announcements),
  courses:(params='')=>withDemo(()=>request<unknown>('/courses'+params),demoApi.courses),
  course:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.course(id)):withDemo(()=>request<unknown>('/courses/'+encodeURIComponent(id)),()=>demoApi.course(id)),
  modules:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.modules(id)):withDemo(()=>request<unknown>('/courses/'+encodeURIComponent(id)+'/modules'),()=>demoApi.modules(id)),
  materials:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.materials(id)):withDemo(()=>request<unknown>('/courses/'+encodeURIComponent(id)+'/materials'),()=>demoApi.materials(id)),
  assignments:(params='')=>withDemo(()=>request<unknown>('/assignments'+params),demoApi.assignments),
  upcomingAssignments:()=>withDemo(()=>request<unknown>('/assignments/upcoming'),demoApi.upcoming),
  assignment:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.assignment(id)):withDemo(()=>request<unknown>('/assignments/'+encodeURIComponent(id)),()=>demoApi.assignment(id)),
  draft:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.draft(id)):withDemo(()=>request<unknown>('/assignments/'+encodeURIComponent(id)+'/drafts'),()=>demoApi.draft(id)),
  saveDraft:(id:string,content:string)=>request<unknown>('/assignments/'+encodeURIComponent(id)+'/drafts',{method:'POST',body:JSON.stringify({content})}),
  updateDraft:(id:string,content:string)=>request<unknown>('/drafts/'+encodeURIComponent(id),{method:'PATCH',body:JSON.stringify({content})}),
  deleteDraft:(id:string)=>request<unknown>('/drafts/'+encodeURIComponent(id),{method:'DELETE'}),
  submit:(id:string,content:string)=>request<unknown>('/assignments/'+encodeURIComponent(id)+'/submissions',{method:'POST',body:JSON.stringify({content})}),
  mySubmission:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.mySubmission(id)):withDemo(()=>request<unknown>('/assignments/'+encodeURIComponent(id)+'/submissions/me'),()=>demoApi.mySubmission(id)),
  schedule:(weekOf?:string)=>withDemo(()=>request<unknown>('/schedule/week'+(weekOf?'?weekOf='+encodeURIComponent(weekOf):'')),demoApi.schedule),
  grades:()=>withDemo(()=>request<unknown>('/grades'),demoApi.grades),
  courseGrades:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.courseGrades(id)):withDemo(()=>request<unknown>('/grades/'+encodeURIComponent(id)),()=>demoApi.courseGrades(id)),
  gradeSummary:()=>withDemo(()=>request<unknown>('/grades/summary'),demoApi.gradeSummary),
  announcements:(params='')=>withDemo(()=>request<unknown>('/announcements'+params),demoApi.announcements),
  announcement:(id:string)=>isDemoId(id)?(enableDemoMode(),demoApi.announcement(id)):withDemo(()=>request<unknown>('/announcements/'+encodeURIComponent(id)),()=>demoApi.announcement(id)),
  markRead:(id:string)=>request<unknown>('/announcements/'+encodeURIComponent(id)+'/read',{method:'POST'}),
  profile:()=>withDemo(()=>request<unknown>('/students/me'),demoApi.profile),
  updateProfile:(input:unknown)=>request<unknown>('/students/me',{method:'PATCH',body:JSON.stringify(input)})
};


import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {request,setAccessToken} from '../../../lib/axios.js';import {field} from '../../../lib/api';
type User={id?:string;name?:string;fullName?:string;email?:string;role?:string};type Auth={user:User|null;ready:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>void};
const C=createContext<Auth>({user:null,ready:false,login:async()=>{},logout:()=>{}});
// This hook is intentionally colocated with its provider and context.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth=()=>useContext(C);
export function AuthProvider({children}:{children:ReactNode}){const [user,setUser]=useState<User|null>(null);const [ready,setReady]=useState(false);
useEffect(()=>{const saved=sessionStorage.getItem('campus-token');if(saved){setAccessToken(saved);request('/auth/me').then(v=>setUser((field(v,'user','profile')||v) as User)).catch(()=>{sessionStorage.removeItem('campus-token');setAccessToken(null)}).finally(()=>setReady(true))}else{void Promise.resolve().then(()=>setReady(true))}
const off=()=>{sessionStorage.removeItem('campus-token');setAccessToken(null);setUser(null)};window.addEventListener('campus:unauthorized',off);return()=>window.removeEventListener('campus:unauthorized',off)},[]);
async function login(email:string,password:string){const value=await request<unknown>('/auth/login',{method:'POST',body:JSON.stringify({email,password})});const token=field(value,'token','accessToken');if(typeof token!=='string')throw new Error('The API did not return an access token.');sessionStorage.setItem('campus-token',token);setAccessToken(token);const me=await request<unknown>('/auth/me');setUser((field(me,'user','profile')||me) as User)}
function logout(){void request('/auth/logout',{method:'POST'}).catch(()=>{});sessionStorage.removeItem('campus-token');setAccessToken(null);setUser(null);location.assign('/login')}
return <C.Provider value={{user,ready,login,logout}}>{children}</C.Provider>}





import {Navigate,Outlet} from 'react-router';import {useAuth} from '../components/features/auth/AuthContext';
export function ProtectedRoute(){const {user,ready}=useAuth();if(!ready)return <div className="loading-screen">Opening your campus…</div>;return user?<Outlet/>:<Navigate to="/login" replace/>}


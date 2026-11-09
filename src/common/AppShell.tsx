import { Outlet } from 'react-router';
import { useAuth } from '../components/features/auth/AuthContext';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ChatAssistant } from './ChatAssistant';

export function AppShell() {
  const { user, logout } = useAuth();
  const userName = user?.fullName || user?.name || 'Student';

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f2f7fc_0%,#f8fafc_52%,#eef4fa_100%)] lg:pl-64">
      <Sidebar userName={userName} onSignOut={logout} />
      <div className="flex min-h-screen flex-col">
        <div className="flex-1"><Outlet /></div>
        <Footer variant="workspace" />
      </div>
      <ChatAssistant />
    </div>
  );
}

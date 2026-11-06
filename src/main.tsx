import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './components/features/auth/AuthContext';
import { ProtectedRoute } from './common/ProtectedRoute';
import { AppShell } from './common/AppShell';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseOverview from './pages/CourseOverview';
import CourseAssignments from './pages/CourseAssignments';
import CourseMaterials from './pages/CourseMaterials';
import Assignments from './pages/Assignments';
import Submissions from './pages/Submissions';
import AssignmentDetail from './pages/AssignmentDetail';
import Schedule from './pages/Schedule';
import Grades from './pages/Grades';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import SubmitWork from './pages/SubmitWork';
import EditDraft from './pages/EditDraft';
import Receipt from './pages/Receipt';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseOverview />} />
              <Route path="courses/:id/assignments" element={<CourseAssignments />} />
              <Route path="courses/:id/materials" element={<CourseMaterials />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assignments/:id" element={<AssignmentDetail />} />
              <Route path="submissions" element={<Submissions />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="grades" element={<Grades />} /><Route path="grades/:id" element={<Grades />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="announcements/:id" element={<Announcements />} />
              <Route path="profile" element={<Profile />} />
              <Route path="submit-work" element={<SubmitWork />} />
              <Route path="edit-draft" element={<EditDraft />} />
              <Route path="receipt" element={<Receipt />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);


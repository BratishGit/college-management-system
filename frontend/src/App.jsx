import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';

// Admin pages
import ManageStudents from './pages/Admin/ManageStudents';
import ManageTeachers from './pages/Admin/ManageTeachers';
import ManageSubjects from './pages/Admin/ManageSubjects';
import StudentCourses from './pages/Student/StudentCourses';
import HostelManagement from './pages/Admin/HostelManagement';
import LibraryManagement from './pages/Admin/LibraryManagement';
import TransportManagement from './pages/Admin/TransportManagement';

// Teacher pages
import TeacherAttendance from './pages/Teacher/TeacherAttendance';
import TeacherMarksEntry from './pages/Teacher/TeacherMarksEntry';

// Common/shared pages
import AttendancePage from './pages/Common/AttendancePage';
import ExamPage from './pages/Common/ExamPage';
import LeavePage from './pages/Common/LeavePage';
import ReportPage from './pages/Common/ReportPage';
import PlacementPage from './pages/Common/PlacementPage';
import TimetablePage from './pages/Common/TimetablePage';

import { useState, useEffect } from 'react';

// Placeholder for modules that are planned but not yet built
const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <h2 className="text-3xl font-extrabold text-surface-900 mb-4">{title}</h2>
    <p className="text-surface-500">This module is currently under development.</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />

        <Route element={user ? <DashboardLayout user={user} setUser={setUser}><Outlet /></DashboardLayout> : <Navigate to="/login" replace />}>
          {/* Dashboard — role-aware home */}
          <Route path="/" element={
            user?.role === 'ADMIN' ? <AdminDashboard /> :
              user?.role === 'TEACHER' ? <TeacherDashboard /> :
                <StudentDashboard />
          } />

          {/* ===== ADMIN ROUTES ===== */}
          <Route path="/students" element={<ManageStudents />} />
          <Route path="/teachers" element={<ManageTeachers />} />
          <Route path="/courses" element={
            user?.role === 'ADMIN' ? <ManageSubjects /> : <StudentCourses />
          } />
          <Route path="/library" element={<LibraryManagement />} />
          <Route path="/hostel" element={<HostelManagement />} />
          <Route path="/transport" element={<TransportManagement />} />

          {/* ===== TEACHER ROUTES ===== */}
          <Route path="/attendance" element={
            user?.role === 'TEACHER' ? <TeacherAttendance user={user} /> : <AttendancePage user={user} />
          } />
          <Route path="/marks-entry" element={<TeacherMarksEntry user={user} />} />
          <Route path="/reports" element={<ReportPage user={user} />} />

          {/* ===== SHARED / STUDENT ROUTES ===== */}
          <Route path="/exams" element={<ExamPage user={user} />} />
          <Route path="/leaves" element={<LeavePage user={user} />} />
          <Route path="/placements" element={<PlacementPage user={user} />} />
          <Route path="/fees" element={<ComingSoon title="Fee Collections" />} />
          <Route path="/timetable" element={<TimetablePage user={user} />} />
          <Route path="/profile" element={<ComingSoon title="Student Profile" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

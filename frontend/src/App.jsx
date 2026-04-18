import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageTeachers from './pages/Admin/ManageTeachers';
import ManageSubjects from './pages/Admin/ManageSubjects';
import HostelManagement from './pages/Admin/HostelManagement';
import TransportManagement from './pages/Admin/TransportManagement';
import LibraryManagement from './pages/Admin/LibraryManagement';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import TeacherAttendance from './pages/Teacher/TeacherAttendance';
import TeacherMarksEntry from './pages/Teacher/TeacherMarksEntry';
import StudentDashboard from './pages/Student/StudentDashboard';
// Placeholder components for new features - will be created next
import AttendancePage from './pages/Common/AttendancePage';
import LeavePage from './pages/Common/LeavePage';
import ReportPage from './pages/Common/ReportPage';
import ExamPage from './pages/Common/ExamPage';
import { useState, useEffect } from 'react';

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
          <Route path="/" element={
            user?.role === 'ADMIN' ? <AdminDashboard /> :
              user?.role === 'TEACHER' ? <TeacherDashboard /> :
                <StudentDashboard />
          } />

          {/* Common Routes but behavior depends on Role */}
          <Route path="/attendance" element={<AttendancePage user={user} />} />
          <Route path="/leaves" element={<LeavePage user={user} />} />
          <Route path="/exams" element={<ExamPage user={user} />} />

          {/* Admin Specific Routes */}
          {user?.role === 'ADMIN' && (
            <>
              <Route path="/students" element={<ManageStudents />} />
              <Route path="/teachers" element={<ManageTeachers />} />
              <Route path="/subjects" element={<ManageSubjects />} />
              <Route path="/hostel" element={<HostelManagement />} />
              <Route path="/transport" element={<TransportManagement />} />
              <Route path="/library" element={<LibraryManagement />} />
            </>
          )}

          {/* Teacher Specific */}
          {user?.role === 'TEACHER' && (
            <>
              <Route path="/attendance" element={<TeacherAttendance />} />
              <Route path="/marks" element={<TeacherMarksEntry />} />
              <Route path="/reports" element={<ReportPage user={user} />} />
            </>
          )}

          {/* Student Specific */}
          {user?.role === 'STUDENT' && (
            <>
              <Route path="/courses" element={<StudentDashboard />} /> {/* Reuse for subjects */}
              <Route path="/requests" element={<ReportPage user={user} />} />
              <Route path="/profile" element={<StudentDashboard />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

# 🎓 collegeGo — Enterprise College Management System

> A production-grade, full-stack institutional management platform built with Spring Boot 3 and React 19.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19)                      │
│   StudentDashboard │ TeacherDashboard │ AdminDashboard          │
│   AttendancePage   │ ExamPage         │ LeavePage               │
│   TeacherMarksEntry│ TeacherAttendance│ ManageStudents/Teachers  │
│   PlacementPage    │ LibraryPage      │ HostelPage              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Axios + JWT Bearer Token
┌───────────────────────────▼─────────────────────────────────────┐
│                     BACKEND (Spring Boot 3.4)                    │
│                                                                  │
│  Controllers:                                                    │
│    AuthController          → /api/auth/login, /api/auth/register │
│    StudentPortalController → /api/student/dashboard, /profile    │
│    TeacherPortalController → /api/teacher/subjects, /marks, etc. │
│    AdminPortalController   → /api/admin/exams, /attendance, etc. │
│    LeaveRequestController  → /api/leaves/*                       │
│    CourseController         → /api/courses/*                     │
│    StudentController       → /api/students/*                    │
│    TeacherController       → /api/teachers/* (Admin only)       │
│                                                                  │
│  Security: JWT + @PreAuthorize (RBAC: ADMIN, TEACHER, STUDENT)   │
│  Database: H2 (dev) / MySQL (prod)                               │
│  Audit: AuditLogService (all mutations logged)                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication & Security

| Feature | Implementation |
|---------|---------------|
| **Auth Mechanism** | JWT Bearer tokens via `Authorization` header |
| **Password Storage** | BCrypt hash (never exposed — `@JsonIgnore`) |
| **Role-Based Access** | `@PreAuthorize` on all sensitive endpoints |
| **Session Expiry** | Auto-logout via 401 response interceptor in frontend |
| **Secret Management** | JWT secret/expiration externalized to environment variables |

### Pre-created Accounts
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher.sharma` | `teacher123` |
| Students | `2024cs001` to `2024cs010` | `student123` |

---

## 🛠️ Technology Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Framework | Spring Boot 3.4.1 |
| Security | Spring Security 6 + JWT |
| ORM | Spring Data JPA (Hibernate) |
| Database | H2 (dev default) / MySQL 8 (production) |
| Build | Maven |
| Utilities | Lombok, SLF4J |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React 19 |
| Bundler | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| HTTP Client | Axios (with request/response interceptors) |
| Routing | React Router DOM v7 |

---

## 🚀 Running the System

### Backend (H2 — Zero Configuration)
```bash
cd backend
mvn spring-boot:run
```
- **API Server:** `http://localhost:8080`
- **H2 Console:** `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:srmsdb`
  - Username: `sa` / Password: `password`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
- **App:** `http://localhost:5173`

### Production (MySQL)
See [MYSQL_SETUP.md](MYSQL_SETUP.md) for database configuration.

Set environment variables before starting the backend:
```bash
export JWT_SECRET=your-production-secret-min-32-chars
export JWT_EXPIRATION=86400000
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Returns JWT token + userId + role |
| POST | `/api/auth/register` | Public | Register new user |

### Student Portal
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/student/dashboard` | STUDENT | Courses, attendance, results, exams |
| GET | `/api/student/profile` | STUDENT | Student profile (DTO response) |

### Teacher Portal
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/teacher/dashboard` | TEACHER | Teacher overview + assigned courses |
| GET | `/api/teacher/subjects` | TEACHER | Courses assigned to teacher |
| GET | `/api/teacher/students/{semester}` | TEACHER | Students in a semester |
| POST | `/api/teacher/attendance` | TEACHER | Bulk attendance submission |
| POST | `/api/teacher/marks` | TEACHER | Save/update marks (validated: 0-40 / 0-60) |
| POST | `/api/teacher/marks/lock` | TEACHER | Lock result (irreversible) |

### Admin Portal
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/exams` | ADMIN | All exam schedules |
| POST | `/api/admin/exams` | ADMIN | Create exam schedule |
| GET | `/api/admin/attendance` | ADMIN | All attendance records |
| GET | `/api/admin/students` | ADMIN | All students (non-paginated) |

### Leave Management
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/leaves` | STUDENT | Apply for leave |
| GET | `/api/leaves/my-leaves` | Any | Get own leave requests |
| GET | `/api/leaves/all` | ADMIN/TEACHER | Get all leave requests |
| PATCH | `/api/leaves/{id}/workflow` | ADMIN/TEACHER | Approve/Reject (2-stage) |

### CRUD Endpoints
| Resource | Base Path | Admin Required For |
|----------|-----------|-------------------|
| Students | `/api/students` | Create, Update, Delete |
| Teachers | `/api/teachers` | Create, Update, Delete |
| Courses | `/api/courses` | Create, Update, Delete |

---

## 🔒 Data Integrity Safeguards

| Rule | Location |
|------|----------|
| Marks range: Internal 0-40, External 0-60 | `ResultService` (server-side) |
| Fee overpayment blocked | `FeeService` (caps at remaining balance) |
| Duplicate attendance prevented | `AttendanceService` (upsert on student+course+date) |
| Duplicate placement applications blocked | `PlacementService` |
| CGPA eligibility check for placements | `PlacementService` |
| Result locking (irreversible) | `ResultService.lockResult()` |
| Duplicate username check on registration | `TeacherService`, `StudentService` |
| Cascading delete (entity + user) | `TeacherService`, `StudentService` |

---

## 📊 Seeded Data

- **10 Students** — Roll numbers `2024CS001` to `2024CS010`
- **3 Teachers** — Dr. Alok Sharma, Dr. Meera Iyer, Prof. Vikram Singh
- **3 Courses** — Data Structures, DBMS, Discrete Mathematics
- **Results, Attendance, Leaves** — Pre-populated for demo

---

## 🎨 UI/UX

- **Tailwind v4 Native** — Unified color tokens (`primary-600`, `surface-50`) via `index.css`
- **Premium Components** — `.card-premium`, `.glass-panel`, `.btn-primary` design system
- **Role-Based Routing** — 15+ pages with access control via React Router
- **Micro-Animations** — Framer Motion on cards, modals, toasts
- **Auto-Logout** — 401 interceptor clears session and redirects to `/login`

---

**System Status:** ✅ Production-Ready  
**Last Updated:** 2026-04-24  
**Audit Status:** Phases 1–6 Complete (Security, Endpoints, Contracts, Logic, Wiring, Performance)

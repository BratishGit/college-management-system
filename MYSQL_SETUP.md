# 🗄️ Database Setup Guide

## 1. Local Development (H2 Embedded — Default)

The system ships with **H2 Embedded In-Memory Database** for zero-configuration local development. No external database installation required.

### Quick Start
```bash
cd backend
mvn spring-boot:run
```

### H2 Console
Access the database browser at `http://localhost:8080/h2-console`:

| Setting | Value |
|---------|-------|
| JDBC URL | `jdbc:h2:mem:srmsdb` |
| Username | `sa` |
| Password | `password` |

> [!NOTE]
> Data is seeded automatically on startup via `DataSeeder.java`. The in-memory database resets on each restart.

---

## 2. Production Setup (MySQL 8)

### Step 1: Create the Database
```sql
CREATE DATABASE srms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Configure `application.properties`
Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/srms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### Step 3: Set Environment Variables
```bash
# Required for production security
export JWT_SECRET=your-production-secret-key-minimum-32-characters-long
export JWT_EXPIRATION=86400000   # 24 hours in milliseconds
```

### Step 4: Run
```bash
mvn spring-boot:run
```

> [!IMPORTANT]
> JPA `ddl-auto=update` will auto-create tables. The `DataSeeder` will populate initial accounts (admin, teachers, students). For production, consider setting `ddl-auto=validate` after initial setup.

---

## 3. Database Schema Overview

### Core Tables
| Table | Description | Key Relationships |
|-------|-------------|-------------------|
| `users` | Auth accounts (username, password hash, role) | Base for Student/Teacher |
| `students` | Academic profiles (roll number, semester, department) | FK → users, mentors |
| `teachers` | Faculty profiles (name, department, designation) | FK → users |
| `courses` | Subject catalog (code, name, credits, semester) | FK → teachers |

### Academic Tables
| Table | Description |
|-------|-------------|
| `results` | Marks, grades, grade points, lock status |
| `attendance` | Per-student, per-course, per-date presence records |
| `exam_schedules` | Exam dates, rooms, durations per course |

### Administrative Tables
| Table | Description |
|-------|-------------|
| `leave_requests` | 2-stage workflow (PENDING → APPROVED/REJECTED) |
| `fees` | Student fee records with paid/pending tracking |
| `fee_payments` | Individual payment transactions |
| `audit_logs` | Immutable action log for all mutations |

### Facility Tables
| Table | Description |
|-------|-------------|
| `hostel_allocations` | Room assignments |
| `bus_routes` / `bus_stops` | Transport management |
| `books` / `book_issues` | Library catalog and tracking |

### Placement Tables
| Table | Description |
|-------|-------------|
| `companies` | Registered placement companies |
| `placement_drives` | Drive details with CGPA eligibility |
| `placement_applications` | Student applications (duplicate-safe) |

---

## 4. Indexed Columns

The following indexes are defined for query performance:

| Table | Index | Column(s) |
|-------|-------|-----------|
| `students` | `idx_student_roll` | `rollNumber` |
| `students` | `idx_student_dept` | `department` |

---

## 5. Data Seeding

On first startup, `DataSeeder.java` creates:
- 1 Admin account (`admin` / `admin123`)
- 3 Teacher accounts with profiles
- 10 Student accounts (`2024cs001`–`2024cs010`) with profiles
- 3 Courses (Data Structures, DBMS, Discrete Math)
- Sample results, attendance records, and leave requests

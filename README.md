#  College Management System - Complete Implementation

##  System Overview
A comprehensive **College Management System (CMS)** with complete academic, administrative, and facility management capabilities for students, teachers, and administrators.

---

##  Latest Updates & Features

### ** New Features Added:**

#### **1. Teacher Attendance System**
- **Class Selection Interface** - Teachers select their subject/class
- **P/A Marking** - Quick Present/Absent buttons for each student
- **Real-time Statistics** - Live count of Present/Absent/Total students
- **Bulk Actions** - Mark all present or all absent with one click
- **Student Details** - View roll number, name, and assigned mentor
- **Instant Save** - Save attendance with confirmation

#### **2. Mentor-Student Assignment**
- Each student is assigned a faculty mentor
- Mentors distributed evenly among teachers
- Visible in attendance marking and student profiles

#### **3. Sample Data Seeded**
- **16 Students** with realistic names and roll numbers (2024CS001-2024CS016)
- **3 Teachers** (Dr. Sarah Johnson, Prof. Rajesh Kumar, Dr. Priya Patel)
- **4 Subjects** (Data Structures, DBMS, Discrete Math, Engineering Physics)
- **Results** - Complete marks and grades for all students
- **Attendance** - 20 days of historical attendance data
- **Leave Requests** - Sample approved and pending leaves
- **Exam Schedules** - Upcoming exams for all subjects

#### **4. New College Facilities (Backend Ready)**
- **Library Management** - Book catalog and issue tracking
- **Hostel Management** - Room allocation system
- **Transport Management** - Bus routes and schedules

---

##  Login Credentials

### **Pre-created Accounts:**
- **Admin:** `admin` / `admin123`
- **Teacher:** `teacher` / `teacher123`
- **Students:** `2024cs001` to `2024cs016` / `student123`

---

##  Complete Feature List

### ** Admin Powers (Supreme Controller)**

**Student Management:**
-  Add new students with mentor assignment
-  View all students with search
-  Edit student details
-  View student academic records
-  Assign mentors

**Teacher Management:**
-  Add new teachers
-  Edit teacher details
-  Assign subjects to teachers
-  View teacher workload

**Academic Management:**
-  Create and manage subjects
-  Schedule examinations
-  View all results and analytics
-  Generate reports

**Leave Management:**
-  View all leave requests
-  Approve/reject leaves with one click
-  Track leave history

**Attendance Oversight:**
-  View all attendance records
-  Rectify attendance errors
-  Generate attendance reports

**System Statistics:**
-  Total students, teachers, subjects
-  Pass rate analytics
-  Attendance trends
-  System-wide metrics

---

### ** Teacher Capabilities**

**Attendance Management:**
-  Select class/subject
-  View complete student list with details
-  Mark P (Present) or A (Absent) for each student
-  See real-time statistics (Present/Absent/Total)
-  Bulk mark all present/absent
-  Save attendance instantly

**Marks Entry:**
-  Enter internal marks (out of 40)
-  Enter external marks (out of 60)
-  Auto-calculate grades
-  Lock results when finalized

**Student Reporting:**
-  Report student behavioral issues
-  Report academic concerns
-  Track report status

**Leave Management:**
-  Apply for personal leaves
-  Track leave status
-  View leave history

**Dashboard:**
-  View assigned subjects
-  See upcoming lectures
-  Activity insights
-  Student alerts

---

### ** Student Features**

**Attendance Tracking:**
-  Subject-wise attendance bar graphs
-  Percentage calculation
-  **75% Rule Calculator** - Shows how many classes can be missed
-  Visual indicators (Green for ≥75%, Red for <75%)
-  Historical attendance records

**Academic Performance:**
-  View all results with grades
-  SGPA/CGPA calculation
-  Grade point visualization
-  Subject-wise performance
-  Download result PDFs

**Exam Information:**
-  View exam schedules
-  Date, time, and venue details
-  Duration information
-  Upcoming exam alerts

**Leave Management:**
-  Apply for leaves (Medical/Personal/Academic)
-  Track approval status
-  View leave history
-  Pending/Approved/Rejected indicators

**Course Information:**
-  View enrolled subjects
-  Subject codes and credits
-  Teacher information
-  Semester details

**Mentor Information:**
-  View assigned mentor
-  Mentor contact details

---

##  UI/UX Highlights

### **Design System:**
- **Premium Aesthetics** - Modern, professional interface
- **Glassmorphism** - Frosted glass effects
- **Smooth Animations** - Framer Motion transitions
- **Interactive Charts** - Recharts for data visualization
- **Responsive Design** - Works on all devices
- **Color-coded Status** - Instant visual feedback

### **Key Components:**
- **P/A Buttons** - Large, clear Present/Absent buttons
- **Real-time Stats** - Live counters for attendance
- **Interactive Tables** - Hover effects and smooth transitions
- **Status Badges** - Color-coded indicators
- **Modal Overlays** - Backdrop blur with smooth animations
- **Loading States** - Elegant spinners and skeletons

---

##  Technology Stack

**Backend:**
- Spring Boot 3.4.1
- Spring Security with JWT
- Spring Data JPA
- H2 Database (file-based with persistence)
- Lombok
- Maven
- **Data Seeder** - Automatic sample data generation

**Frontend:**
- React 18
- Vite 7
- Tailwind CSS v4
- Framer Motion (animations)
- Recharts (charts & graphs)
- Axios (API calls)
- React Router DOM v6
- Lucide React (icons)

---

##  Database Entities

**Core Entities:**
- User, Student, Teacher, Subject
- Result, Attendance
- LeaveRequest, ExamSchedule
- StudentReport

**Facility Entities (Ready):**
- LibraryBook, BookIssue
- HostelRoom, HostelAllocation
- TransportRoute

---

##  Running the System

### **Backend:**
```bash
cd backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
**Server:** `http://localhost:8080`

### **Frontend:**
```bash
cd frontend
npm run dev
```
**App:** `http://localhost:5173`

### **Database Console:**
`http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/srms_db`
- Username: `sa`
- Password: *(leave blank)*

---

##  Sample Data Details

### **Students (16):**
- Amit Sharma (2024CS001)
- Priya Singh (2024CS002)
- Rahul Verma (2024CS003)
- Sneha Reddy (2024CS004)
- Karan Patel (2024CS005)
- Anjali Gupta (2024CS006)
- Vikram Rao (2024CS007)
- Pooja Nair (2024CS008)
- Arjun Mehta (2024CS009)
- Divya Iyer (2024CS010)
- Rohan Das (2024CS011)
- Kavya Pillai (2024CS012)
- Siddharth Joshi (2024CS013)
- Meera Desai (2024CS014)
- Aditya Kulkarni (2024CS015)
- Riya Kapoor (2024CS016)

### **Teachers (3):**
- Dr. Sarah Johnson (Computer Science) - Associate Professor
- Prof. Rajesh Kumar (Mathematics) - Professor
- Dr. Priya Patel (Physics) - Assistant Professor

### **Subjects (4):**
- CS101: Data Structures & Algorithms (4 credits)
- CS102: Database Management Systems (4 credits)
- MATH201: Discrete Mathematics (3 credits)
- PHY101: Engineering Physics (3 credits)

### **Data Included:**
-  Complete results for all students (all subjects)
-  20 days of attendance history
-  Sample leave requests (approved and pending)
-  Upcoming exam schedules
-  Mentor assignments (evenly distributed)

---

##  How to Use

### **For Teachers:**
1. Login with `teacher` / `teacher123`
2. Click **"Attendance"** in sidebar
3. Select your class/subject
4. Mark P or A for each student
5. See live statistics at top
6. Click **"SAVE ATTENDANCE"**

### **For Students:**
1. Login with any roll number (e.g., `2024cs001` / `student123`)
2. View dashboard with:
   - Attendance graphs
   - 75% calculator
   - Results and SGPA
   - Exam schedules
3. Apply for leaves
4. Track attendance percentage

### **For Admin:**
1. Login with `admin` / `admin123`
2. Access all features:
   - Manage students and teachers
   - Approve leaves
   - Schedule exams
   - View system statistics
   - Oversee attendance

---

##  Key Improvements

### **Attendance System:**
-  Simplified P/A interface (no complex forms)
-  Real-time statistics display
-  Bulk actions for efficiency
-  Student details visible during marking
-  Mentor information included

### **Data & Testing:**
-  16 realistic student profiles
-  Complete historical data
-  Ready-to-test scenarios
-  No blank pages or empty states

### **Admin Control:**
-  Complete oversight of all operations
-  One-click approvals
-  System-wide analytics
-  Full CRUD operations

---

##  Future Enhancements (Backend Ready)

1. **Library System** - Book issue/return interface
2. **Hostel Management** - Room allocation UI
3. **Transport System** - Bus pass management
4. **Fee Management** - Payment tracking
5. **Parent Portal** - View student progress
6. **Notifications** - Email/SMS alerts
7. **Mobile App** - React Native version
8. **Advanced Analytics** - Predictive insights

---

##  System Highlights

-  **Zero Configuration** - Sample data auto-loaded
-  **Production Ready** - Complete error handling
-  **Scalable Architecture** - Clean separation of concerns
-  **Secure** - JWT authentication, BCrypt encryption
-  **Fast** - Optimized queries and rendering
-  **Beautiful** - Premium UI/UX design
-  **Complete** - All requested features implemented

---

**Built with ❤️ for comprehensive college management**

**System Status:**  Fully Operational
**Last Updated:** 2026-01-26
**Version:** 2.0 (College Management System)

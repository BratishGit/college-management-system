package com.srms.backend.config;

import com.srms.backend.entity.Role;
import com.srms.backend.entity.User;
import com.srms.backend.entity.Teacher;
import com.srms.backend.entity.Course;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.Fee;
import com.srms.backend.entity.Result;
import com.srms.backend.entity.LeaveRequest;
import com.srms.backend.entity.Company;
import com.srms.backend.entity.PlacementDrive;
import com.srms.backend.repository.UserRepository;
import com.srms.backend.repository.StudentRepository;
import com.srms.backend.repository.TeacherRepository;
import com.srms.backend.repository.CourseRepository;
import com.srms.backend.repository.ResultRepository;
import com.srms.backend.repository.FeeRepository;
import com.srms.backend.repository.CompanyRepository;
import com.srms.backend.repository.PlacementDriveRepository;
import com.srms.backend.repository.LeaveRequestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final ResultRepository resultRepository;
    private final FeeRepository feeRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, StudentRepository studentRepository,
                      TeacherRepository teacherRepository, CourseRepository courseRepository,
                      ResultRepository resultRepository, FeeRepository feeRepository,
                      CompanyRepository companyRepository, PlacementDriveRepository driveRepository,
                      LeaveRequestRepository leaveRequestRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.resultRepository = resultRepository;
        this.feeRepository = feeRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // Already seeded

        // 1. Create Users
        User adminUser = User.builder().username("admin").password(passwordEncoder.encode("admin123")).role(Role.ADMIN).build();
        userRepository.save(adminUser);

        User teacher1User = User.builder().username("teacher.sharma").password(passwordEncoder.encode("teacher123")).role(Role.TEACHER).build();
        User teacher2User = User.builder().username("teacher.iyer").password(passwordEncoder.encode("teacher123")).role(Role.TEACHER).build();
        User teacher3User = User.builder().username("teacher.singh").password(passwordEncoder.encode("teacher123")).role(Role.TEACHER).build();
        userRepository.save(teacher1User);
        userRepository.save(teacher2User);
        userRepository.save(teacher3User);

        // 2. Create Teachers
        Teacher teacher1 = Teacher.builder().user(teacher1User).name("Dr. Alok Sharma").department("Computer Science").designation("Professor").build();
        Teacher teacher2 = Teacher.builder().user(teacher2User).name("Dr. Meera Iyer").department("Mathematics").designation("Associate Professor").build();
        Teacher teacher3 = Teacher.builder().user(teacher3User).name("Prof. Vikram Singh").department("Physics").designation("Assistant Professor").build();
        teacherRepository.save(teacher1);
        teacherRepository.save(teacher2);
        teacherRepository.save(teacher3);

        // 3. Create Courses
        Course cs101 = Course.builder().code("CS101").name("Data Structures").credits(4).semester(3).teacher(teacher1).build();
        Course cs102 = Course.builder().code("CS102").name("DBMS").credits(4).semester(3).teacher(teacher1).build();
        Course math201 = Course.builder().code("MATH201").name("Discrete Math").credits(3).semester(3).teacher(teacher2).build();
        courseRepository.save(cs101);
        courseRepository.save(cs102);
        courseRepository.save(math201);

        // 4. Create Students 
        String[] studentNames = {"Aryan Kumar", "Ananya Reddy", "Rahul Verma", "Sneha Patel", "Karan Das", "Pooja Singh", "Rohan Joshi", "Divya Sharma", "Aditya Iyer", "Kavya Menon"};
        
        for (int i = 0; i < studentNames.length; i++) {
            String rollNum = String.format("2024CS%03d", i + 1);
            User studentUser = User.builder().username(rollNum.toLowerCase()).password(passwordEncoder.encode("student123")).role(Role.STUDENT).build();
            userRepository.save(studentUser);

            Teacher mentor = (i % 2 == 0) ? teacher1 : teacher2;
            
            Student student = Student.builder()
                    .user(studentUser)
                    .name(studentNames[i])
                    .rollNumber(rollNum)
                    .department("Computer Science")
                    .currentSemester(3)
                    .mentor(mentor)
                    .admissionStatus("ADMITTED")
                    .build();
            studentRepository.save(student);

            // Add Fee Data
            Fee fee = Fee.builder()
                .student(student)
                .totalAmount(50000.0)
                .paidAmount(i % 3 == 0 ? 50000.0 : 25000.0)
                .dueDate(LocalDate.now().plusDays(30))
                .status(i % 3 == 0 ? "PAID" : "PARTIAL")
                .semester(3)
                .build();
            feeRepository.save(fee);

            // Add Results
            createResult(student, cs101, 30.0 + (Math.random() * 10), 40.0 + (Math.random() * 20));
            createResult(student, cs102, 25.0 + (Math.random() * 15), 35.0 + (Math.random() * 25));

            // Setup Leaves
            if (i % 4 == 0) {
                LeaveRequest lr = LeaveRequest.builder().user(studentUser).reason("Family Function").type("PERSONAL").startDate(LocalDate.now().minusDays(5)).endDate(LocalDate.now().minusDays(3)).status("APPROVED").build();
                leaveRequestRepository.save(lr);
            }
        }

        // 5. Placements
        Company infosys = Company.builder().name("Infosys").industry("IT").build();
        Company tcs = Company.builder().name("TCS").industry("IT").build();
        companyRepository.save(infosys);
        companyRepository.save(tcs);

        PlacementDrive drive = PlacementDrive.builder().company(infosys).driveDate(LocalDate.now().plusDays(15)).jobRole("Software Engineer").packageLpa(6.5).eligibilityCgpa(7.0).status("UPCOMING").build();
        driveRepository.save(drive);

        System.out.println("✅ Enterprise Database seeded with sample data!");
    }

    private void createResult(Student student, Course course, Double internal, Double external) {
        Double total = internal + external;
        Result result = Result.builder().student(student).course(course).internalMarks(internal).externalMarks(external).totalMarks(total).semester(course.getSemester()).grade(total > 80 ? "A" : "B").isLocked(true).build();
        resultRepository.save(result);
    }
}

package com.srms.backend.service;

import com.srms.backend.entity.Role;
import com.srms.backend.entity.Teacher;
import com.srms.backend.entity.User;
import com.srms.backend.repository.TeacherRepository;
import com.srms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<Teacher> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable);
    }

    @Transactional
    public Teacher createTeacher(String name, String department, String designation, String username, String password) {
        // BIZ-05: Check for duplicate username
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken");
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(Role.TEACHER)
                .build();
        userRepository.save(user);

        Teacher teacher = Teacher.builder()
                .name(name)
                .department(department)
                .designation(designation)
                .user(user)
                .build();
        return teacherRepository.save(teacher);
    }

    @Transactional
    public Teacher updateTeacher(Long id, String name, String department, String designation) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacher.setName(name);
        teacher.setDepartment(department);
        teacher.setDesignation(designation);
        return teacherRepository.save(teacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        User user = teacher.getUser();
        // BIZ-04: Delete teacher first (has FK constraints from courses), then user
        teacherRepository.delete(teacher);
        userRepository.delete(user);
    }
}

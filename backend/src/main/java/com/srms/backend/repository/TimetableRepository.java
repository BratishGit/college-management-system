package com.srms.backend.repository;

import com.srms.backend.entity.Timetable;
import com.srms.backend.entity.Course;
import com.srms.backend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByCourse(Course course);
    List<Timetable> findByTeacher(Teacher teacher);
    List<Timetable> findByDayOfWeek(String dayOfWeek);
    List<Timetable> findByCourseSemester(Integer semester);
}

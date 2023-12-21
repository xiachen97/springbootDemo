package com.example.demo.student;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping(path="api/v1/students")
public class StudentController {
    @GetMapping
    public List<Student> getAllStudents(){

        return Arrays.asList(
                new Student(1L,"xia1","chen1@gmail.com",Gender.FEMALE),
                new Student(2L,"xia2","chen2@gmail.com",Gender.MALE),
                new Student(3L,"xia3","chen3@gmail.com",Gender.FEMALE),
                new Student(4L,"xia4","chen4@gmail.com",Gender.MALE)
        );

    }
}

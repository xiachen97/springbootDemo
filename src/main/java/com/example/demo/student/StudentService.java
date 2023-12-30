package com.example.demo.student;

import com.example.demo.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import com.example.demo.student.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service

public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> getAllStudent(){
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        Boolean existsEmail=studentRepository.selectExistsEmail(student.getEmail());
        if(existsEmail){
            throw new BadRequestException("Email" + student.getEmail() + " taken");
        }
        //check if email is taken
        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        if(!studentRepository.existsById(studentId)){
            throw new StudentNotFoundException("Student with id " +studentId +" does not exist.");
        }
        //check if email is exist
        studentRepository.deleteById(studentId);
    }

}

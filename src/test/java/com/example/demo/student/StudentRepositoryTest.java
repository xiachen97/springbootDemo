package com.example.demo.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
public class StudentRepositoryTest {
    @Autowired
    private StudentRepository underTest;

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }

    @Test
    void itShouldCheckIfStudentExistsEmailExists(){

        //given
        String email="xia@gmail.com";
        Student student =new Student(
                "xia",
                email,
                Gender.FEMALE
        );
        underTest.save(student);

        //when
        Boolean expected=underTest.selectExistsEmail(email);


        //then
        assertThat(expected).isTrue();


    }

    @Test
    void itShouldCheckIfStudentExistsEmailDoesNotExists(){

        //given
        String email="xia@gmail.com";


        //when
        Boolean expected=underTest.selectExistsEmail(email);


        //then
        assertThat(expected).isFalse();


    }
}

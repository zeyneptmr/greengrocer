package org.example.greengrocer.repository;

import org.example.greengrocer.model.ContactForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactFormRepository extends JpaRepository<ContactForm, Long> {

    List<ContactForm> findAllByOrderByTimestampDesc();

    List<ContactForm> findByIsReadFalse();
}

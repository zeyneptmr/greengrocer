package org.example.greengrocer.service;

import org.example.greengrocer.model.ContactForm;
import org.example.greengrocer.repository.ContactFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactFormService {

    private final ContactFormRepository contactFormRepository;

    @Autowired
    public ContactFormService(ContactFormRepository contactFormRepository) {
        this.contactFormRepository = contactFormRepository;
    }

    public void saveContactForm(ContactForm form) {
        contactFormRepository.save(form);
    }
}



package org.example.greengrocer.controller;

import org.example.greengrocer.model.ContactForm;
import org.example.greengrocer.repository.ContactFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactFormController {

    private final ContactFormRepository contactFormRepository;

    @Autowired
    public ContactFormController(ContactFormRepository contactFormRepository) {
        this.contactFormRepository = contactFormRepository;
    }

    @PostMapping("/submit")
    public String submitContactForm(@RequestBody ContactForm form) {
        contactFormRepository.save(form);
        return "Your message has been received.";
    }

    @GetMapping("/all")
    public Iterable<ContactForm> getAllMessages() {
        return contactFormRepository.findAll();
    }
}
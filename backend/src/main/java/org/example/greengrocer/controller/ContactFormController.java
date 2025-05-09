package org.example.greengrocer.controller;

import org.example.greengrocer.model.ContactForm;
import org.example.greengrocer.repository.ContactFormRepository;
import org.example.greengrocer.service.ContactFormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactFormController {

    private final ContactFormService contactFormService;

    @Autowired
    private ContactFormRepository contactFormRepository;

    @Autowired
    public ContactFormController(ContactFormService contactFormService) {
        this.contactFormService = contactFormService;
    }

    @PostMapping("/submit")
    public String submitContactForm(@RequestBody ContactForm form) {
        contactFormService.saveContactForm(form);
        return "Your message has been received.";
    }

    @GetMapping("/all")
    public List<ContactForm> getAllForms() {
        return contactFormService.getAllContactForms();
    }

    @GetMapping("/unread")
    public List<ContactForm> getUnreadForms() {
        return contactFormService.getUnreadForms();
    }

    @PutMapping("/{id}")
    public ContactForm updateMessage(@PathVariable Long id, @RequestBody ContactForm updatedForm) {
        return contactFormService.updateForm(id, updatedForm);
    }

    @DeleteMapping("/{id}")
    public String deleteMessage(@PathVariable Long id) {
        contactFormService.deleteForm(id);
        return "Message deleted successfully.";
    }

    @PatchMapping("/{id}")
    public ContactForm markAsRead(@PathVariable Long id) {
        return contactFormService.markAsRead(id);
    }

}

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


    // Yeni gelen mesajları kaydetmek için sadece tüm kullanıcılara izin veriyoruz
    @PostMapping("/submit")
    public String submitContactForm(@RequestBody ContactForm form) {
        contactFormService.saveContactForm(form);
        return "Your message has been received.";
    }

    // Tüm mesajları getir
    @GetMapping("/all")
    public List<ContactForm> getAllMessages() {
        return contactFormService.getAllContactForms();
    }

    // Okunmamış mesajları getir
    @GetMapping("/unread")
    public List<ContactForm> getUnreadMessages() {
        return contactFormService.getUnreadForms();
    }

    // Mevcut mesajları güncelle
    @PutMapping("/{id}")
    public ContactForm updateMessage(@PathVariable Long id, @RequestBody ContactForm updatedForm) {
        return contactFormService.updateForm(id, updatedForm);
    }

    // Mesajları sil
    @DeleteMapping("/{id}")
    public String deleteMessage(@PathVariable Long id) {
        contactFormService.deleteForm(id);
        return "Message deleted successfully.";
    }

    // Okunmuş olarak işaretle
    @PatchMapping("/{id}")
    public ContactForm markAsRead(@PathVariable Long id, @RequestBody ContactForm formDetails) {
        ContactForm form = contactFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found with id " + id));

        form.setRead(formDetails.isRead());
        return contactFormRepository.save(form);  // Güncellenmiş formu kaydet
    }

}

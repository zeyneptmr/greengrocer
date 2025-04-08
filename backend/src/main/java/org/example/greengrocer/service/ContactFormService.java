package org.example.greengrocer.service;

import org.example.greengrocer.model.ContactForm;
import org.example.greengrocer.repository.ContactFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactFormService {

    private final ContactFormRepository contactFormRepository;

    @Autowired
    public ContactFormService(ContactFormRepository contactFormRepository) {
        this.contactFormRepository = contactFormRepository;
    }

    // Yeni formu kaydet
    public void saveContactForm(ContactForm form) {
        contactFormRepository.save(form);
    }

    // Tüm formları getirme (en yeni olanlar önce gelir)
    public List<ContactForm> getAllContactForms() {
        return contactFormRepository.findAllByOrderByTimestampDesc(); // Mesajları timestamp'e göre sıralar
    }

    public List<ContactForm> getUnreadForms() {
        return contactFormRepository.findByIsReadFalse();
    }

    // Formu okundu olarak işaretle
    public ContactForm markAsRead(Long id) {
        ContactForm form = contactFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found with id " + id));  // Exception handling ekledim
        form.setRead(true); // Okundu olarak işaretle
        return contactFormRepository.save(form);  // Güncellenmiş formu kaydet
    }


    // Formu silme
    public String deleteForm(Long id) {
        // Silmeden önce formun var olup olmadığını kontrol et
        if (!contactFormRepository.existsById(id)) {
            throw new RuntimeException("Form not found with id " + id); // Eğer form yoksa hata fırlat
        }
        contactFormRepository.deleteById(id);  // Formu sil
        return "Message deleted successfully.";
    }

    // Formu güncelleme
    public ContactForm updateForm(Long id, ContactForm form) {
        ContactForm existingForm = contactFormRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Form not found"));

        // Güncellenmiş verileri form objesine set et
        existingForm.setName(form.getName());
        existingForm.setSurname(form.getSurname());
        existingForm.setEmail(form.getEmail());
        existingForm.setPhoneNumber(form.getPhoneNumber());
        existingForm.setTopic(form.getTopic());
        existingForm.setMessage(form.getMessage());

        // Güncellenmiş formu kaydet
        return contactFormRepository.save(existingForm);
    }
}

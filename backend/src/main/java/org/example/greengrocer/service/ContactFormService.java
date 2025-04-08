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

    // Okunmamış formları getirme
    public List<ContactForm> getUnreadForms() {
        return contactFormRepository.findByIsRead(false); // 'isRead' false olan mesajları getir
    }

    // Formu okundu olarak işaretle
    public ContactForm markAsRead(Long id, boolean isRead) {
        ContactForm form = contactFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found with id " + id));

        // Okundu olarak işaretleme
        form.setRead(isRead);
        return contactFormRepository.save(form);
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

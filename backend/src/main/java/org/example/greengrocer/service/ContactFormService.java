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

    
    public void saveContactForm(ContactForm form) {
        contactFormRepository.save(form);
    }

    
    public List<ContactForm> getAllContactForms() {
        return contactFormRepository.findAllByOrderByTimestampDesc(); 
    }

    public List<ContactForm> getUnreadForms() {
        return contactFormRepository.findByIsReadFalse();
    }

    
    public ContactForm markAsRead(Long id) {
        ContactForm form = contactFormRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found with id " + id));  
        form.setRead(true); 
        return contactFormRepository.save(form);  
    }


    
    public String deleteForm(Long id) {
    
        if (!contactFormRepository.existsById(id)) {
            throw new RuntimeException("Form not found with id " + id); 
        }
        contactFormRepository.deleteById(id);  
        return "Message deleted successfully.";
    }

    
    public ContactForm updateForm(Long id, ContactForm form) {
        ContactForm existingForm = contactFormRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Form not found"));

    
        existingForm.setName(form.getName());
        existingForm.setSurname(form.getSurname());
        existingForm.setEmail(form.getEmail());
        existingForm.setPhoneNumber(form.getPhoneNumber());
        existingForm.setTopic(form.getTopic());
        existingForm.setMessage(form.getMessage());

    
        return contactFormRepository.save(existingForm);
    }
}

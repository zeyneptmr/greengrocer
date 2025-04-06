package org.example.greengrocer.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardNumberLast4;  // Sadece son 4 hane

    private String holderName;

    private String expiryMonth;

    private String expiryYear;

    @Column(name = "is_default")
    private Boolean isDefault =  false;

    @Column(name = "cvv_encrypted")
    private String cvvEncrypted;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getter - Setter
    public Long getId() {
        return id;
    }

    // Kart numarasının son 4 hanesi
    public String getCardNumberLast4() {
        return cardNumberLast4;
    }

    public void setCardNumberLast4(String cardNumberLast4) {
        this.cardNumberLast4 = cardNumberLast4;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    // Getter ve Setter
    public String getCvvEncrypted() {
        return cvvEncrypted;
    }

    public void setCvvEncrypted(String cvvEncrypted) {
        this.cvvEncrypted = cvvEncrypted;
    }

    public String getExpiryMonth() {
        return expiryMonth;
    }

    public void setExpiryMonth(String expiryMonth) {
        this.expiryMonth = expiryMonth;
    }

    public String getExpiryYear() {
        return expiryYear;
    }

    public void setExpiryYear(String expiryYear) {
        this.expiryYear = expiryYear;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }




}

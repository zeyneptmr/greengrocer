import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';


const AddressPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: 'İstanbul', // İstanbul varsayılan olarak seçili
        district: '',
        neighborhood: '',
        address: '',
        description: ''
    });

    const [addresses, setAddresses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingIndex, setEditingIndex] = useState(null); // For editing

    // İstanbul'un ilçeleri ve mahalleleri
    const cityData = {
        'İstanbul': {
            districts: {
                'Kadıköy': ['Yeldeğirmeni', 'Moda', 'Fenerbahçe', 'Acıbadem', 'Kozyatağı', 'Erenköy', 'Göztepe', 'Bostancı', 'İMES'],
                'Şişli': ['Nişantaşı', 'Teşvikiye', 'Fulya', 'Bomonti', 'Harbiye', 'Istanbul', 'Osmanbey', 'Mecidiyeköy', 'Kuledibi'],
                'Beşiktaş': ['Levent', 'Etiler', 'Arnavutköy', 'Bebek', 'Akatlar', 'Kültür', 'Kruvaziyer', 'Beşiktaş Merkez'],
                'Fatih': ['Süleymaniye', 'Çarşamba', 'Aksaray', 'Emin Ali Paşa', 'Topkapı', 'Beyazıt', 'İskenderpaşa', 'Fener', 'Balat'],
                'Beyoğlu': ['Taksim', 'Beyoğlu', 'Cihangir', 'Galata', 'Karaköy', 'Kurtuluş', 'Pera', 'Asmalımescit'],
                'Üsküdar': ['Bulgurlu', 'Çamlıca', 'Kısıklı', 'Bağlarbaşı', 'Mimar Sinan', 'Alemdağ', 'Cevizlik', 'Kuzguncuk', 'Selimiye'],
                'Pendik': ['Kaynarca', 'İMES', 'Çamçeşme', 'Yunus', 'Şeyhli', 'Pendik Merkez', 'Dumlupınar'],
                'Kartal': ['Huzur', 'Soğanlık', 'Orhantepe', 'Cevizli', 'Petrol', 'Topselvi', 'Yalı', 'Kartal Merkez'],
                'Maltepe': ['Fındıklı', 'Bağlarbaşı', 'Zümrütevler', 'İMES', 'Yalı', 'Cevizli', 'İdealtepe', 'Altıntepe'],
                'Bakırköy': ['Ataköy', 'Şirinevler', 'İncirli', 'Seyrantepe', 'Kartaltepe', 'Cevizlik', 'Bakırköy Merkez'],
                'Avcılar': ['Merkez', 'Ambarlı', 'Denizköşkler', 'Cihangir', 'Ispartakule', 'Tahtakale', 'Küçükçekmece'],
                'Bahçelievler': ['Yeni Bahçelievler', 'Çobançeşme', 'Mevlana', 'Zafer', 'İnönü', 'Mahmutbey', 'Huzur'],
                'Sarıyer': ['Tarabya', 'Büyükdere', 'Kilyos', 'Pınar', 'Yeniköy', 'Ayazağa', 'Huzur', 'İstinye'],
                'Silivri': ['Yeni Mahalle', 'Alipaşa', 'Gümüşyaka', 'Selimpaşa', 'Değirmenköy', 'Kınalı', 'Beylikdüzü'],
                'Zeytinburnu': ['Merkezefendi', 'Kazlıçeşme', 'Süleymaniye', 'Cevizlibağ', 'Adalet', 'Beştelsiz', 'Kocatepe'],
                'Başakşehir': ['Bahçeşehir', 'İkitelli', 'Kayabaşı', 'Ziya Gökalp', 'Sultangazi', 'Başakşehir Merkez'],
                'Esenyurt': ['İncirtepe', 'Piri Mehmet Paşa', 'Kıraç', 'Saadetdere', 'Fatih', 'Mimarsinan', 'Yeşilkent'],
                'Arnavutköy': ['Yassıören', 'İstanbul Havaalanı', 'Kınalı', 'Boğazköy', 'İslambey', 'Arnavutköy Merkez'],
                'Büyükçekmece': ['Kamiloba', 'İstanbul', 'Mimarsinan', 'Halkalı', 'Gölcük', 'Büyükçekmece Merkez'],
                'Çatalca': ['Merkez', 'Haramidere', 'Olimpiyat', 'Durusu', 'Atatürk', 'Kestanelik'],
                'Sultanbeyli': ['Selçuk', 'Yenidoğan', 'Fatih', 'Huzur', 'Mevlana', 'Cumhuriyet'],
                'Şile': ['Büyükada', 'Kavaklı', 'Ulupelit', 'Ayazma', 'Yazlık', 'Şile Merkez'],
                'Beylikdüzü': ['Barış', 'Cumhuriyet', 'Yakuplu', 'Beylikdüzü Merkez', 'Gürpınar'],
                'Çekmeköy': ['Seyir Terası', 'Mevlana', 'Mimar Sinan', 'Altınşehir', 'Huzur', 'Alemdağ'],
                'Esenler': ['Oruç Reis', 'Huzur', 'Yeni Mahalle', 'Fevzi Çakmak', 'Mimar Sinan', 'Kayabaşı'],
                'Güngören': ['Haznedar', 'Kuştepe', 'Merkez', 'Yeni Mahalle', 'Güngören Merkez'],
                'Kağıthane': ['Merkez', 'Gültepe', 'İstanbul', 'Mevlana', 'Mecidiyeköy', 'Davutpaşa'],
                'Beykoz': ['Beykoz Merkez', 'Riva', 'Çubuklu', 'Kavacık', 'Paşabahçe', 'Anadolufeneri'],
                'Bağcılar': ['Kirazlı', 'Mahmutbey', 'Güneşli', 'Yavuz Selim', 'Süleymaniye', 'Çınar'],
            }
        }
    };

    console.log(window.location.pathname);

    useEffect(() => {
        const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
        setAddresses(savedAddresses);
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.includes('@')) {
            newErrors.emailError = 'Geçerli bir e-posta girin.';
        }
        if (!formData.phone.match(/^\d{10}$/)) {
            newErrors.phoneError = 'Telefon numarasını 10 haneli girin.';
        }
        if (!/^[A-Za-zçÇğĞıİöÖşŞüÜ]+$/.test(formData.firstName)) {
            newErrors.firstNameError = 'İsim sadece harflerden oluşmalı.';
        }
        if (!/^[A-Za-zçÇğĞıİöÖşŞüÜ]+$/.test(formData.lastName)) {
            newErrors.lastNameError = 'Soyisim sadece harflerden oluşmalı.';
        }
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePhoneChange = (e) => {
        let formattedPhone = e.target.value.replace(/[^\d]/g, '');
        if (formattedPhone.length > 10) {
            formattedPhone = formattedPhone.slice(0, 10);
        }
        setFormData({
            ...formData,
            phone: formattedPhone
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            const updatedAddresses = [...addresses];
            if (editingIndex !== null) {
                updatedAddresses[editingIndex] = formData; // Update the existing address
            } else {
                updatedAddresses.push(formData); // Add new address
            }
            setAddresses(updatedAddresses);
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses));

            console.log('Updated addresses saved to localStorage:', JSON.parse(localStorage.getItem('addresses')));

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                city: 'İstanbul', // Reset to default city
                district: '',
                neighborhood: '',
                address: '',
                description: ''
            });
            setEditingIndex(null); // Reset editing index
            setIsFormVisible(false);
        } else {
            setErrors(validationErrors);
        }
    };

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
        if (isFormVisible) {
            // Eğer form kapanıyorsa, formu sıfırla
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                city: 'İstanbul',
                district: '',
                neighborhood: '',
                address: '',
                description: ''
            });
            setEditingIndex(null);
        }
    };

    const handleEdit = (index) => {
        setFormData(addresses[index]);
        setEditingIndex(index);
        setIsFormVisible(true); // Open the form for editing
    };

    const handleDelete = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    };

    const handleCityChange = (e) => {
        setFormData({
            ...formData,
            city: e.target.value,
            district: '', // Reset district and neighborhood when city changes
            neighborhood: ''
        });
    };

    const handleDistrictChange = (e) => {
        setFormData({
            ...formData,
            district: e.target.value,
            neighborhood: '' // Reset neighborhood when district changes
        });
    };

    return (
        <div className="container mx-auto p-8">
            <button
                onClick={toggleForm}
                className="mb-4 p-3 bg-green-500 text-white rounded text-xl"
            >
                + Add New Address
            </button>

            {isFormVisible && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center relative w-[600px] border-2 border-orange-500">
                        <button
                            className="absolute top-2 right-2 border-none bg-transparent cursor-pointer text-3xl"
                            onClick={toggleForm}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-2xl mb-6">{editingIndex !== null ? 'Edit Address' : 'New Address'}</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    className="p-3 border border-gray-300 rounded text-lg w-full"
                                    required
                                />
                                {errors.firstNameError && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstNameError}</p>
                                )}
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Surname"
                                    className="p-3 border border-gray-300 rounded text-lg"
                                    required
                                />
                                {errors.lastNameError && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastNameError}</p>
                                )}
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="E-mail"
                                    className={`p-3 border border-gray-300 rounded text-lg ${errors.emailError ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.emailError && (
                                    <p className="text-red-500 text-sm mt-1">{errors.emailError}</p>
                                )}
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    placeholder="Phone Number"
                                    className={`p-3 border border-gray-300 rounded text-lg ${errors.phoneError ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phoneError}</p>
                                )}
                                <input
                                    type="text"
                                    name="city"
                                    value="İstanbul"
                                    className="p-3 border border-gray-300 rounded text-lg bg-white"
                                    readOnly
                                />

                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleDistrictChange}
                                    className="p-3 border border-gray-300 rounded text-lg"
                                    required
                                >
                                    <option value="">İlçe Seçin</option>
                                    {Object.keys(cityData['İstanbul'].districts).map((district) => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                                <select
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleInputChange}
                                    className="p-3 border border-gray-300 rounded text-lg"
                                    required
                                >
                                    <option value="">Mahalle Seçin</option>
                                    {formData.district &&
                                        cityData['İstanbul'].districts[formData.district].map((neighborhood, index) => (
                                            <option key={index} value={neighborhood}>{neighborhood}</option>
                                        ))}
                                </select>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className="p-3 border border-gray-300 rounded col-span-2 text-lg"
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Notes"
                                    className="p-3 border border-gray-300 rounded col-span-2 text-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-6 p-3 bg-green-600 text-white rounded text-xl"
                            >
                                {editingIndex !== null ? 'Update' : 'Save'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-2xl">Saved Addresses</h2>
                {addresses.length === 0 ? (
                    <p> No address saved yet </p>
                ) : (
                    <ul className="mt-6">
                        {addresses.map((address, index) => (
                            <li key={index} className="p-6 border border-gray-300 rounded mb-4">
                                <p><strong>Receiver:</strong> {address.firstName} {address.lastName}</p>
                                <p><strong>E-mail:</strong> {address.email}</p>
                                <p><strong>Phone Number:</strong> {address.phone}</p>
                                <p><strong>Address:</strong> {address.address}, {address.neighborhood}, {address.district}, {address.city}</p>
                                <p><strong>Notes:</strong> {address.description}</p>
                                <button
                                    className="mt-2 p-2 bg-green-moss text-white rounded w-1/6 "
                                    onClick={() => handleEdit(index)}
                                >
                                    <span>Edit</span> {/* Edit metni */}
                                </button>
                                <button
                                    className="mt-2 ml-4 p-2 bg-orange-tangerine text-white rounded w-1/8 justify-center items-center"
                                    onClick={() => handleDelete(index)}
                                >
                                    <FaTrash size={15} /> {/* İkonun boyutunu ayarlayabilirsiniz */}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddressPage;
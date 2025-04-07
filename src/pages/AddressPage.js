import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import {FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const AddressPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

    const [successMessage, setSuccessMessage] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [editingIndex, setEditingIndex] = useState(null); // For editing
    const [error, setError] = useState("");


    const cityData = {
        'İstanbul': {
            districts: {
                'Kadıköy': ['Yeldeğirmeni', 'Moda', 'Fenerbahçe', 'Acıbadem', 'Kozyatağı', 'Erenköy', 'Göztepe', 'Bostancı', 'İMES'],
                'Eyüp': ['Alibeyköy', 'Güzeltepe', 'Çırçır', 'Defterdar', 'Emniyettepe', 'Göktürk', 'İslambey', 'Kemerburgaz', 'Muratpaşa', 'Silahtarağa'],
                'Şişli': ['Nişantaşı', 'Teşvikiye', 'Fulya', 'Bomonti', 'Harbiye', 'Istanbul', 'Osmanbey', 'Mecidiyeköy', 'Kuledibi'],
                'Beşiktaş': ['Levent', 'Etiler', 'Arnavutköy', 'Bebek', 'Akatlar', 'Kültür', 'Kruvaziyer', 'Beşiktaş Merkez'],
                'Fatih': [ 'Şehremini','Süleymaniye', 'Çarşamba', 'Aksaray', 'Emin Ali Paşa', 'Topkapı', 'Beyazıt', 'İskenderpaşa', 'Fener', 'Balat'],
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
                'Sultanbeyli': ['Selçuk', 'Yenidoğan', 'Fatih', 'Huzur', 'Mevlana', 'Cumhuriyet' ],
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

    // Adresleri backend'den çekiyoruz
    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/addresses', {
                withCredentials: true,  // Cookie'leri gönder
            });
            setAddresses(response.data);
        } catch (error) {
            console.error('Error while fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);


    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.includes('@')) {
            newErrors.emailError = 'Enter an valid e-mail.';
        }
        if (!formData.phone.match(/^\d{3} \d{3} \d{4}$/)) {
            newErrors.phoneError = 'Enter an valid phone number (555 555 5555).';
        }
        if (!/^[A-Za-zçÇğĞıİöÖşŞüÜ\s]+$/.test(formData.firstName)) {
            newErrors.firstNameError = 'Enter valid name';
        }
        if (!/^[A-Za-zçÇğĞıİöÖşŞüÜ\s]+$/.test(formData.lastName)) {
            newErrors.lastNameError = 'Enter valid surname';
        }
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "firstName" || name === "lastName") {
            newValue = newValue.replace(/[^A-Za-zçÇğĞıİöÖşŞüÜ\s]/g, '');
        }

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handlePhoneChange = (e) => {
        let numbers = e.target.value.replace(/\D/g, '');
        if (numbers.length > 10) numbers = numbers.slice(0, 10);

        let formattedPhone = "";
        if (numbers.length > 6) {
            formattedPhone = `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
        } else if (numbers.length > 3) {
            formattedPhone = `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
        } else {
            formattedPhone = numbers;
        }

        setFormData({
            ...formData,
            phone: formattedPhone
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            try {
                if (editingIndex !== null && editingIndex !== undefined) {
                    // Adres güncelleniyor
                    const addressId = addresses[editingIndex]?.id;
                    if (!addressId) {
                        console.error("Address ID is undefined");
                        return;
                    }

                    await axios.put(`http://localhost:8080/api/addresses/${addressId}`, formData, {
                        withCredentials: true,
                    });

                } else {
                    // Yeni adres ekleniyor
                    await axios.post('http://localhost:8080/api/addresses', formData, {
                        withCredentials: true,
                    });
                }

                await fetchAddresses(); // 🔄 Yalnızca bu, yeterli

                // Formu sıfırla
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
                setIsFormVisible(false);

            } catch (error) {
                console.error('Error while adding/updating address:', error);
                console.log(error.response?.data);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
        if (isFormVisible) {
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
        console.log("Editing address at index:", index);  // Burada index'in doğru olduğunu kontrol edin.
        setFormData(addresses[index]);
        setEditingIndex(index);
        setIsFormVisible(true); // Open the form for editing
    };

    const handleDelete = async (index) => {
        const address = addresses[index];

        if (address.isDefault) {
            setTimeout(() => setError(""), 3000);
            setError("Default address cannot be deleted. Please make another address the default first.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/addresses/${address.id}`, {
                withCredentials: true,  // Token'ı içeren cookie'yi gönder
            });

            const updatedAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(updatedAddresses);
            setSuccessMessage("Address deleted in success.");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error('Error while deleting address:', error);
            //setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        }

    };

    const handleSetDefault = async (addressId) => {
        try {
            // Sadece id’yi gönderiyoruz
            const response = await axios.put(
                'http://localhost:8080/api/addresses/default',
                { id: addressId },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setAddresses(addresses.map(addr =>
                    addr.id === addressId ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
                ));
            }
        } catch (error) {
            console.error('Error while setting default address:', error);
        }
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
                className="mb-4 p-3 bg-green-500 text-white rounded text-xl w-full sm:w-auto"
            >
                + Add New Address
            </button>

            {successMessage && (
                <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-xl mb-6 text-center font-medium">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6 text-center font-medium">
                    {error}
                </div>
            )}

            {isFormVisible && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div
                        className="bg-white p-8 rounded-lg text-center relative w-full max-w-[600px] border-2 border-orange-500">
                        <button
                            className="absolute top-2 right-2 border-none bg-transparent cursor-pointer text-3xl"
                            onClick={toggleForm}
                        >
                            &times;
                        </button>
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-2xl mb-6">{editingIndex !== null ? 'Edit Address' : 'New Address'}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                    className="p-3 border border-gray-300 rounded text-lg w-full"
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
                                    className={`p-3 border border-gray-300 rounded text-lg w-full ${errors.emailError ? 'border-red-500' : ''}`}
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
                                    className={`p-3 border border-gray-300 rounded text-lg w-full ${errors.phoneError ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phoneError}</p>
                                )}
                                <input
                                    type="text"
                                    name="city"
                                    value="İstanbul"
                                    className="p-3 border border-gray-300 rounded text-lg bg-white w-full"
                                    readOnly
                                />

                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleDistrictChange}
                                    className="p-3 border border-gray-300 rounded text-lg w-full"
                                    required
                                >
                                    <option value="">District</option>
                                    {Object.keys(cityData['İstanbul'].districts).map((district) => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                                <select
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleInputChange}
                                    className="p-3 border border-gray-300 rounded text-lg w-full"
                                    required
                                >
                                    <option value="">Neighbourhood</option>
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
                                    className="p-3 border border-gray-300 rounded col-span-2 text-lg w-full"
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Notes"
                                    className="p-3 border border-gray-300 rounded col-span-2 text-lg w-full"
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-6 p-3 bg-green-600 text-white rounded text-xl w-full"
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

                                {address.isDefault && (
                                    <div className="text-green-600 ml-2 font-medium">
                                        (Default Address)
                                    </div>
                                )}
                                <FaCheckCircle
                                    style={{ cursor: 'pointer', color: address.isDefault ? 'green' : 'gray' }}
                                    onClick={() => handleSetDefault(address.id)}
                                />

                                <p><strong>Receiver:</strong> {address.firstName} {address.lastName}</p>
                                <p><strong>E-mail:</strong> {address.email}</p>
                                <p><strong>Phone Number:</strong> {address.phone}</p>
                                <p>
                                    <strong>Address:</strong> {address.address}, {address.neighborhood}, {address.district}, {address.city}
                                </p>
                                <p><strong>Notes:</strong> {address.description}</p>

                                <button
                                    className="mt-2 p-2 bg-green-moss text-white rounded w-full sm:w-auto"
                                    onClick={() => handleEdit(index)}
                                >
                                    <span>Edit</span>

                                </button>
                                <button
                                    className="mt-2 ml-4 p-2 bg-orange-tangerine text-white rounded w-full sm:w-auto justify-center items-center"
                                    onClick={() => handleDelete(index)}
                                >
                                    <FaTrash size={15}/>
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
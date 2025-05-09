import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logoyazısız.jpeg'; 


export const generateInvoice = (orderData) => {
    const doc = new jsPDF();

    const green = '#2e7d32';
    const orange = '#fb8c00';
    const lightGray = '#f2f2f2';

    const translations = {
        en: {
            customer: "Customer",
            phone: "Phone",
            email: "Email",
            address: "Address",
            orderId: "Order ID",
            orderDate: "Order Date",
            invoiceNo: "Invoice No",
            invoiceDate: "Invoice Date",
            paymentMethod: "Payment Method",
            shipmentDate: "Shipment Date",
            shippingFee: "Shipping Fee",
            taxOffice: "Tax Office",
            no: "No",
            description: "Description",
            quantity: "Quantity",
            unitPrice: "Unit Price",
            total: "Total",
            productTotal: "Product Total",
            totalAmount: "Total Amount",
            eInvoice: "E-INVOICE",
            companyName: "TapTaze Company",
            companyAddress: "Address: Cibali, Fatih/Istanbul",
            companyTaxOffice: "Tax Office: Fatih Tax Office",
            disclaimer: "This sale has been made online.\nDelivered electronically as part of e-Archive permission.\nFor product complaints, support, and requests, you can submit them via the Contact Form on our website."
        },
        tr: {
            customer: "Ad Soyad",
            phone: "Telefon",
            email: "E-posta",
            address: "Adres",
            orderId: "Siparis No",
            orderDate: "Siparis Tarihi",
            invoiceNo: "Fatura No",
            invoiceDate: "Fatura Tarihi",
            paymentMethod: "Ödeme Yöntemi",
            shipmentDate: "Teslimat",
            shippingFee: "Kargo Ücreti",
            taxOffice: "Vergi Dairesi",
            no: "No",
            description: "Ürün",
            quantity: "Adet",
            unitPrice: "Birim Fiyat",
            total: "Toplam",
            productTotal: "Ürün Toplam",
            totalAmount: "Genel Toplam",
            eInvoice: "E-FATURA",
            companyName: "TapTaze",
            companyAddress: "Adres: Cibali, Fatih/Istanbul",
            companyTaxOffice: "Vergi Dairesi: Fatih Vergi Dairesi",
            disclaimer: "Bu belge cevirmici düzenlenmistir.\nElektronik arsiv izni kapsaminda elektronik ortamda teslim edilmistir.\nUrun sikayetleri, destek ve talepler icin web sitemizdeki Iletisim Formu'nu kullanabilirsiniz."
        }
    };

    const t = translations[orderData.language || 'en'];

    doc.setFont("helvetica");  

    const img = new Image();
    img.src = logo;

    img.onload = () => {

        doc.addImage(img, 'JPEG', 14, 10, 30, 30);

        doc.setFontSize(24);
        doc.setTextColor(green);
        doc.text(t.eInvoice, 105, 50, {align: 'center'});  

        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(t.companyName,150, 15);
        doc.text(t.companyAddress, 150, 21);
        doc.text(t.companyTaxOffice, 150, 27);

        const addressParts = orderData.address.split(',').map(part => part.trim());
        const middleValues = addressParts.slice(1, 3);  

        const buyerInfo = [
            [t.customer + ':', `${orderData.userName} ${orderData.userSurname}`],
            [t.phone + ':' , orderData.userPhoneNumber || 'N/A'],
            [t.email + ':' , orderData.userEmail],
            [t.address + ':' , middleValues.join(', ')],
            [t.orderId + ':' , orderData.orderId],
            [t.orderDate + ':' , new Date(orderData.orderDate).toLocaleString()],
        ];

        const companyInfo = [
            [t.invoiceNo + ':' , orderData.invoiceNo || 'INV-' + orderData.orderId],
            [t.invoiceDate + ':', new Date().toLocaleString()],
            [t.paymentMethod + ':' , orderData.paymentMethod || 'Online'],
            [t.shipmentDate + ':' , orderData.shipmentDate || 'N/A'],
            [t.shippingFee + ':' , `${(orderData.shippingFee ?? 0).toFixed(2)} TL`],
            [t.taxOffice + ':' , 'Fatih Tax Office'],
        ];

        autoTable(doc, {
            startY: 60,
            head: [],
            body: buyerInfo.map((row, i) => [row[0], row[1], companyInfo[i][0], companyInfo[i][1]]),
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } },
            margin: { left: 14, right: 14 },
        });

        const itemRows = orderData.items.map((item, index) => {
            const total = item.price * item.quantity;
            return [
                index + 1,
                item.name,
                `${item.quantity} pcs`,
                `${(item.price ?? 0).toFixed(2)} TL`,
                `${total.toFixed(2)} TL`,
            ];
        });

        autoTable(doc, {
            head: [[t.no, t.description, t.quantity, t.unitPrice, t.total]],
            body: itemRows,
            startY: doc.lastAutoTable.finalY + 10,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [34, 139, 87], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 14, right: 14 },
        });


        const subtotal = orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        autoTable(doc, {
            body: [
                [t.productTotal, `${subtotal.toFixed(2)} TL`],
                [t.shippingFee, `${(orderData.shippingFee ?? 0).toFixed(2)} TL`],
                [t.totalAmount, `${(orderData.totalAmount ?? 0).toFixed(2)} TL`],
            ],
            startY: doc.lastAutoTable.finalY + 5,
            theme: 'plain',
            styles: { fontSize: 11 },
            columnStyles: {
                0: { fontStyle: 'bold', halign: 'right' },
                1: { halign: 'right' },
            },
            margin: { left: 100 },
        });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
            t.disclaimer,
            14,
            doc.lastAutoTable.finalY + 20
        );

        doc.save(`${orderData.orderId}.pdf`);
    };
};

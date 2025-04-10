import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logoyazısız.jpeg'; // Kendi logo yolunu buraya yaz

export const generateInvoice = (orderData) => {
    const doc = new jsPDF();

    // Renkler
    const green = '#2e7d32';
    const orange = '#fb8c00';
    const lightGray = '#f2f2f2';

    // Yazı Tipi
    doc.setFont("helvetica");  // Modern ve şık bir font

    // Logo yüklemesi
    const img = new Image();
    img.src = logo;

    img.onload = () => {
        // Logo sol tarafta
        doc.addImage(img, 'JPEG', 14, 10, 30, 30);

        // Başlık (Ortalı ve üstte)
        doc.setFontSize(24);
        doc.setTextColor(green);
        doc.text("E-INVOICE", 105, 50, {align: 'center'});  // Başlık biraz daha aşağı alındı

        // Şirket Bilgileri (Sağda)
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text('TapTaze Company ', 150, 15);
        doc.text('Address: Cibali, Fatih/Istanbul', 150, 21);
        doc.text('Tax Office: Fatih Tax Office ', 150, 27);

        // Buyer & Order Details (Üst Bölüm)
        const buyerInfo = [
            ['Customer:', orderData.userName],
            ['Address:', orderData.address],
            ['Email:', orderData.userEmail],
            ['Order ID:', orderData.orderId],
            ['Order Date:', new Date(orderData.orderDate).toLocaleDateString()],
        ];

        const companyInfo = [
            ['Invoice No:', orderData.invoiceNo],
            ['Invoice Date:', new Date().toLocaleDateString()],
            ['Payment Method:', orderData.paymentMethod || 'Online'],
            ['Shipment Date:', orderData.shipmentDate || 'N/A'],
            ['Tax Office:', 'Fatih Tax Office'],
        ];

        // Buyer & Company Info (Yan Yana)
        autoTable(doc, {
            startY: 60,  // Başlık biraz daha aşağı alındığı için bu kısımdaki startY değeri de yukarı alındı
            head: [],
            body: buyerInfo.map((row, i) => [row[0], row[1], companyInfo[i][0], companyInfo[i][1]]),
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } },
            margin: { left: 14, right: 14 },
        });

        // Ürün Tablosu
        const itemRows = orderData.items.map((item, index) => {
            const total = item.price * item.quantity ;
            return [
                index + 1,
                item.name,
                `${item.quantity} pcs`,
                `${item.price.toFixed(2)} TL`,
                '20%',
                `${total.toFixed(2)} TL`,
            ];
        });

        autoTable(doc, {
            head: [['No', 'Description', 'Quantity', 'Unit Price', 'Total']],
            body: itemRows,
            startY: doc.lastAutoTable.finalY + 10,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [34, 139, 87], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { left: 14, right: 14 },
        });

        // Summary Table
        const subtotal = orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const total = subtotal;

        autoTable(doc, {
            body: [
                ['Subtotal', `${subtotal.toFixed(2)} TL`],
                ['Discount', '0.00 TL'],
                ['Total', `${total.toFixed(2)} TL`],
                ['Amount to be Paid', `${total.toFixed(2)} TL`],
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

        // Alt not
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
            'This sale has been made online.\nDelivered electronically as part of e-Archive permission.\nFor product complaints, support, and requests, you can submit them via the Contact Form on our website.',
            14,
            doc.lastAutoTable.finalY + 20
        );

        doc.save('invoice.pdf');
    };
};

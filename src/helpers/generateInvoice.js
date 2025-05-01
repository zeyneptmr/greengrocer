import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logoyazısız.jpeg'; // Kendi logo yolunu buraya yaz

export const generateInvoice = (orderData) => {
    const doc = new jsPDF();

    const green = '#2e7d32';
    const orange = '#fb8c00';
    const lightGray = '#f2f2f2';

    doc.setFont("helvetica");  // Modern ve şık bir font

    const img = new Image();
    img.src = logo;

    img.onload = () => {

        doc.addImage(img, 'JPEG', 14, 10, 30, 30);

        doc.setFontSize(24);
        doc.setTextColor(green);
        doc.text("E-INVOICE", 105, 50, {align: 'center'});  // Başlık biraz daha aşağı alındı

        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text('TapTaze Company ', 150, 15);
        doc.text('Address: Cibali, Fatih/Istanbul', 150, 21);
        doc.text('Tax Office: Fatih Tax Office ', 150, 27);

        const addressParts = orderData.address.split(',').map(part => part.trim());
        const middleValues = addressParts.slice(1, 3);  // Ortadaki 2 veri

        const buyerInfo = [
            ['Customer:', `${orderData.userName} ${orderData.userSurname}`],
            ['Phone:', orderData.userPhoneNumber || 'N/A'],
            ['Email:', orderData.userEmail],
            ['Address:', middleValues.join(', ')],
            ['Order ID:', orderData.orderId],
            ['Order Date:', new Date(orderData.orderDate).toLocaleString()],
        ];

        const companyInfo = [
            ['Invoice No:', orderData.invoiceNo || 'INV-' + orderData.orderId],
            ['Invoice Date:', new Date().toLocaleString()],
            ['Payment Method:', orderData.paymentMethod || 'Online'],
            ['Shipment Date:', orderData.shipmentDate || 'N/A'],
            ['Shipping Fee:', `${(orderData.shippingFee ?? 0).toFixed(2)} TL`],
            ['Tax Office:', 'Fatih Tax Office'],
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
            head: [['No', 'Description', 'Quantity', 'Unit Price', 'Total']],
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
                ['Product Total', `${subtotal.toFixed(2)} TL`],
                ['Shipping Fee', `${(orderData.shippingFee ?? 0).toFixed(2)} TL`],
                ['Total Amount', `${(orderData.totalAmount ?? 0).toFixed(2)} TL`],
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
            'This sale has been made online.\nDelivered electronically as part of e-Archive permission.\nFor product complaints, support, and requests, you can submit them via the Contact Form on our website.',
            14,
            doc.lastAutoTable.finalY + 20
        );

        doc.save(`${orderData.orderId}.pdf`);
    };
};

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (orderData) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("ZEYNEP", 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${orderData.orderId}`, 14, 32);
    doc.text(`Customer: ${orderData.customerName}`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);



    const tableData = orderData.items.map((item) => [
        item.name,
        item.quantity,
        `${item.price} TL`,
        `${item.price * item.quantity} TL`,
    ]);

    autoTable(doc, {
        head: [["Product", "Quantity", "Unit Price", "Total"]],
        body: tableData,
        startY: 60,
    });

    doc.text(`Total Amount: ${orderData.totalAmount} TL`, 14, doc.lastAutoTable.finalY + 10);

    doc.save("invoice.pdf");
};

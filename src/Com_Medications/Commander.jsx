import React from 'react';
import '../css/Commander.css';

export default function Commander({ cartItems, subtotal, onClose }) {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div className="commander-modal">
      <div className="commander-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="invoice-header">
          <h2>فاتورة الشراء</h2>
          <div className="invoice-info">
            <p>التاريخ: {currentDate}</p>
            <p>رقم الفاتورة: #{Math.floor(Math.random() * 10000)}</p>
          </div>
        </div>
        
        <div className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.times}</td>
                  <td>{item.price} Dhs</td>
                  <td>{(item.price * item.times).toFixed(2)} Dhs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="invoice-summary">
          <div className="summary-row">
            <span>المجموع الجزئي:</span>
            <span>{subtotal.toFixed(2) - 30} Dhs</span>
          </div>
          
          <div className="summary-row total">
            <span>المجموع الكلي:</span>
            <span>{(subtotal).toFixed(2)} Dhs</span>
          </div>
        </div>
        
        <div className="invoice-actions">
          <button className="print-btn" onClick={() => window.print()}>طباعة الفاتورة</button>
          <button className="close-invoice-btn" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}
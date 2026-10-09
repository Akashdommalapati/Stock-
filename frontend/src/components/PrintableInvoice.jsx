import React from 'react';
import { Printer, X } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function PrintableInvoice({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 lg:p-8 space-y-6 my-8">
        {/* Modal Controls (No Print) */}
        <div className="flex items-center justify-between border-b pb-4 no-print">
          <h3 className="text-lg font-bold text-slate-900">Sales Order Invoice</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div id="printable-invoice" className="space-y-6 text-slate-900">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-black text-amber-600 tracking-wide uppercase">
                GODOWN BEVERAGES & DISTRIBUTORS
              </h1>
              <p className="text-xs text-slate-600 font-medium">Main Wholesale Depot & Stock Agency</p>
              <p className="text-xs text-slate-500 mt-1">Andhra Pradesh, India | Phone: +91 98480 12345</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                ORIGINAL INVOICE
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-2">{order.orderNumber}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Date: {formatDate(order.orderDate)}
              </p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billed To (Agency):</p>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{order.customerName}</h3>
              <p className="text-xs text-slate-600">{order.town}</p>
              {order.customer?.phone && (
                <p className="text-xs text-slate-500">Ph: {order.customer.phone}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Status:</p>
              <p className="text-xs font-bold text-emerald-600 uppercase mt-0.5">COMPLETED / DELIVERED</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Flavor & Bottle Size</th>
                <th className="py-2.5 px-2 text-right">Price / Case</th>
                <th className="py-2.5 px-2 text-right">Cases</th>
                <th className="py-2.5 px-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-2 text-xs font-semibold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-2 font-bold text-slate-800">
                    {item.flavor} <span className="text-xs font-normal text-slate-500">({item.bottleSize})</span>
                  </td>
                  <td className="py-3 px-2 text-right font-medium text-slate-600">
                    {formatCurrency(item.sellingPrice)}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">{item.cases}</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-start">
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Total Items: {order.items.length}</p>
              <p>Thank you for your business!</p>
            </div>
            <div className="w-64 space-y-2 text-right">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Total Cases Sold:</span>
                <span className="font-bold text-slate-900">{order.totalCases} Cases</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t pt-2">
                <span>Grand Total:</span>
                <span className="text-amber-600">{formatCurrency(order.totalBill)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-8 flex justify-between items-end text-xs text-slate-400">
            <p>Authorized Representative Signature</p>
            <p className="font-bold text-slate-600">For GODOWN DISTRIBUTORS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

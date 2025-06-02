
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { PlusIcon } from '../constants';

interface SalesScreenProps {
  products: Product[];
  sales: Sale[];
  recordSale: (saleData: Omit<Sale, 'id' | 'date' | 'productName' | 'purchasePriceAtSale'> & { productId: string }) => void;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'});
};

const SalesScreen: React.FC<SalesScreenProps> = ({ products, sales, recordSale }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantitySold, setQuantitySold] = useState<string>('');

  const availableProducts = products.filter(p => p.quantity > 0);
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantitySold) {
      alert('Selecione um produto e informe a quantidade.');
      return;
    }
    const product = products.find(p => p.id === selectedProductId);
    if (!product) {
      alert('Produto não encontrado.');
      return;
    }
    const qty = parseInt(quantitySold, 10);
    if (qty <= 0) {
      alert('Quantidade deve ser maior que zero.');
      return;
    }
    if (qty > product.quantity) {
      alert(`Quantidade insuficiente em estoque. Disponível: ${product.quantity}`);
      return;
    }

    recordSale({
      productId: selectedProductId,
      quantitySold: qty,
      unitPrice: product.sellingPrice,
      totalAmount: product.sellingPrice * qty,
    });

    setSelectedProductId('');
    setQuantitySold('');
  };
  
  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-semibold text-slate-100">Registro de Vendas</h2>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-xl font-medium text-slate-200 mb-2">Registrar Nova Venda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100"
          >
            <option value="">Selecione um Produto</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} (Estoque: {product.quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantidade Vendida"
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            min="1"
            max={selectedProduct?.quantity}
            required
            className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400"
          />
        </div>
        {selectedProduct && quantitySold && (
          <div className="p-3 bg-slate-700/50 rounded-md text-slate-300">
            Total da Venda: {formatCurrency(selectedProduct.sellingPrice * parseInt(quantitySold || '0', 10))}
          </div>
        )}
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold p-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2">
          {PlusIcon}
          <span>Registrar Venda</span>
        </button>
      </form>

      <div className="bg-slate-800 p-1 rounded-xl shadow-lg">
        <h3 className="text-xl font-medium text-slate-200 p-4">Histórico de Vendas</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 text-slate-400 font-semibold">Data</th>
                <th className="p-4 text-slate-400 font-semibold">Produto</th>
                <th className="p-4 text-slate-400 font-semibold">Qtd.</th>
                <th className="p-4 text-slate-400 font-semibold">Preço Unit.</th>
                <th className="p-4 text-slate-400 font-semibold">Total Venda</th>
              </tr>
            </thead>
            <tbody>
              {sortedSales.length === 0 && (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">Nenhuma venda registrada.</td></tr>
              )}
              {sortedSales.map((sale) => (
                <tr key={sale.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-slate-300">{formatDate(sale.date)}</td>
                  <td className="p-4 text-slate-200">{sale.productName}</td>
                  <td className="p-4 text-slate-200">{sale.quantitySold}</td>
                  <td className="p-4 text-slate-200">{formatCurrency(sale.unitPrice)}</td>
                  <td className="p-4 text-emerald-400 font-semibold">{formatCurrency(sale.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesScreen;
    
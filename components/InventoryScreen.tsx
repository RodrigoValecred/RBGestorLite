
import React, { useState } from 'react';
import { Product } from '../types.ts';
import { PlusIcon, TrashIcon } from '../constants.tsx';

interface InventoryScreenProps {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'addedDate'>) => void;
  addStock: (productId: string, quantity: number) => void;
  removeProduct: (productId: string) => void;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const InventoryScreen: React.FC<InventoryScreenProps> = ({ products, addProduct, addStock, removeProduct }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockToAdd, setStockToAdd] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity || !purchasePrice || !sellingPrice) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    addProduct({
      name,
      quantity: parseInt(quantity, 10),
      purchasePrice: parseFloat(purchasePrice),
      sellingPrice: parseFloat(sellingPrice),
    });
    setName('');
    setQuantity('');
    setPurchasePrice('');
    setSellingPrice('');
  };

  const handleAddStock = (productId: string) => {
    const amount = parseInt(stockToAdd[productId] || '0', 10);
    if (amount > 0) {
      addStock(productId, amount);
      setStockToAdd(prev => ({ ...prev, [productId]: '' }));
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-semibold text-slate-100">Controle de Estoque</h2>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-xl font-medium text-slate-200 mb-2">Adicionar Novo Produto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nome do Produto" value={name} onChange={(e) => setName(e.target.value)} required className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400" />
          <input type="number" placeholder="Quantidade Inicial" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" required className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400" />
          <input type="number" placeholder="Preço de Compra (R$)" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} min="0" step="0.01" required className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400" />
          <input type="number" placeholder="Preço de Venda (R$)" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} min="0" step="0.01" required className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400" />
        </div>
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold p-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2">
          {PlusIcon}
          <span>Adicionar Produto</span>
        </button>
      </form>

      <div className="bg-slate-800 p-1 rounded-xl shadow-lg">
        <h3 className="text-xl font-medium text-slate-200 p-4">Lista de Produtos</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 text-slate-400 font-semibold">Nome</th>
                <th className="p-4 text-slate-400 font-semibold">Quantidade</th>
                <th className="p-4 text-slate-400 font-semibold">Preço Compra</th>
                <th className="p-4 text-slate-400 font-semibold">Preço Venda</th>
                <th className="p-4 text-slate-400 font-semibold text-center">Adicionar Estoque</th>
                <th className="p-4 text-slate-400 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-slate-500">Nenhum produto cadastrado.</td></tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-slate-200">{product.name}</td>
                  <td className={`p-4 ${product.quantity <= 5 ? 'text-red-400 font-bold' : 'text-slate-200'}`}>{product.quantity}</td>
                  <td className="p-4 text-slate-200">{formatCurrency(product.purchasePrice)}</td>
                  <td className="p-4 text-slate-200">{formatCurrency(product.sellingPrice)}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <input 
                        type="number" 
                        min="1" 
                        value={stockToAdd[product.id] || ''}
                        onChange={(e) => setStockToAdd(prev => ({ ...prev, [product.id]: e.target.value }))}
                        className="p-2 bg-slate-700 rounded-md w-20 text-center focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Qtd."
                      />
                      <button onClick={() => handleAddStock(product.id)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
                        {PlusIcon}
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => window.confirm(`Tem certeza que deseja remover "${product.name}"? Esta ação não pode ser desfeita.`) && removeProduct(product.id)} 
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      title="Remover Produto"
                    >
                      {TrashIcon}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryScreen;

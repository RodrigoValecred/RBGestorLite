
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardScreen from './components/DashboardScreen';
import InventoryScreen from './components/InventoryScreen';
import SalesScreen from './components/SalesScreen';
import ExpensesScreen from './components/ExpensesScreen';
import { AppView, Product, Sale, Expense } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // Load initial state from localStorage or use defaults
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const [products, setProducts] = useState<Product[]>(() => loadState<Product[]>('products', []));
  const [sales, setSales] = useState<Sale[]>(() => loadState<Sale[]>('sales', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadState<Expense[]>('expenses', []));

  // Persist state to localStorage
  useEffect(() => {
    window.localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    window.localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    window.localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'addedDate'>) => {
    setProducts(prev => [...prev, { ...productData, id: crypto.randomUUID(), addedDate: new Date().toISOString() }]);
  }, []);
  
  const removeProduct = useCallback((productId: string) => {
    // Check if product is in any sale. If so, prevent deletion or handle accordingly.
    // For simplicity, we'll allow deletion but this could orphan sales data display if not careful.
    // A better approach would be to soft-delete or prevent deletion if referenced.
    const isProductInSale = sales.some(sale => sale.productId === productId);
    if (isProductInSale) {
      alert("Este produto não pode ser removido pois está associado a vendas registradas. Considere zerar o estoque ou arquivar o produto (funcionalidade não implementada).");
      return;
    }
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, [sales]);

  const addStock = useCallback((productId: string, quantity: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: p.quantity + quantity } : p));
  }, []);

  const recordSale = useCallback((saleData: Omit<Sale, 'id' | 'date' | 'productName' | 'purchasePriceAtSale'> & { productId: string }) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return;

    if (product.quantity < saleData.quantitySold) {
        alert(`Estoque insuficiente para ${product.name}. Disponível: ${product.quantity}`);
        return;
    }

    const newSale: Sale = {
      ...saleData,
      id: crypto.randomUUID(),
      productName: product.name,
      purchasePriceAtSale: product.purchasePrice, // Capture purchase price at time of sale
      date: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
    setProducts(prev => 
      prev.map(p => 
        p.id === saleData.productId 
        ? { ...p, quantity: p.quantity - saleData.quantitySold } 
        : p
      )
    );
  }, [products]);

  const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'date'>) => {
    setExpenses(prev => [...prev, { ...expenseData, id: crypto.randomUUID(), date: new Date().toISOString() }]);
  }, []);

  const removeExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  }, []);


  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <DashboardScreen products={products} sales={sales} expenses={expenses} />;
      case AppView.INVENTORY:
        return <InventoryScreen products={products} addProduct={addProduct} addStock={addStock} removeProduct={removeProduct} />;
      case AppView.SALES:
        return <SalesScreen products={products} sales={sales} recordSale={recordSale} />;
      case AppView.EXPENSES:
        return <ExpensesScreen expenses={expenses} addExpense={addExpense} removeExpense={removeExpense} />;
      default:
        return <DashboardScreen products={products} sales={sales} expenses={expenses} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 ml-64 h-full overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
    
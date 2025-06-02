
import React from 'react';
import { Product, Sale, Expense } from '../types.ts';
import Card from './ui/Card.tsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DashboardScreenProps {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ products, sales, expenses }) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalCostOfGoodsSold = sales.reduce((sum, sale) => sum + (sale.purchasePriceAtSale * sale.quantitySold), 0);
  const grossProfit = totalRevenue - totalCostOfGoodsSold;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netCashFlow = totalRevenue - totalExpenses; // Simple cash flow: total money in from sales vs total money out from expenses
  
  const totalInventoryItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.purchasePrice * product.quantity), 0);

  const monthlyData: { name: string; receita: number; despesa: number; lucro: number }[] = [];
  const salesByMonth: { [key: string]: { receita: number; custo: number } } = {};
  const expensesByMonth: { [key: string]: number } = {};

  sales.forEach(sale => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!salesByMonth[month]) salesByMonth[month] = { receita: 0, custo: 0 };
    salesByMonth[month].receita += sale.totalAmount;
    salesByMonth[month].custo += sale.purchasePriceAtSale * sale.quantitySold;
  });

  expenses.forEach(expense => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!expensesByMonth[month]) expensesByMonth[month] = 0;
    expensesByMonth[month] += expense.amount;
  });
  
  const allMonths = new Set([...Object.keys(salesByMonth), ...Object.keys(expensesByMonth)]);
  const sortedMonths = Array.from(allMonths).sort((a,b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime());

  sortedMonths.forEach(month => {
    const receita = salesByMonth[month]?.receita || 0;
    const custo = salesByMonth[month]?.custo || 0;
    const despesa = expensesByMonth[month] || 0;
    monthlyData.push({
      name: month,
      receita: receita,
      despesa: despesa,
      lucro: receita - custo - despesa
    });
  });
  
  const COLORS = ['#10b981', '#ef4444', '#3b82f6']; // Emerald, Red, Blue

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-semibold text-slate-100">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Receita Total" value={formatCurrency(totalRevenue)} />
        <Card title="Despesas Totais" value={formatCurrency(totalExpenses)} />
        <Card title="Fluxo de Caixa Líquido" value={formatCurrency(netCashFlow)} valueClassName={netCashFlow >= 0 ? 'text-emerald-400' : 'text-red-400'} />
        <Card title="Lucro Bruto (Vendas)" value={formatCurrency(grossProfit)} />
        <Card title="Itens em Estoque" value={totalInventoryItems.toLocaleString('pt-BR')} />
        <Card title="Valor do Estoque" value={formatCurrency(totalInventoryValue)} />
      </div>

      {monthlyData.length > 0 && (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Visão Geral Mensal</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
              <YAxis tickFormatter={formatCurrency} tick={{ fill: '#9ca3af' }} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e7eb' }}
                labelStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="receita" name="Receita" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" name="Despesa" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="lucro" name="Lucro Líquido Estimado" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;

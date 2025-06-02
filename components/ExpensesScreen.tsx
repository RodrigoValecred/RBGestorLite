
import React, { useState } from 'react';
import { Expense } from '../types';
import { PlusIcon, TrashIcon } from '../constants';

interface ExpensesScreenProps {
  expenses: Expense[];
  addExpense: (expenseData: Omit<Expense, 'id' | 'date'>) => void;
  removeExpense: (expenseId: string) => void;
}

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'});
};

const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ expenses, addExpense, removeExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Preencha a descrição e o valor da despesa.');
      return;
    }
    addExpense({
      description,
      amount: parseFloat(amount),
    });
    setDescription('');
    setAmount('');
  };
  
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h2 className="text-3xl font-semibold text-slate-100">Controle de Despesas</h2>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
        <h3 className="text-xl font-medium text-slate-200 mb-2">Adicionar Nova Despesa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Descrição da Despesa"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400"
          />
          <input
            type="number"
            placeholder="Valor da Despesa (R$)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
            className="p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-slate-100 placeholder-slate-400"
          />
        </div>
        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold p-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2">
          {PlusIcon}
          <span>Adicionar Despesa</span>
        </button>
      </form>

      <div className="bg-slate-800 p-1 rounded-xl shadow-lg">
        <h3 className="text-xl font-medium text-slate-200 p-4">Histórico de Despesas</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 text-slate-400 font-semibold">Data</th>
                <th className="p-4 text-slate-400 font-semibold">Descrição</th>
                <th className="p-4 text-slate-400 font-semibold">Valor</th>
                <th className="p-4 text-slate-400 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.length === 0 && (
                 <tr><td colSpan={4} className="p-4 text-center text-slate-500">Nenhuma despesa registrada.</td></tr>
              )}
              {sortedExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 text-slate-300">{formatDate(expense.date)}</td>
                  <td className="p-4 text-slate-200">{expense.description}</td>
                  <td className="p-4 text-red-400 font-semibold">{formatCurrency(expense.amount)}</td>
                  <td className="p-4 text-center">
                     <button 
                      onClick={() => window.confirm(`Tem certeza que deseja remover a despesa "${expense.description}"?`) && removeExpense(expense.id)} 
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      title="Remover Despesa"
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

export default ExpensesScreen;
    
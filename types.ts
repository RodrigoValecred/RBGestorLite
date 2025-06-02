
export interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  addedDate: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantitySold: number;
  unitPrice: number;
  totalAmount: number;
  purchasePriceAtSale: number; // To calculate profit accurately
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  EXPENSES = 'EXPENSES',
}
    
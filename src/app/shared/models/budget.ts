export interface Account {
  id: number;
  bank: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: number;
  item: string;
  amount: number;
  date: string;
  account: string;
  type?: string;
}

export interface Budget {
  id: number;
  Category: string;
  Amount: number;
}

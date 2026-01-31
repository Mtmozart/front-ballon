enum Months {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
}

export enum Categories {
  FIXED_COSTS,
  COMFORT,
  GOALS,
  KNOWLEDGE,
  PLEASURES,
  FINANCIAL_FREEDOM,
}

export type CreateExpense = {
  month: Months;
  year: number;
  title: string;
  value: number;
  customerId: string;
  categoryId: Categories;
  recurring?: number;
};

export type Expense = {
  id: string;
  title: string;
  month: Months;
  year: number;
  value: number;
  category: string;
  color?: string;
};


export type ExpenseData = {
  id: string;
  title: string;
  month: Months;
  year: number;
  value: number;
  category: string;
};



export type CategoryAndValue = {
  category: Categories
  expense: number
}


export type ExpensesPaginate = {
  expenses: ExpenseData[];
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number
}
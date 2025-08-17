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
  consumerId: string;
  categoriaId: Categories;
};

export type Expense = {
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
  content: Expense[];
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number
}
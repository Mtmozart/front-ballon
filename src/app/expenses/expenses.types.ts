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

enum Categories {
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

enum MonthEnum {
  January = "JANUARY",
  February = "FEBRUARY",
  March = "MARCH",
  April = "APRIL",
  May = "MAY",
  June = "JUNE",
  July = "JULY",
  August = "AUGUST",
  September = "SEPTEMBER",
  October = "OCTOBER",
  November = "NOVEMBER",
  December = "DECEMBER",
}

export enum CategoryEnum {
  FIXED_COSTS = 1,
  COMFORT = 2,
  GOALS = 3,
  KNOWLEDGE = 4,
  PLEASURES = 5,
  FINANCIAL_FREEDOM = 6,
}

export type RegisterExpenseForm = {
  month: MonthEnum;
  year: number;
  title: string;
  value: number;
  consumerId: string;
  categoriaId: CategoryEnum;
};

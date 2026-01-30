export enum CategoryColor {
  DEFAULT = "#9E9E9E",
  ITAU_ORANGE = "#EC7000",
  BRADESCO_RED = "#CC092F",
  SANTANDER_RED = "#EA1D25",
  BANCO_DO_BRASIL_YELLOW = "#FFD200",
  CAIXA_BLUE = "#005CA9",
  NUBANK_PURPLE = "#8A05BE",
  INTER_ORANGE = "#FF7A00",
  C6_BLACK = "#000000",
  XP_BLACK = "#111111",
  BTG_BLUE = "#0A1AFF",
  SICREDI_GREEN = "#6DBE45",
  SICOOB_GREEN = "#003641",
  TEAL = "#009688",
  INDIGO = "#3F51B5",
  AMBER = "#FFC107",
  PINK = "#E91E63",
  BROWN = "#795548",
  CYAN = "#00BCD4",
  LIME = "#CDDC39",
  DEEP_PURPLE = "#512DA8",
  BLUE_GRAY = "#607D8B",
}

export type CategoryColorName = keyof typeof CategoryColor;

export type CreateCategory = {
  title: string;
  color: CategoryColorName;
};

export type UpdateCategory = {
  id: number;
  title: string;
  color: CategoryColorName;
};

export type Category = {
  id: number;
  title: string;
  color: CategoryColorName;
};

export type Consumer = {
  name: string;
  email: string;
  password: string;
  createAt: Date;
  updateAt?: string;
};

export type CreateConsumer = {
  name: string;
  email: string;
  password: string;
};
export type ConsumerResponse = {
  id: string;
  name: string;
  email: string;
  isConfirmed: boolean;
  cell_phone: string;
};

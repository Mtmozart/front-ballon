export type Consumer = {
  name: string;
  email: string;
  password: string;
  createAt: Date;
  updateAt?: string;
  cell_phone?: string;
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

export interface UpdateConsumer {
  name: string;
  email: string;
  password?: string;
  cellNumber?: string;
}


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
  confirmPassword: string;
};

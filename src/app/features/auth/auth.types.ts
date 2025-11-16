export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
}


export type Token = {
  token: string;
};
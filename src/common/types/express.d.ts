declare namespace Express {
  export interface Request {
    user?: {
      email: string;
      firstName: string;
      lastName: string;
      accessToken: string;
    };
  }
}

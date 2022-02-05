// @ts-ignore
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
    };
  }
}

import { Response } from 'express';

export type ServiceResponse = {
  status: boolean;
  message?: string;
  data?: any;
  code?: number;
};

export default (res: Response, result: ServiceResponse) => {
  const { status, message, data, code } = result;
  const statusCode = status ? 200 : !status && code ? code : 400;
  return res.status(statusCode).json({ status, message, data, code });
};

import { Response } from 'express';

const makeResponse = (res: Response, statusCode: number, message: string, data: any, error: any) => {
  if (error) {
    return res
      .status(statusCode)
      .json({ statusCode, message, error, data: data });
  } else {
    return res.status(statusCode).json({ statusCode, message, error, data });
  }
};

export const sendErrorResponse = (res: Response, statusCode: number, message: string, code: number) => {
  return res.status(statusCode).json({ statusCode, error: { code, message } });
}

export default makeResponse;
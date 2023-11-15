import {
  NextFunction as ExpressNextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import User from "../src/models/User";

export interface Response extends ExpressResponse {
  invalid: (message: string, data?: any, extra?: any) => ExpressResponse;
  auth: (message: string, data?: any, extra?: any) => ExpressResponse;
  forbidden: (message: string, data?: any, extra?: any) => ExpressResponse;
  notFound: (message: string, data?: any, extra?: any) => ExpressResponse;
  success: (message: string, data?: any, extra?: any) => ExpressResponse;
}

export interface Request extends ExpressRequest {
  user: User;
  sub: any;
  name: any;
}

export interface NextFunction extends ExpressNextFunction {}

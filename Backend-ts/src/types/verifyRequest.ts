import { Request } from "express";

export interface VerifyRequest extends Request {
    userId?: string;
    userName?: string;
    role?: string;
    avatar?: string;
}
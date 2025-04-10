import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface VerifyTokenRequest extends Request {
    userId?:string;
    role?: string;
    userName?: string;
    avatar?: string;
};

export interface DecodedToken extends JwtPayload {
    id: string;
    role: string;
    userName: string;
    avatar: string;
}
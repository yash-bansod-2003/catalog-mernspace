import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    auth: {
        sub: string;
        role: string;
        jti: string;
    };
}

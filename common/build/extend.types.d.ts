import { Response } from "express";
export declare type TCookieOption = {
    maxAge?: number;
    httpOnly?: boolean;
    signed?: boolean;
    secure?: boolean;
};
export declare type TCookie = (key: string, value: any, options?: TCookieOption) => void;
export declare type ResponseExtend = Response & TCookie;

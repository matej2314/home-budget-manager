import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { VerifyTokenRequest } from '../types/verifyToken.ts';
import type { Permissions, CustomMessages } from "../types/verifyRole.ts";
const statusCode = StatusCodes;

const verifyRole = (reqRole:string) => {
    return (req: VerifyTokenRequest, res: Response, next: NextFunction) => {
        const userRole = req.role;

        if (!userRole) res.status(statusCode.FORBIDDEN).json({
            status: 'error',
            message: 'Użytkownik nie ma przypisanej roli.'
        });

        const permissions: Permissions = {
            mates: ['host', 'mate'],
            host: ['host'],
            inmate: ['mate'],
            superadmin: ['superadmin'],
            user: ['user']
        };

        const customMessages: CustomMessages = {
            mates: {
                user: 'Nie masz uprawnień. Czynność tylko dla domowników lub gospodarzy.',
                superadmin: 'Nie masz uprawnień. Tylko gospodarze i domownicy mogą wykonać akcję',
            },
            host: {
                inmate: 'Czynność zarezerwowana dla gospodarzy. Skontaktuj się ze swoim gospodarzem.',
                user: 'Załóż gospodarstwo, aby wykonać tę akcję.',
                superadmin: 'Załóż gospodarstwo, aby wykonać tę akcję',
            },
            inmate: {
                host: 'Akcja tylko dla domowników. Nie masz uprawnień.',
                user: 'Nie masz wystarczających uprawnień. Załóż gospodarstwo lub zapisz się do wybranego.',
            },
            user: {
                host: 'Akcja tylko dla nowych użytkowników.',
                inmate: 'Akcja tylko dla nowych użytkowników.',
            },
            superadmin: {
                host: 'Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.',
                inmate: 'Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.',
                user: 'Nie masz wystarczających uprawnień. Skontaktuj się z administratorem witryny.',
            },
        };

        if (permissions[reqRole] && permissions[reqRole].includes(userRole)) return next();

        const message: string = customMessages[reqRole]?.[userRole] || 'Brak uprawnień do wykonania akcji';

        res.status(statusCode.FORBIDDEN).json({
            status: 'error',
            message,
        });
    };
};

module.exports = verifyRole;
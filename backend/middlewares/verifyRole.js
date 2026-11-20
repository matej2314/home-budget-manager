import { StatusCodes } from 'http-status-codes';

const statusCode = StatusCodes;

const verifyRole = (reqRole) => {
    return (req, res, next) => {
        const userRole = req.role;

        if (!userRole) return res.status(statusCode.FORBIDDEN).json({
            status: 'error',
            message: 'authz.roleMissing'
        });

        const permissions = {
            household: ['host', 'inmate'],
            host: ['host'],
            inmate: ['inmate'],
            superadmin: ['superadmin'],
            user: ['user'],
        };

        // message = klucz i18n (K-2 / B-10); FE mapuje w R1
        const customMessages = {
            household: {
                user: 'authz.household.denied.user',
                superadmin: 'authz.household.denied.superadmin',
            },
            host: {
                inmate: 'authz.host.denied.inmate',
                user: 'authz.host.denied.user',
                superadmin: 'authz.host.denied.superadmin',
            },
            inmate: {
                host: 'authz.inmate.denied.host',
                user: 'authz.inmate.denied.user',
            },
            user: {
                host: 'authz.user.denied.host',
                inmate: 'authz.user.denied.inmate',
            },
            superadmin: {
                host: 'authz.superadmin.denied.host',
                inmate: 'authz.superadmin.denied.inmate',
                user: 'authz.superadmin.denied.user',
            },
        };

        if (permissions[reqRole] && permissions[reqRole].includes(userRole)) return next();

        const message = customMessages[reqRole]?.[userRole] || 'authz.denied';

        return res.status(statusCode.FORBIDDEN).json({
            status: 'error',
            message,
        });
    };
};

export default verifyRole;

import { Request, Response, NextFunction } from "express";
import { dataSource, initializeDatabase } from "../db";
import jwt from "jsonwebtoken";
import { AccountEntity } from "../db/entities/account.entity";

declare global {
    namespace Express {
      interface Request {
        account: AccountEntity
      }
    }
  }

export async function protectedRoute(req: Request, res: Response, next: NextFunction) {
    await initializeDatabase();

    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const jwtVerify = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

        if (typeof jwtVerify === 'string') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!jwtVerify.NIK) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const NIK = jwtVerify.NIK;

        const accountRepository = dataSource.getRepository(AccountEntity);

        const account = await accountRepository.findOneBy({ NIK: NIK });

        req.account = account

        if (!account) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
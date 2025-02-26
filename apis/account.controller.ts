import bycrypt from 'bcryptjs';
import { Router } from 'express';

import { dataSource, initializeDatabase } from '../db';
import { AccountEntity } from '../db/entities/account.entity';
import jwt from 'jsonwebtoken';
import { protectedRoute } from '../middlewares/protected.midleware';

const controller = Router();

controller.post('/register', async (req, res) => {
    await initializeDatabase();
    const NIK = req.body.NIK;
    const FullName = req.body.Fullname;
    const Email = req.body.Email;
    const Password = req.body.Password;

    console.log(NIK, FullName, Email, Password, req.body);

    try {
        await dataSource.getRepository(AccountEntity).save({
            NIK: NIK,
            FullName: FullName,
            Email: Email,
            Password: bycrypt.hashSync(Password, 10),
            places: []
        });
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.post('/login', async (req, res) => {
    await initializeDatabase();
    const NIK = req.body.NIK;
    const Password = req.body.Password;

    try {
        const account = await dataSource.getRepository(AccountEntity).findOneBy({ NIK: NIK });
        if (account) {
            const isPasswordValid = bycrypt.compareSync(Password, account.Password);
            if (isPasswordValid) {
                res.status(200).json({ message: 'Login successful', data: jwt.sign({ NIK: NIK }, process.env.JWT_SECRET)  });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.post('/update/profile', (protectedRoute as any), async (req, res) => {
    await initializeDatabase();

    try {
        const account = req.account;

        const { FullName, Email } = req.body;

        account.FullName = FullName;
        account.Email = Email;

        await dataSource.getRepository(AccountEntity).save(account);

        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.post('/update/password', (protectedRoute as any), async (req, res) => {
    await initializeDatabase();

    try {
        const account = req.account;

        const { OldPassword, NewPassword } = req.body;

        if (bycrypt.compareSync(OldPassword, account.Password)) {
            account.Password = bycrypt.hashSync(NewPassword, 10);
            await dataSource.getRepository(AccountEntity).save(account);
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.get('/profile', (protectedRoute as any), ((req, res) => {
    return res.status(200).json({ message: 'Profile fetched successfully', data: req.account });
}) as any);

export default controller;
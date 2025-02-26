import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { protectedRoute } from '../middlewares/protected.midleware';
import { dataSource, initializeDatabase } from '../db';
import { PlacesEntity } from '../db/entities/places.entity';
import { AccountEntity } from '../db/entities/account.entity';

const controller = Router();

controller.post('/create', (protectedRoute as any), async (req, res) => {
    await initializeDatabase();

    try {
        const account = req.account;

        const { PlaceName, PlaceAddress, PlaceDescription, PlaceType } = req.body;

        const placeData = new PlacesEntity();

        placeData.name = PlaceName;
        placeData.address = PlaceAddress;
        placeData.description = PlaceDescription;
        placeData.type = PlaceType;
        placeData.quota = 10;
        placeData.current = 0;
        placeData.fine = 0;
        placeData.CO2 = 0;
        placeData.account = account;

        await dataSource.getRepository(PlacesEntity).save(placeData);

        res.status(201).json({ message: 'Place created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.get('/all', (protectedRoute as any), async (req, res) => {
    await initializeDatabase();

    try {
        const account = req.account;

        const places = await dataSource.getRepository(PlacesEntity).find({ where: { account: { NIK: account.NIK } } });

        res.status(200).json({ message: 'Places fetched successfully', data: places });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.get('/:id', (protectedRoute as any), (async (req, res) => {
    await initializeDatabase();

    try {
        const account = req.account;

        const placeId = parseInt(req.params.id);

        const place = await dataSource.getRepository(PlacesEntity).findOne({ where: { id: placeId, account: { NIK: account.NIK } } });

        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }

        res.status(200).json({ message: 'Place fetched successfully', data: place });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}) as any);

export default controller;
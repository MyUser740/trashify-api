import { Router } from 'express';
import showdown from 'showdown';
import { protectedRoute } from '../middlewares/protected.midleware';
import { invokeModel } from '../ai/model/model';

const controller = Router();

controller.post('/generate', (protectedRoute as any), (async (req, res) => {
    const question = req.body.question;

    if (!question)
        return res.status(400).json({ message: 'Question is required' });

    try {
        const response = await invokeModel([
            { role: 'system', content: 'Your name is Trashify AI.. Your task is helping people to clean this planet.' },
            { role: 'user', content: question },
        ]);

        const html = new showdown.Converter().makeHtml(response);

        res.status(200).json({ message: 'Chat generated successfully', data: html });
    } catch (error) {
        console.error(error);
    }
}) as any);

export default controller;
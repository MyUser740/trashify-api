import { Router } from 'express';
import { dataSource, initializeDatabase } from '../db';
import { ArticleEntity } from '../db/entities/articles.entity';
import { Like } from 'typeorm';
import path from 'path';
import { readFile } from 'fs/promises';
import showdown from 'showdown';

const controller = Router();

controller.get('/latest', async (req, res) => {
    await initializeDatabase();

    try {
        const articleRepository = dataSource.getRepository(ArticleEntity);

        const latestArticles = await articleRepository.find({
            order: { id: 'DESC' },
            take: 5
        });

        res.status(200).json({ message: 'Latest articles fetched successfully', data: latestArticles });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.get('/search', (async (req, res) => {
    await initializeDatabase();

    try {
        const articleRepository = dataSource.getRepository(ArticleEntity);

        const searchQuery = req.query.q as string;

        if (!searchQuery) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const searchResults = await articleRepository.find({
            where: {
                title: Like(searchQuery)
            }
        });

        res.status(200).json({ message: 'Search results fetched successfully', data: searchResults });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}) as any);

controller.get('/:id', (async (req, res) => {
    await initializeDatabase();

    try {
        const articleRepository = dataSource.getRepository(ArticleEntity);

        const articleId = parseInt(req.params.id);

        const article = await articleRepository.findOneBy({ id: articleId });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const markdown = article.markdown;

        const markdown_path = path.join(__dirname, '../contents/articles/', `${article.markdown}.md`);

        const markdown_content = await readFile(markdown_path, { encoding: 'utf-8' });

        const markdown_html = new showdown.Converter().makeHtml(markdown_content);

        res.status(200).json({ message: 'Article fetched successfully', data: article, html: markdown_html });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}) as any);

export default controller;
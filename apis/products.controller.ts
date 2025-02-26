import { Router } from "express";
import { dataSource, initializeDatabase } from "../db";
import { ProductEntity } from "../db/entities/product.entity";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { protectedRoute } from "../middlewares/protected.midleware";

const controller = Router();

controller.get('/', async (req, res) => {
    await initializeDatabase();

    try {
        const productsRepository = dataSource.getRepository(ProductEntity);

        const products = await productsRepository.find({
            relations: {
                account: true
            }
        });

        const thumbnail = [];

        for await (const product of products) {
            const imgPath = path.join(__dirname, '../contents/products/', `${product.thumbnail}`);
            const img = await readFile(imgPath, { encoding: 'base64' });
            thumbnail.push(img);
        }

        res.status(200).json({ message: 'Products fetched successfully', data: products, thumbnail });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.post('/create', (protectedRoute as any), async (req, res) => {
    await initializeDatabase();

    try {
        const account = req.account;

        const { name, description, price, thumbnail } = req.body;

        const thumbnailFilename = `${name}-${Date.now()}.jpg`;

        await writeFile(path.join(__dirname, '../contents/products/', thumbnailFilename), Buffer.from(thumbnail.replace('data:image/jpeg;base64,', ''), 'base64'));

        const productData = new ProductEntity();

        productData.name = name;
        productData.description = description;
        productData.price = price;
        productData.thumbnail = thumbnailFilename;
        productData.account = account;

        await dataSource.getRepository(ProductEntity).save(productData);

        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

controller.get('/:id', (async (req, res) => {
    await initializeDatabase();

    try {
        const productRepository = dataSource.getRepository(ProductEntity);

        const product = await productRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: {
                account: true
            }
        });

        if (!product)
            return res.status(404).json({
                message: 'Product not found'
            });

        const imgPath = path.join(__dirname, '../contents/products/', `${product.thumbnail}`);
        const img = await readFile(imgPath, { encoding: 'base64' });

        return res.status(200).json({
            message: 'Product recieved!',
            data: product,
            thumbnail: img
        });
    } catch(err) {
        console.error(err);

        res.status((500)).json({
            message: 'Internal Server Error'
        });
    }
}) as any);

export default controller;
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database";

class ProductPage {
  async FindProductPath(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await prisma.products.findMany();
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async FindProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const product = await prisma.products.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          thumbnail: true,
          shortDescription: true,
          description: true,
          price: true,
          video: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          Sizes: {
            select: {
              size: true,
              id: true,
            },
          },
          Modeling: {
            select: {
              id: true,
              image: true,
              title: true,
              description: true,
            },
          },
          SizeTables: {
            select: {
              id: true,
              table: true,
            },
          },
          Catalogs: {
            take: 8,
            select: {
              id: true,
              image: true,
            },
          },
        },
      });

      const banner = await prisma.banners.findFirst({
        where: { origin: "product" },
      });

      return res.status(201).json({ product, banner });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductPage();

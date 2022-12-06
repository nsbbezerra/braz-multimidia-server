import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database";

class IndexPage {
  async Find(req: Request, res: Response, next: NextFunction) {
    try {
      const banners = await prisma.banners.findMany({
        where: { origin: "index" },
      });
      const categories = await prisma.categories.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      });
      const products = await prisma.products.findMany({
        where: { active: true },
        orderBy: { request: "desc" },
        take: 12,
      });
      return res.status(200).json({ banners, categories, products });
    } catch (error) {
      next(error);
    }
  }

  async FindCategoriesAndProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const products = await prisma.products.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      });
      const categories = await prisma.categories.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      });

      return res.status(200).json({ products, categories });
    } catch (error) {
      next(error);
    }
  }

  async FindOtherBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const banner = await prisma.banners.findFirst({
        where: { origin: "other" },
      });
      return res.status(201).json(banner);
    } catch (error) {
      next(error);
    }
  }

  async FindCartBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const banner = await prisma.banners.findFirst({
        where: { origin: "cart" },
      });
      return res.status(200).json(banner);
    } catch (error) {
      next(error);
    }
  }
}

export default new IndexPage();

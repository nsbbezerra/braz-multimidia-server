import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database";

class CategoriesPage {
  async Find(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const category = await prisma.categories.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          thumbnail: true,
          Products: {
            select: {
              id: true,
              name: true,
              thumbnail: true,
              price: true,
            },
          },
        },
      });
      const banner = await prisma.banners.findFirst({
        where: { origin: "products" },
      });
      const categories = await prisma.categories.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      });
      return res.status(200).json({ category, banner, categories });
    } catch (error) {
      next(error);
    }
  }
  async FindCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.categories.findMany();
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoriesPage();

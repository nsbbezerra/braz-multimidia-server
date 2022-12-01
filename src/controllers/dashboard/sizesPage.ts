import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/index";

class SizePagesFinder {
  async FindCategoriesAndProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categoriesWithProducts = await prisma.categories.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          Products: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
      return res.status(201).json(categoriesWithProducts);
    } catch (error) {
      next(error);
    }
  }
}

export default new SizePagesFinder();

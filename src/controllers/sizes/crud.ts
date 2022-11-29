import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database";
import { SizesProps } from "../../types";

class SizesCRUD {
  async Create(
    req: Request<{ productId: string }, {}, SizesProps>,
    res: Response,
    next: NextFunction
  ) {
    const { productId } = req.params;
    const { size } = req.body;

    try {
      await prisma.sizes.create({
        data: {
          size,
          productId,
        },
      });
      return res
        .status(201)
        .json({ message: "Tamanho cadastrado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Update(
    req: Request<{ id: string }, {}, SizesProps>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const { size } = req.body;

    try {
      await prisma.sizes.update({
        where: { id },
        data: {
          size,
        },
      });
      return res
        .status(201)
        .json({ message: "Informação alterada com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Delete(
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    try {
      await prisma.sizes.delete({
        where: { id },
      });
      return res
        .status(201)
        .json({ message: "Informação excluída com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Find(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;

    try {
      const sizes = await prisma.sizes.findMany({
        where: { productId },
      });
      return res.status(200).json(sizes);
    } catch (error) {
      next(error);
    }
  }
}

export default new SizesCRUD();

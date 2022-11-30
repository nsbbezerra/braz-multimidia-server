import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/index";
import { CreateProductsProps } from "../../types";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function SaveThumbnail(id: string, fileUrl: string, fileId: string) {
  await prisma.products.update({
    where: { id },
    data: {
      thumbnail: fileUrl,
      thumbnailId: fileId,
    },
  });
}

class ProductsCRUD {
  async Create(
    req: Request<{}, {}, CreateProductsProps>,
    res: Response,
    next: NextFunction
  ) {
    const { categoryId, description, name, price, shortDescription, video } =
      req.body;

    try {
      const product = await prisma.products.create({
        data: {
          categoryId,
          description,
          name,
          price,
          shortDescription,
          video,
        },
      });
      const id = product.id;
      return res
        .status(201)
        .json({ message: "Produto cadastrado com sucesso", id });
    } catch (error) {
      next(error);
    }
  }
  async Update(
    req: Request<{ id: string }, {}, CreateProductsProps>,
    res: Response,
    next: NextFunction
  ) {
    const { description, name, price, shortDescription, video } = req.body;
    const { id } = req.params;

    try {
      await prisma.products.update({
        where: { id },
        data: {
          description,
          name,
          price,
          shortDescription,
          video,
        },
      });
      return res.status(201).json({ message: "Produto alterado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
  async Thumbnail(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseId, firebaseUrl } = req;
    const { id } = req.params;

    try {
      await prisma.products.update({
        where: { id },
        data: {
          thumbnail: firebaseUrl,
          thumbnailId: firebaseId,
        },
      });
      return res.status(201).json({ message: "Imagem inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }
  async UpdateThumbnail(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseId, firebaseUrl } = req;
    const { id } = req.params;

    try {
      const product = await prisma.products.findFirst({
        where: { id },
      });

      if (!product?.thumbnailId) {
        SaveThumbnail(id, String(firebaseUrl), String(firebaseId));
        return res.status(201).json({ message: "Imagem alterada com sucesso" });
      }

      const deleteFile = bucket.file(product?.thumbnailId as string).delete();

      deleteFile
        .then(() => {
          SaveThumbnail(id, String(firebaseUrl), String(firebaseId));
          return res
            .status(201)
            .json({ message: "Imagem alterada com sucesso" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }
  async Active(req: Request, res: Response, next: NextFunction) {
    const { active } = req.body;
    const { id } = req.params;

    try {
      await prisma.products.update({
        where: { id },
        data: {
          active,
        },
      });
      return res
        .status(201)
        .json({ message: "Alteração concluída com sucesso" });
    } catch (error) {
      next(error);
    }
  }
  async Show(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await prisma.products.findMany({
        select: {
          name: true,
          id: true,
          shortDescription: true,
          description: true,
          price: true,
          thumbnail: true,
          thumbnailId: true,
          active: true,
          video: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { name: "asc" },
      });
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductsCRUD();

import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function DeleteCatalog(id: string) {
  await prisma.catalogs.delete({
    where: { id },
  });
}

class CatalogsCRUD {
  async Create(req: CustomProp, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { firebaseId, firebaseUrl } = req;

    try {
      await prisma.catalogs.create({
        data: {
          image: String(firebaseUrl),
          imageId: String(firebaseId),
          productId: id,
        },
      });
      return res.status(201).json({ message: "Imagem inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const findCatalog = await prisma.catalogs.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(String(findCatalog?.imageId)).delete();

      deleteFile
        .then(() => {
          DeleteCatalog(id);
          return res
            .status(201)
            .json({ message: "Imagem removida com sucesso" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }

  async Find(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;

    try {
      const catalogs = await prisma.catalogs.findMany({
        where: { productId },
      });

      return res.status(200).json(catalogs);
    } catch (error) {
      next(error);
    }
  }
}

export default new CatalogsCRUD();

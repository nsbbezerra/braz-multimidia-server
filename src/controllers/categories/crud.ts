import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database";
import { CategoryStoreProps } from "../../types";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function SaveThumbnail(url: string, id: string, fileId: string) {
  await prisma.categories.update({
    where: { id },
    data: {
      thumbnail: url,
      thumbnailId: fileId,
    },
  });
}

class CategoriesCRUD {
  async Create(
    req: Request<{}, {}, CategoryStoreProps>,
    res: Response,
    next: NextFunction
  ) {
    const { name, description } = req.body;

    try {
      const category = await prisma.categories.create({
        data: {
          name,
          description: description || "",
        },
      });
      const id = category.id;
      return res
        .status(201)
        .json({ message: "Categoria salva com sucesso", id });
    } catch (error) {
      next(error);
    }
  }

  async StoreThumbnail(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseId, firebaseUrl } = req;
    const { id } = req.params;

    try {
      await prisma.categories.update({
        where: { id },
        data: {
          thumbnail: firebaseUrl,
          thumbnailId: firebaseId,
        },
      });
      return res.status(201).json({ message: "Imagem salva com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Update(
    req: Request<{ id: string }, {}, CategoryStoreProps>,
    res: Response,
    next: NextFunction
  ) {
    const { name, description } = req.body;
    const { id } = req.params;

    try {
      await prisma.categories.update({
        where: { id },
        data: {
          name,
          description: description || "",
        },
      });
      return res
        .status(201)
        .json({ message: "Informações alteradas com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Active(
    req: Request<{ id: string }, {}, { active: boolean }>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const { active } = req.body;

    try {
      await prisma.categories.update({
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

  async UpdateThumbnail(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseId, firebaseUrl } = req;
    const { id } = req.params;

    try {
      const category = await prisma.categories.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(category?.thumbnailId as string).delete();

      deleteFile
        .then(() => {
          SaveThumbnail(String(firebaseUrl), id, String(firebaseId));
          return res
            .status(201)
            .json({ message: "Imagem atualizada com sucesso" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }

  async Show(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.categories.findMany({
        orderBy: { name: "desc" },
      });
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoriesCRUD();

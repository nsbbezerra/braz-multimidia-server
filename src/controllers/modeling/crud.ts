import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/index";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function SaveThumbnail(id: string, fileUrl: string, fileId: string) {
  await prisma.modeling.update({
    where: { id },
    data: {
      image: String(fileUrl),
      imageId: String(fileId),
    },
  });
}

async function DeleteModeling(id: string) {
  await prisma.modeling.delete({
    where: { id },
  });
}

class ModelingCRUD {
  async Create(req: CustomProp, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { firebaseId, firebaseUrl } = req;
    const { title, description } = req.body;

    try {
      await prisma.modeling.create({
        data: {
          productId: id,
          title,
          description,
          image: String(firebaseUrl),
          imageId: String(firebaseId),
        },
      });
      return res.status(201).json({ message: "Imagem salva com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async UpdateThumbnail(req: CustomProp, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { firebaseId, firebaseUrl } = req;

    try {
      const findModeling = await prisma.modeling.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(String(findModeling?.imageId)).delete();

      deleteFile
        .then(() => {
          SaveThumbnail(id, String(firebaseUrl), String(firebaseId));
          return res
            .status(200)
            .json({ message: "Imagem alterada com sucesso" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const findModeling = await prisma.modeling.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(String(findModeling?.imageId)).delete();

      deleteFile
        .then(() => {
          DeleteModeling(id);
          return res
            .status(200)
            .json({ message: "Informações excluídas com sucesso" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }

  async UpdateInfo(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      await prisma.modeling.update({
        where: { id },
        data: {
          title,
          description,
        },
      });
      return res
        .status(201)
        .json({ message: "Alterações concluídas com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Find(req: Request, res: Response, next: NextFunction) {
    const { productId } = req.params;

    try {
      const modelings = await prisma.modeling.findMany({
        where: { productId },
      });

      return res.status(200).json(modelings);
    } catch (error) {
      next(error);
    }
  }
}

export default new ModelingCRUD();

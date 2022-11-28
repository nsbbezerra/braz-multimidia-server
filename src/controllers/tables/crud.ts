import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function SaveThumbnail(id: string, fileUrl: string, fileId: string) {
  await prisma.sizeTables.update({
    where: { id },
    data: {
      table: String(fileUrl),
      tableId: String(fileId),
    },
  });
}

async function DeleteTable(id: string) {
  await prisma.sizeTables.delete({
    where: { id },
  });
}

class TablesCRUD {
  async Create(req: CustomProp, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { firebaseId, firebaseUrl } = req;
    const { title } = req.body;

    try {
      await prisma.sizeTables.create({
        data: {
          title,
          productId: id,
          table: firebaseUrl,
          tableId: firebaseId,
        },
      });
      return res.status(201).json({ message: "Tabela inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async UpdateThumbnail(req: CustomProp, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { firebaseId, firebaseUrl } = req;

    try {
      const findTable = await prisma.sizeTables.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(String(findTable?.tableId)).delete();

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

  async UpdateTitle(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { title } = req.body;

    try {
      await prisma.sizeTables.update({
        where: { id },
        data: {
          title,
        },
      });

      return res
        .status(201)
        .json({ message: "Informação alterada com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const findTable = await prisma.sizeTables.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(String(findTable?.tableId)).delete();

      deleteFile
        .then(() => {
          DeleteTable(id);
          return res
            .status(201)
            .json({ message: "Tabela excluída com sucesso" });
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
      const tables = await prisma.sizeTables.findMany({
        where: { productId },
      });

      return res.status(200).json(tables);
    } catch (error) {
      next(error);
    }
  }
}

export default new TablesCRUD();

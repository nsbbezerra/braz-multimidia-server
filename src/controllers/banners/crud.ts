import { BannerOrigin } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/index";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function DeleteBanner(id: string) {
  await prisma.banners.delete({
    where: { id },
  });
}

class BannersCRUD {
  async CreateBanner(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseUrl, firebaseId } = req;
    const { origin, redirect } = req.body;

    try {
      await prisma.banners.create({
        data: {
          origin,
          redirect,
          banner: firebaseUrl as string,
          bannerId: firebaseId as string,
        },
      });
      return res.status(201).json({ message: "Imagem inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Show(req: Request, res: Response, next: NextFunction) {
    const { origin } = req.params;
    try {
      const banner = await prisma.banners.findMany({
        where: { origin: origin as BannerOrigin },
      });
      return res.status(200).json(banner);
    } catch (error) {
      next(error);
    }
  }

  async UpdateRedirect(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { redirect } = req.body;

    try {
      await prisma.banners.update({
        where: { id },
        data: {
          redirect,
        },
      });
      return res
        .status(201)
        .json({ message: "Informação inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const findBanner = await prisma.banners.findFirst({
        where: { id },
      });

      const deleteFile = bucket.file(String(findBanner?.bannerId)).delete();

      deleteFile
        .then(() => {
          DeleteBanner(id);
          return res
            .status(201)
            .json({ message: "Banner removido com sucesso" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (error) {
      next(error);
    }
  }
}

export default new BannersCRUD();

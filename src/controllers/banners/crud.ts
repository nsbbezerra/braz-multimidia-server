import { BannerOrigin } from "@prisma/client";
import e, { Request, Response, NextFunction } from "express";
import { prisma } from "../../database/index";
import { bucket } from "../../services/upload";

interface CustomProp extends Request {
  firebaseUrl?: string;
  firebaseId?: string;
}

async function SaveDesktop(id: string, fileUrl: string, fileId: string) {
  await prisma.banners.update({
    where: { id },
    data: {
      desktop: fileUrl,
      desktopId: fileId,
    },
  });
}

async function SaveMobile(id: string, fileUrl: string, fileId: string) {
  await prisma.banners.update({
    where: { id },
    data: {
      mobile: fileUrl,
      mobileId: fileId,
    },
  });
}

class BannersCRUD {
  async CreateDesktop(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseUrl, firebaseId } = req;
    const { origin, redirect } = req.body;

    try {
      await prisma.banners.create({
        data: {
          origin,
          redirect,
          desktop: firebaseUrl as string,
          desktopId: firebaseId as string,
        },
      });
      return res.status(201).json({ message: "Imagem inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async CreateMobile(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseUrl, firebaseId } = req;
    const { id } = req.params;

    try {
      await prisma.banners.update({
        where: { id },
        data: {
          mobile: firebaseUrl as string,
          mobileId: firebaseId as string,
        },
      });
      return res.status(201).json({ message: "Imagem inserida com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async UpdateDesktop(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseId, firebaseUrl } = req;
    const { id } = req.params;

    try {
      const banner = await prisma.banners.findFirst({
        where: { id },
      });
      const deleteFile = bucket.file(banner?.desktopId as string).delete();

      deleteFile
        .then(() => {
          SaveDesktop(id, String(firebaseUrl), String(firebaseId));
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

  async UpdateMobile(req: CustomProp, res: Response, next: NextFunction) {
    const { firebaseId, firebaseUrl } = req;
    const { id } = req.params;

    try {
      const banner = await prisma.banners.findFirst({
        where: { id },
      });
      const deleteFile = bucket.file(banner?.mobileId as string).delete();

      deleteFile
        .then(() => {
          SaveMobile(id, String(firebaseUrl), String(firebaseId));
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

  async Show(req: Request, res: Response, next: NextFunction) {
    const { origin } = req.params;

    try {
      const banner = await prisma.banners.findFirst({
        where: { origin: { equals: origin as BannerOrigin } },
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
}

export default new BannersCRUD();

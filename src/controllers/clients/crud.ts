import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database";
import { ClientProps } from "../../types";
import bcrypt from "bcrypt";

class ClientsCRUD {
  async Create(
    req: Request<{}, {}, ClientProps>,
    res: Response,
    next: NextFunction
  ) {
    const {
      cep,
      city,
      comp,
      district,
      document,
      email,
      name,
      number,
      password,
      phone,
      state,
      street,
    } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      await prisma.client.create({
        data: {
          cep,
          city,
          comp,
          district,
          document,
          email,
          name,
          number,
          password: hash,
          phone,
          state,
          street,
        },
      });
      return res
        .status(201)
        .json({ message: "Cliente cadastrado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async Update(
    req: Request<{ clientID: string }, {}, ClientProps>,
    res: Response,
    next: NextFunction
  ) {
    const {
      cep,
      city,
      comp,
      district,
      document,
      email,
      name,
      number,
      phone,
      state,
      street,
    } = req.body;
    const { clientID } = req.params;
    try {
      await prisma.client.update({
        where: { id: clientID },
        data: {
          cep,
          city,
          comp,
          district,
          document,
          email,
          name,
          number,
          phone,
          state,
          street,
        },
      });
      return res.status(201).json({ message: "Dados atualizados com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientsCRUD();

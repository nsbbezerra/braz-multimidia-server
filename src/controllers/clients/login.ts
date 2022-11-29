import { NextFunction, Request, Response } from "express";
import { prisma } from "../../database";
import bcrypt from "bcrypt";

class ClientLogin {
  async Login(
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { email, password } = req.body;

    try {
      const findClient = await prisma.client.findFirst({
        where: { email },
      });
      if (!findClient) {
        return res.status(400).json({ message: "Cliente não encontrado" });
      }
      const comparePassword = await bcrypt.compare(
        password,
        findClient.password
      );
      if (!comparePassword) {
        return res.status(400).json({ message: "Senha incorreta" });
      }
      const client = {
        name: findClient.name,
        document: findClient.document,
        phone: findClient.phone,
        email: findClient.email,
        street: findClient.street,
        number: findClient.number,
        comp: findClient.comp,
        district: findClient.district,
        cep: findClient.cep,
        city: findClient.city,
        state: findClient.state,
      };
      return res
        .status(200)
        .json({ message: "Login realizado com sucesso", client });
    } catch (error) {
      next(error);
    }
  }

  async RequestUpdatePassword(
    req: Request<{}, {}, { email: string; document: string; password: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { document, email, password } = req.body;

    try {
      const findClient = await prisma.client.findFirst({
        where: { document, email },
      });
      if (!findClient) {
        return res.status(400).json({ message: "Informações incorretas" });
      }
      const hash = await bcrypt.hash(password, 10);
      await prisma.client.update({
        where: { id: findClient.id },
        data: {
          password: hash,
        },
      });
      return res.status(201).json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}
export default new ClientLogin();

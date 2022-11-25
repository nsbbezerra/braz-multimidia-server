import Fastify from "fastify";
import { prisma } from "./database/index";
import cors from "@fastify/cors";
import {
  CategoryStoreProps,
  ClientProps,
  LoginProps,
  UploaderProps,
} from "./types";
import bcrypt from "bcrypt";
import admin from "firebase-admin";
import { uploader } from "./configs/uploader";
import multipart from "@fastify/multipart";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: uploader.project_id,
    clientEmail: uploader.client_email,
    privateKey: uploader.private_key,
  }),
  storageBucket: "gs://ecommerce-18d83.appspot.com",
});

interface UploaderBodyProps {
  file: File;
}

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(multipart);

  fastify.post<{ Body: ClientProps }>("/clients", async (request, reply) => {
    const {
      name,
      document,
      phone,
      email,
      street,
      number,
      comp,
      district,
      cep,
      city,
      user,
      password,
      state,
    } = request.body;

    try {
      const hash = await bcrypt.hash(password, 10);
      await prisma.client.create({
        data: {
          name,
          document,
          phone,
          email,
          street,
          number,
          comp,
          district,
          cep,
          city,
          user,
          password: hash,
          state,
        },
      });
      return reply
        .status(201)
        .send({ message: "Cliente cadastrado com sucesso" });
    } catch (error) {
      return reply.status(400).send({
        message: `Ocorreu um erro ao cadastrar o cliente`,
        error,
      });
    }
  });

  fastify.post<{ Body: LoginProps }>("/login", async (request, reply) => {
    const { password, user } = request.body;

    try {
      const findClient = await prisma.client.findFirst({
        where: { user },
      });
      if (!findClient) {
        reply.status(400).send({ message: "Cliente não encontrado" });
      }
      const match = await bcrypt.compare(
        password,
        findClient?.password as string
      );

      if (!match) {
        reply.status(400).send({ message: "Senha incorreta" });
      }

      let client: ClientProps = {
        name: findClient?.name || "",
        document: findClient?.document || "",
        phone: findClient?.phone || "",
        email: findClient?.email || "",
        street: findClient?.street || "",
        number: findClient?.number || "",
        comp: findClient?.comp || "",
        district: findClient?.district || "",
        cep: findClient?.cep || "",
        city: findClient?.city || "",
        user: findClient?.user || "",
        state: findClient?.state || "",
        password: "NOT SHOW",
      };

      return reply.status(200).send(client);
    } catch (error) {
      return reply.status(400).send({
        message: `Ocorreu um erro ao realizar o login.`,
        error,
      });
    }
  });

  fastify.post<{ Body: CategoryStoreProps }>(
    "/categories",
    async (request, reply) => {
      const { name, description } = request.body;

      try {
        const category = await prisma.categories.create({
          data: {
            name,
            description: description as string,
          },
        });

        return reply
          .status(201)
          .send({ message: "Categoria cadastrada com sucesso", category });
      } catch (error) {
        return reply.status(400).send({
          message: `Ocorreu um erro ao cadastrar a categoria.`,
          error,
        });
      }
    }
  );

  fastify.put<{ Params: UploaderProps }>(
    "/thumbnail/:id/:destiny",
    async (request, reply) => {
      const bucket = admin.storage().bucket();
      const { destiny, id } = request.params;
      let image = await request.file();

      try {
        if (!image?.file) {
          return reply.status(400).send({
            message: `Não foi encontrado um arquivo para salvar`,
            where: "NOT FILE",
          });
        }
        const name = `${Date.now()}.${image?.filename.split(".").pop()}`;
        const file = bucket.file(name);

        if (destiny === "CATEGORY") {
          const stream = file.createWriteStream({
            metadata: {
              contentType: image?.mimetype,
            },
          });
          stream.on("error", (err) => {
            return reply.status(400).send({
              message: `Ocorreu um erro ao realizar o login.`,
              error: err,
              where: "STREAM ERROR",
            });
          });
          stream.on("finish", async () => {
            await file.makePublic();
            const url = file.publicUrl();
            const fileId = file.id;
            await prisma.categories.update({
              where: { id },
              data: {
                thumbnail: url,
                thumbnailId: fileId,
              },
            });
          });
          stream.end(image?.toBuffer());
          return reply
            .status(201)
            .send({ message: "Imagem salva com sucesso" });
        }
      } catch (error) {
        return reply.status(400).send({
          message: `Ocorreu um erro ao salvar a imagem`,
          error,
          where: "TRY CATCH",
        });
      }
    }
  );

  await fastify.listen({ port: 3333 });
}

bootstrap();

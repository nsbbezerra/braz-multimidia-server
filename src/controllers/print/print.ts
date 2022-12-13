import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database";

function formateDate(date: Date) {
  const initialDate = new Date(date);
  const day = initialDate.getDate();
  const month = initialDate.toLocaleString("pt-br", { month: "long" });
  const year = initialDate.getFullYear();

  return `${day} de ${month} de ${year}`;
}

class Printer {
  async Generate(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const findOrder = await prisma.orders.findFirst({
        where: { id },
        select: {
          id: true,
          client: {
            select: {
              name: true,
              street: true,
              number: true,
              district: true,
              cep: true,
              city: true,
              state: true,
            },
          },
          OrderItems: {
            select: {
              product: {
                select: {
                  thumbnail: true,
                  name: true,
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              total: true,
              size: {
                select: {
                  size: true,
                },
              },
              quantity: true,
            },
          },
          total: true,
          createdAt: true,
        },
      });

      let order = {
        order: findOrder?.id,
        client: findOrder?.client.name,
        address: `${findOrder?.client.street}, Nº ${findOrder?.client.number}, ${findOrder?.client.district}, CEP: ${findOrder?.client.cep}, ${findOrder?.client.city} - ${findOrder?.client.state}`,
        data: formateDate(new Date(findOrder?.createdAt as Date)),
        items: findOrder?.OrderItems,
        total: findOrder?.total,
      };

      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
}

export default new Printer();

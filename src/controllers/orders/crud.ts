import { OrderStatus, PaymentStatus } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../database";
import Stripe from "stripe";
import { defaultUrl, stripePK } from "../../configs/uploader";

type OrderProps = {
  clientId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  observation: string;
  total: number;
};

type OrderItemsProps = {
  productId: string;
  sizeId: string;
  quantity: number;
  total: number;
  unity: number;
  thumbnail: string;
  name: string;
};

interface Props {
  order: OrderProps;
  items: OrderItemsProps[];
}

const stripe = new Stripe(stripePK, { apiVersion: "2022-11-15" });

async function CreateOrderItem(order: string, item: OrderItemsProps) {
  await prisma.orderItems.create({
    data: {
      orderId: order,
      productId: item.productId,
      quantity: item.quantity,
      sizeId: item.sizeId,
      total: item.total,
    },
  });
  await prisma.products.update({
    where: { id: item.productId },
    data: { request: { increment: item.quantity } },
  });
}

class OrdersController {
  async Create(req: Request<{}, {}, Props>, res: Response, next: NextFunction) {
    const { order, items } = req.body;

    try {
      const newOrder = await prisma.orders.create({
        data: {
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          total: order.total,
          clientId: order.clientId,
          observation: order.observation,
        },
      });

      items.map((item) => {
        CreateOrderItem(newOrder.id, item);
      });

      const orderId = newOrder.id;

      /** CHECKOUT */

      const line_items = items.map((item) => {
        return {
          quantity: item.quantity,
          price_data: {
            product_data: {
              images: [item.thumbnail],
              name: item.name,
            },
            currency: "BRL",
            unit_amount: item.unity * 100,
          },
        };
      });

      const session = await stripe.checkout.sessions.create({
        success_url: `${defaultUrl}/sucesso?order=${orderId}&status=completo`,
        cancel_url: `${defaultUrl}/sucesso?order=${orderId}&status=erro`,
        mode: "payment",
        line_items,
        payment_method_types: ["boleto", "card"],
      });

      await prisma.orders.update({
        where: { id: orderId },
        data: {
          checkoutId: session.id,
        },
      });

      const url = session.url;

      return res.status(201).json({
        message: "Pedido gerado com sucesso, aguarde para o pagamento",
        orderId,
        url,
      });
    } catch (error) {
      next(error);
    }
  }

  async FindOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const order = await prisma.orders.findFirst({
        where: { id },
        select: {
          id: true,
          checkoutId: true,
          createdAt: true,
          total: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          observation: true,
          orderStatus: true,
          paymentStatus: true,
          OrderItems: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  thumbnail: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              id: true,
              quantity: true,
              size: {
                select: {
                  id: true,
                  size: true,
                },
              },
              total: true,
            },
          },
        },
      });
      let paymentStatus;
      if (order?.checkoutId) {
        const payment = await stripe.checkout.sessions.retrieve(
          String(order?.checkoutId)
        );
        console.log({ payment });
        const status = payment.payment_status;
        paymentStatus = status;
      }
      return res.status(201).json({ order, paymentStatus });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrdersController();

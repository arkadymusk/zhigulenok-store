import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/", async (req, res) => {
  const cartItems = await prisma.cartItem.findMany({
    include: {
      product: true,
    },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Корзина пустая" });
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      totalPrice,
      status: "created",
    },
  });

  await prisma.cartItem.deleteMany();

  res.json({
    id: order.id,
    status: order.status,
    totalPrice: order.totalPrice,
    message: "Заказ успешно оформлен",
  });
});

router.get("/", async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
});

export default router;
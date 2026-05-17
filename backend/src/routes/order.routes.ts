import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Корзина пустая" });
  }

  // ✅ Проверка остатков
  for (const item of cartItems) {
    if (item.product.stockQuantity < item.quantity) {
      return res.status(400).json({
        message: `Недостаточно товара: ${item.product.name}`,
      });
    }
  }

  // ✅ Общая сумма
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // ✅ Транзакция (важно!)
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalPrice,
        status: "created",
      },
    });

    // создаём OrderItem + уменьшаем склад
    for (const item of cartItems) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: item.product.stockQuantity - item.quantity,
        },
      });
    }

    // очищаем корзину
    await tx.cartItem.deleteMany({
      where: { userId },
    });

    return tx.order.findUnique({
      where: { id: newOrder.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  });

  res.json(order);
});

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const orderId = Number(req.params.id);

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Заказ не найден" });
  }

  res.json(order);
});

export default router;
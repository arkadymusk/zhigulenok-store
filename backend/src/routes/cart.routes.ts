import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

async function getCart(userId: number) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { id: "asc" },
  });

  const formattedItems = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    articleNumber: item.product.articleNumber,
    price: item.product.price,
    quantity: item.quantity,
    total: item.product.price * item.quantity,
    imageUrl: item.product.imageUrl,
  }));

  const totalPrice = formattedItems.reduce((sum, item) => sum + item.total, 0);

  return {
    items: formattedItems,
    totalPrice,
  };
}

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const cart = await getCart(req.userId!);
  res.json(cart);
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "productId и quantity обязательны" });
  }

  if (Number(quantity) <= 0) {
    return res.status(400).json({ message: "Количество должно быть больше 0" });
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
  });

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  if (product.stockQuantity < Number(quantity)) {
    return res.status(400).json({ message: "Недостаточно товара на складе" });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId: Number(productId),
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + Number(quantity);

    if (product.stockQuantity < newQuantity) {
      return res.status(400).json({ message: "Недостаточно товара на складе" });
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId,
        productId: Number(productId),
        quantity: Number(quantity),
      },
    });
  }

  const cart = await getCart(userId);
  res.json(cart);
});

router.patch("/:itemId", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const itemId = Number(req.params.itemId);
  const quantity = Number(req.body.quantity);

  if (!quantity && quantity !== 0) {
    return res.status(400).json({ message: "quantity обязателен" });
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      userId,
    },
    include: {
      product: true,
    },
  });

  if (!item) {
    return res.status(404).json({ message: "Товар в корзине не найден" });
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    if (item.product.stockQuantity < quantity) {
      return res.status(400).json({ message: "Недостаточно товара на складе" });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  const cart = await getCart(userId);
  res.json(cart);
});

router.delete("/:itemId", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const itemId = Number(req.params.itemId);

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      userId,
    },
  });

  if (!item) {
    return res.status(404).json({ message: "Товар в корзине не найден" });
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  const cart = await getCart(userId);
  res.json(cart);
});

export default router;
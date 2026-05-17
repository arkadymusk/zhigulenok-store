import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

async function getCart() {
  const items = await prisma.cartItem.findMany({
    include: {
      product: true,
    },
  });

  const formattedItems = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    articleNumber: item.product.articleNumber,
    price: item.product.price,
    quantity: item.quantity,
    total: item.product.price * item.quantity,
  }));

  const totalPrice = formattedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return {
    items: formattedItems,
    totalPrice,
  };
}

router.get("/", async (req, res) => {
  const cart = await getCart();
  res.json(cart);
});

router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      productId: Number(productId),
    },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + Number(quantity),
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        productId: Number(productId),
        quantity: Number(quantity),
      },
    });
  }

  const cart = await getCart();
  res.json(cart);
});

router.patch("/:itemId", async (req, res) => {
  const itemId = Number(req.params.itemId);
  const quantity = Number(req.body.quantity);

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });
  } else {
    await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    });
  }

  const cart = await getCart();
  res.json(cart);
});

router.delete("/:itemId", async (req, res) => {
  const itemId = Number(req.params.itemId);

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  const cart = await getCart();
  res.json(cart);
});

export default router;
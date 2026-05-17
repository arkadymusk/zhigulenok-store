import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const search = req.query.search as string | undefined;
  const categoryId = req.query.categoryId as string | undefined;
  const carModel = req.query.carModel as string | undefined;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { articleNumber: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId ? { categoryId: Number(categoryId) } : {},
        carModel
          ? { carModel: { contains: carModel, mode: "insensitive" } }
          : {},
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  res.json(product);
});

export default router;
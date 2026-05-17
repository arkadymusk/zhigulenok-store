import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  });

  res.json(categories);
});

export default router;
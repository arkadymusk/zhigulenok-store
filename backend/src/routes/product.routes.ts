import { Router } from "express";
import { products } from "../data/products";

const router = Router();

router.get("/", (req, res) => {
  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  res.json(product);
});

export default router;
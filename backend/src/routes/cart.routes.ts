import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    items: [],
    totalPrice: 0
  });
});

router.post("/", (req, res) => {
  res.json({
    message: "Товар добавлен в корзину",
    productId: req.body.productId,
    quantity: req.body.quantity
  });
});

router.patch("/:itemId", (req, res) => {
  res.json({
    message: "Количество товара обновлено",
    itemId: Number(req.params.itemId),
    quantity: req.body.quantity
  });
});

router.delete("/:itemId", (req, res) => {
  res.json({
    message: "Товар удален из корзины",
    itemId: Number(req.params.itemId)
  });
});

export default router;
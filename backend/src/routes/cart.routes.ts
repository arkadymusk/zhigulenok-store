import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    items: [
      {
        id: 1,
        productId: 1,
        name: "Масляный фильтр ВАЗ 2107",
        articleNumber: "OF-2107",
        price: 750,
        quantity: 2,
        total: 1500
      },
      {
        id: 2,
        productId: 2,
        name: "Тормозные колодки Lada Granta",
        articleNumber: "BR-GRANTA-01",
        price: 1800,
        quantity: 1,
        total: 1800
      }
    ],
    totalPrice: 3300
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
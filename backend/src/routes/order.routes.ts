import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  res.json({
    id: 1,
    status: "created",
    totalPrice: 3300,
    message: "Заказ успешно оформлен"
  });
});

router.get("/", (req, res) => {
  res.json([]);
});

export default router;
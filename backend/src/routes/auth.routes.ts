import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  res.json({
    message: "Регистрация выполнена",
    token: `mock-token-${user.id}`,
    user,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Неверный email или пароль" });
  }

  res.json({
    message: "Вход выполнен",
    token: `mock-token-${user.id}`,
    user,
  });
});

export default router;
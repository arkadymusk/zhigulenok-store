import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Заполните имя, email и пароль" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Пароль должен быть минимум 6 символов" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.json({
    message: "Регистрация выполнена",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Введите email и пароль" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Неверный email или пароль" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Неверный email или пароль" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  res.json({
    message: "Вход выполнен",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export default router;
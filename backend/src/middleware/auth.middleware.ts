import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & {
  userId?: number;
};

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: number;
    };

    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Неверный токен" });
  }
}
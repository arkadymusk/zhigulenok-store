import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import categoryRoutes from "./routes/category.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      message: "Внутренняя ошибка сервера",
    });
  }
);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
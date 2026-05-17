import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Cart service is working" });
});

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден в cart-service" });
});

app.listen(PORT, () => {
  console.log(`Cart service is running on port ${PORT}`);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Масляный фильтр ВАЗ 2107",
    description: "Масляный фильтр для автомобилей ВАЗ 2101–2107.",
    articleNumber: "OF-2107",
    price: 750,
    category: "Фильтры",
    carModel: "ВАЗ 2107",
    stockQuantity: 15,
    imageUrl: "/images/oil-filter.jpg"
  },
  {
    id: 2,
    name: "Тормозные колодки Lada Granta",
    description: "Комплект передних тормозных колодок для Lada Granta.",
    articleNumber: "BR-GRANTA-01",
    price: 1800,
    category: "Тормозная система",
    carModel: "Lada Granta",
    stockQuantity: 8,
    imageUrl: "/images/brake-pads.jpg"
  },
  {
    id: 3,
    name: "Ремень ГРМ Lada Priora",
    description: "Ремень газораспределительного механизма для Lada Priora.",
    articleNumber: "GRM-PRIORA-16V",
    price: 2300,
    category: "Двигатель",
    carModel: "Lada Priora",
    stockQuantity: 6,
    imageUrl: "/images/timing-belt.jpg"
  },
  {
    id: 4,
    name: "Свечи зажигания ВАЗ 2114",
    description: "Комплект свечей зажигания для автомобилей ВАЗ 2114.",
    articleNumber: "SP-2114",
    price: 950,
    category: "Система зажигания",
    carModel: "ВАЗ 2114",
    stockQuantity: 20,
    imageUrl: "/images/spark-plugs.jpg"
  }
];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", (req, res) => {
  res.json({
    id: 1,
    name: req.body.name,
    email: req.body.email,
    token: "mock-jwt-token"
  });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    id: 1,
    name: "Иван Иванов",
    email: req.body.email,
    token: "mock-jwt-token"
  });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    id: 1,
    name: "Иван Иванов",
    email: "ivan@example.com"
  });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Товар не найден" });
  }

  res.json(product);
});

app.get("/api/cart", (req, res) => {
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

app.post("/api/cart", (req, res) => {
  res.json({
    message: "Товар добавлен в корзину",
    productId: req.body.productId,
    quantity: req.body.quantity
  });
});

app.patch("/api/cart/:itemId", (req, res) => {
  res.json({
    message: "Количество товара обновлено",
    itemId: Number(req.params.itemId),
    quantity: req.body.quantity
  });
});

app.delete("/api/cart/:itemId", (req, res) => {
  res.json({
    message: "Товар удален из корзины",
    itemId: Number(req.params.itemId)
  });
});

app.post("/api/orders", (req, res) => {
  res.json({
    id: 1,
    status: "created",
    totalPrice: 3300,
    message: "Заказ успешно оформлен"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
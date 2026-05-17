import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  res.json({
    id: 1,
    name: req.body.name,
    email: req.body.email,
    token: "mock-jwt-token"
  });
});

router.post("/login", (req, res) => {
  res.json({
    id: 1,
    name: "Иван Иванов",
    email: req.body.email,
    token: "mock-jwt-token"
  });
});

router.get("/me", (req, res) => {
  res.json({
    id: 1,
    name: "Иван Иванов",
    email: "ivan@example.com"
  });
});

export default router;
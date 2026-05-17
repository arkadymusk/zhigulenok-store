import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";

type Product = {
  id: number;
  name: string;
  description: string;
  articleNumber: string;
  price: number;
  category: string;
  carModel: string;
  stockQuantity: number;
  imageUrl: string;
};



function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Zhigulenok Store
      </Link>

      <nav className="nav">
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Корзина</Link>
        <Link to="/login">Вход</Link>
        <Link to="/register">Регистрация</Link>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <h1>Онлайн-магазин автозапчастей для автомобилей Лада</h1>
        <p>
          Прототип интернет-магазина с каталогом товаров, корзиной и оформлением
          заказа.
        </p>
        <Link to="/catalog" className="primaryButton">
          Перейти в каталог
        </Link>
      </section>
    </main>
  );
}

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки товаров:", error);
        setIsLoading(false);
      });
  }, []);

  function addToCart(productId: number) {
    fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId,
        quantity: 1
      })
    })
      .then((res) => res.json())
      .then(() => {
        alert("Товар добавлен в корзину");
      })
      .catch((error) => {
        console.error("Ошибка добавления в корзину:", error);
      });
  }

  return (
    <main className="page">
      <h1>Каталог автозапчастей</h1>

      <div className="filters">
        <input placeholder="Поиск по названию или артикулу" />
        <select>
          <option>Все категории</option>
          <option>Фильтры</option>
          <option>Тормозная система</option>
          <option>Двигатель</option>
          <option>Система зажигания</option>
        </select>
      </div>

      {isLoading ? (
        <p>Загрузка товаров...</p>
      ) : (
        <div className="productGrid">
          {products.map((product) => (
            <div className="productCard" key={product.id}>
              <div className="imagePlaceholder">Фото товара</div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><b>Артикул:</b> {product.articleNumber}</p>
              <p><b>Модель:</b> {product.carModel}</p>
              <p className="price">{product.price} ₽</p>

              <button onClick={() => addToCart(product.id)}>
                Добавить в корзину
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

type CartItem = {
  id: number;
  productId: number;
  name: string;
  articleNumber: string;
  price: number;
  quantity: number;
  total: number;
};

type CartResponse = {
  items: CartItem[];
  totalPrice: number;
};

function CartPage() {
  const [cart, setCart] = useState<CartResponse>({
    items: [],
    totalPrice: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки корзины:", error);
        setIsLoading(false);
      });
  }, []);

  function updateCartItem(itemId: number, quantity: number) {
    fetch(`http://localhost:3000/api/cart/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity })
    })
      .then((res) => res.json())
      .then(() => {
        alert("Количество обновлено");
      });
  }

  function deleteCartItem(itemId: number) {
    fetch(`http://localhost:3000/api/cart/${itemId}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => {
        alert("Товар удален из корзины");
      });
  }

  function createOrder() {
    fetch("http://localhost:3000/api/orders", {
      method: "POST"
    })
      .then((res) => res.json())
      .then(() => {
        alert("Заказ оформлен");
      });
  }

  return (
    <main className="page">
      <h1>Корзина</h1>

      {isLoading ? (
        <p>Загрузка корзины...</p>
      ) : (
        <>
          <div className="cartList">
            {cart.items.map((item) => (
              <div className="cartItem" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Артикул: {item.articleNumber}</p>
                  <p>Цена: {item.price} ₽</p>
                </div>

                <div className="cartActions">
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => deleteCartItem(item.id)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <h2>Итого: {cart.totalPrice} ₽</h2>
            <button onClick={createOrder}>Оформить заказ</button>
          </div>
        </>
      )}
    </main>
  );
}

function LoginPage() {
  return (
    <main className="page formPage">
      <h1>Вход</h1>

      <form className="form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Пароль" />
        <button type="button">Войти</button>
      </form>
    </main>
  );
}

function RegisterPage() {
  return (
    <main className="page formPage">
      <h1>Регистрация</h1>

      <form className="form">
        <input type="text" placeholder="Имя" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Пароль" />
        <button type="button">Зарегистрироваться</button>
      </form>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
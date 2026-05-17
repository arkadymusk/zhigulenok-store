import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:3000/api";

type Product = {
  id: number;
  name: string;
  description: string;
  articleNumber: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  carModel: string;
  stockQuantity: number;
  imageUrl: string | null;
};

type CartItem = {
  id: number;
  productId: number;
  name: string;
  articleNumber: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string | null;
};

type CartResponse = {
  items: CartItem[];
  totalPrice: number;
};

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function readJsonResponse(res: Response) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Ошибка запроса");
  }

  return data;
}

function Header() {
  const token = getToken();

  function logout() {
    localStorage.removeItem("token");
    alert("Вы вышли из аккаунта");
    window.location.href = "/";
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        Zhigulenok Store
      </Link>

      <nav className="nav">
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Корзина</Link>

        {token ? (
          <button type="button" onClick={logout}>
            Выйти
          </button>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
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
    fetch(`${API_URL}/products`)
      .then(readJsonResponse)
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки товаров:", error);
        alert(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function addToCart(productId: number) {
    const token = getToken();

    if (!token) {
      alert("Сначала войдите в аккаунт");
      return;
    }

    fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    })
      .then(readJsonResponse)
      .then(() => {
        alert("Товар добавлен в корзину");
      })
      .catch((error) => {
        console.error("Ошибка добавления в корзину:", error);
        alert(error.message);
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
      ) : products.length === 0 ? (
        <p>Товары не найдены</p>
      ) : (
        <div className="productGrid">
          {products.map((product) => (
            <div className="productCard" key={product.id}>
              <div className="imagePlaceholder">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  "Фото товара"
                )}
              </div>

              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <b>Артикул:</b> {product.articleNumber}
              </p>
              <p>
                <b>Модель:</b> {product.carModel}
              </p>
              <p>
                <b>Категория:</b> {product.category?.name || "Без категории"}
              </p>
              <p>
                <b>Остаток:</b> {product.stockQuantity} шт.
              </p>
              <p className="price">{product.price} ₽</p>

              <button
                type="button"
                onClick={() => addToCart(product.id)}
                disabled={product.stockQuantity <= 0}
              >
                {product.stockQuantity > 0
                  ? "Добавить в корзину"
                  : "Нет в наличии"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function CartPage() {
  const [cart, setCart] = useState<CartResponse>({
    items: [],
    totalPrice: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const token = getToken();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/cart`, {
      headers: getAuthHeaders(),
    })
      .then(readJsonResponse)
      .then((data) => {
        setCart(data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки корзины:", error);
        alert(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  function updateCartItem(itemId: number, quantity: number) {
    if (!token) {
      alert("Сначала войдите в аккаунт");
      return;
    }

    fetch(`${API_URL}/cart/${itemId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    })
      .then(readJsonResponse)
      .then((data) => {
        setCart(data);
      })
      .catch((error) => {
        console.error("Ошибка обновления корзины:", error);
        alert(error.message);
      });
  }

  function deleteCartItem(itemId: number) {
    if (!token) {
      alert("Сначала войдите в аккаунт");
      return;
    }

    fetch(`${API_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then(readJsonResponse)
      .then((data) => {
        setCart(data);
      })
      .catch((error) => {
        console.error("Ошибка удаления товара:", error);
        alert(error.message);
      });
  }

  function createOrder() {
    if (!token) {
      alert("Сначала войдите в аккаунт");
      return;
    }

    if (cart.items.length === 0) {
      alert("Корзина пустая");
      return;
    }

    fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
    })
      .then(readJsonResponse)
      .then(() => {
        alert("Заказ оформлен");

        setCart({
          items: [],
          totalPrice: 0,
        });
      })
      .catch((error) => {
        console.error("Ошибка оформления заказа:", error);
        alert(error.message);
      });
  }

  if (!token) {
    return (
      <main className="page">
        <h1>Корзина</h1>
        <p>Чтобы посмотреть корзину, сначала войдите в аккаунт.</p>
        <Link to="/login" className="primaryButton">
          Войти
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Корзина</h1>

      {isLoading ? (
        <p>Загрузка корзины...</p>
      ) : cart.items.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <div className="cartList">
            {cart.items.map((item) => (
              <div className="cartItem" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Артикул: {item.articleNumber}</p>
                  <p>Цена: {item.price} ₽</p>
                  <p>Сумма: {item.total} ₽</p>
                </div>

                <div className="cartActions">
                  <button
                    type="button"
                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                  >
                    +
                  </button>

                  <button type="button" onClick={() => deleteCartItem(item.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <h2>Итого: {cart.totalPrice} ₽</h2>
            <button type="button" onClick={createOrder}>
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(readJsonResponse)
      .then((data) => {
        localStorage.setItem("token", data.token);
        alert("Вход выполнен");
        window.location.href = "/catalog";
      })
      .catch((error) => {
        console.error("Ошибка входа:", error);
        alert(error.message);
      });
  }

  return (
    <main className="page formPage">
      <h1>Вход</h1>

      <form className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="button" onClick={handleLogin}>
          Войти
        </button>
      </form>
    </main>
  );
}

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {
    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then(readJsonResponse)
      .then((data) => {
        localStorage.setItem("token", data.token);
        alert("Регистрация выполнена");
        window.location.href = "/catalog";
      })
      .catch((error) => {
        console.error("Ошибка регистрации:", error);
        alert(error.message);
      });
  }

  return (
    <main className="page formPage">
      <h1>Регистрация</h1>

      <form className="form">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="button" onClick={handleRegister}>
          Зарегистрироваться
        </button>
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
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
              <p>
                <b>Артикул:</b> {product.articleNumber}
              </p>
              <p>
                <b>Модель:</b> {product.carModel}
              </p>
              <p className="price">{product.price} ₽</p>
              <button>Добавить в корзину</button>
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
                  <button>-</button>
                  <span>{item.quantity}</span>
                  <button>+</button>
                  <button>Удалить</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cartSummary">
            <h2>Итого: {cart.totalPrice} ₽</h2>
            <button>Оформить заказ</button>
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
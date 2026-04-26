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

const mockProducts: Product[] = [
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

      <div className="productGrid">
        {mockProducts.map((product) => (
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
    </main>
  );
}

function CartPage() {
  const items = [
    {
      id: 1,
      name: "Масляный фильтр ВАЗ 2107",
      articleNumber: "OF-2107",
      price: 750,
      quantity: 2
    },
    {
      id: 2,
      name: "Тормозные колодки Lada Granta",
      articleNumber: "BR-GRANTA-01",
      price: 1800,
      quantity: 1
    }
  ];

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="page">
      <h1>Корзина</h1>

      <div className="cartList">
        {items.map((item) => (
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
        <h2>Итого: {totalPrice} ₽</h2>
        <button>Оформить заказ</button>
      </div>
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
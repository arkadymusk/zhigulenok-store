import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await prisma.category.createManyAndReturn({
    data: [
      { name: "Фильтры" },
      { name: "Тормозная система" },
      { name: "Двигатель" },
      { name: "Система зажигания" },
      { name: "Подвеска" },
      { name: "Электрика" },
      { name: "Кузов" },
      { name: "Масла и жидкости" },
    ],
  });

  const getCategoryId = (name: string) =>
    categories.find((category) => category.name === name)!.id;

  await prisma.product.createMany({
    data: [
      {
        name: "Масляный фильтр ВАЗ 2107",
        description: "Масляный фильтр для автомобилей ВАЗ 2101–2107.",
        articleNumber: "OF-2107",
        price: 750,
        carModel: "ВАЗ 2107",
        stockQuantity: 15,
        imageUrl: "/images/oil-filter.jpg",
        categoryId: getCategoryId("Фильтры"),
      },
      {
        name: "Воздушный фильтр Lada Granta",
        description: "Воздушный фильтр двигателя для Lada Granta.",
        articleNumber: "AF-GRANTA",
        price: 650,
        carModel: "Lada Granta",
        stockQuantity: 20,
        imageUrl: "/images/air-filter.jpg",
        categoryId: getCategoryId("Фильтры"),
      },
      {
        name: "Тормозные колодки Lada Granta",
        description: "Комплект передних тормозных колодок.",
        articleNumber: "BR-GRANTA-01",
        price: 1800,
        carModel: "Lada Granta",
        stockQuantity: 8,
        imageUrl: "/images/brake-pads.jpg",
        categoryId: getCategoryId("Тормозная система"),
      },
      {
        name: "Тормозной диск ВАЗ 2114",
        description: "Передний тормозной диск для ВАЗ 2114.",
        articleNumber: "DISC-2114",
        price: 2400,
        carModel: "ВАЗ 2114",
        stockQuantity: 10,
        imageUrl: "/images/brake-disc.jpg",
        categoryId: getCategoryId("Тормозная система"),
      },
      {
        name: "Ремень ГРМ Lada Priora",
        description: "Ремень ГРМ для Lada Priora 16V.",
        articleNumber: "GRM-PRIORA-16V",
        price: 2300,
        carModel: "Lada Priora",
        stockQuantity: 6,
        imageUrl: "/images/timing-belt.jpg",
        categoryId: getCategoryId("Двигатель"),
      },
      {
        name: "Помпа охлаждения ВАЗ 2107",
        description: "Водяной насос системы охлаждения.",
        articleNumber: "PUMP-2107",
        price: 2100,
        carModel: "ВАЗ 2107",
        stockQuantity: 7,
        imageUrl: "/images/water-pump.jpg",
        categoryId: getCategoryId("Двигатель"),
      },
      {
        name: "Свечи зажигания ВАЗ 2114",
        description: "Комплект свечей зажигания.",
        articleNumber: "SP-2114",
        price: 950,
        carModel: "ВАЗ 2114",
        stockQuantity: 20,
        imageUrl: "/images/spark-plugs.jpg",
        categoryId: getCategoryId("Система зажигания"),
      },
      {
        name: "Катушка зажигания Lada Kalina",
        description: "Катушка зажигания для Lada Kalina.",
        articleNumber: "COIL-KALINA",
        price: 2800,
        carModel: "Lada Kalina",
        stockQuantity: 5,
        imageUrl: "/images/ignition-coil.jpg",
        categoryId: getCategoryId("Система зажигания"),
      },
      {
        name: "Амортизатор передний Lada Granta",
        description: "Передний амортизатор подвески.",
        articleNumber: "SHOCK-GRANTA-F",
        price: 3900,
        carModel: "Lada Granta",
        stockQuantity: 6,
        imageUrl: "/images/shock-absorber.jpg",
        categoryId: getCategoryId("Подвеска"),
      },
      {
        name: "Шаровая опора ВАЗ 2107",
        description: "Шаровая опора передней подвески.",
        articleNumber: "BALL-2107",
        price: 850,
        carModel: "ВАЗ 2107",
        stockQuantity: 16,
        imageUrl: "/images/ball-joint.jpg",
        categoryId: getCategoryId("Подвеска"),
      },
      {
        name: "Аккумулятор 60Ah",
        description: "Автомобильный аккумулятор 60Ah.",
        articleNumber: "BAT-60AH",
        price: 7200,
        carModel: "Универсальный",
        stockQuantity: 4,
        imageUrl: "/images/battery.jpg",
        categoryId: getCategoryId("Электрика"),
      },
      {
        name: "Лампа H7",
        description: "Галогенная лампа ближнего света H7.",
        articleNumber: "LAMP-H7",
        price: 450,
        carModel: "Универсальный",
        stockQuantity: 30,
        imageUrl: "/images/lamp-h7.jpg",
        categoryId: getCategoryId("Электрика"),
      },
      {
        name: "Зеркало боковое ВАЗ 2114",
        description: "Левое боковое зеркало.",
        articleNumber: "MIRROR-2114-L",
        price: 1600,
        carModel: "ВАЗ 2114",
        stockQuantity: 9,
        imageUrl: "/images/side-mirror.jpg",
        categoryId: getCategoryId("Кузов"),
      },
      {
        name: "Бампер передний Lada Granta",
        description: "Передний бампер без окраски.",
        articleNumber: "BUMPER-GRANTA-F",
        price: 6200,
        carModel: "Lada Granta",
        stockQuantity: 3,
        imageUrl: "/images/front-bumper.jpg",
        categoryId: getCategoryId("Кузов"),
      },
      {
        name: "Моторное масло 5W-40",
        description: "Синтетическое моторное масло 4 литра.",
        articleNumber: "OIL-5W40-4L",
        price: 3200,
        carModel: "Универсальный",
        stockQuantity: 12,
        imageUrl: "/images/motor-oil.jpg",
        categoryId: getCategoryId("Масла и жидкости"),
      },
      {
        name: "Антифриз G12",
        description: "Охлаждающая жидкость G12 5 литров.",
        articleNumber: "ANTIFREEZE-G12",
        price: 1400,
        carModel: "Универсальный",
        stockQuantity: 18,
        imageUrl: "/images/antifreeze.jpg",
        categoryId: getCategoryId("Масла и жидкости"),
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
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
        name: "Ремень ГРМ Lada Priora",
        description: "Ремень ГРМ для Lada Priora.",
        articleNumber: "GRM-PRIORA-16V",
        price: 2300,
        category: "Двигатель",
        carModel: "Lada Priora",
        stockQuantity: 6,
        imageUrl: "/images/timing-belt.jpg"
      },
      {
        name: "Свечи зажигания ВАЗ 2114",
        description: "Комплект свечей зажигания для ВАЗ 2114.",
        articleNumber: "SP-2114",
        price: 950,
        category: "Система зажигания",
        carModel: "ВАЗ 2114",
        stockQuantity: 20,
        imageUrl: "/images/spark-plugs.jpg"
      }
    ]
  });
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
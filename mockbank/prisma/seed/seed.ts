import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CURRENCIES = ["EUR"];
const MERCHANTS = {
  income: ["Employer Oy", "Kesätyö Oy", "Freelance Client"],
  groceries: ["K-Market", "S-Market", "Lidl"],
  bnpl: ["Klarna", "Afterpay", "Walley"],
  subscription: ["Spotify", "Netflix", "Game Pass", "iCloud"],
  fun: ["Steam", "Epic Games", "McDonald's", "Subway"],
  transport: ["HSL", "VR", "Taxi Helsinki"],
};

const CATEGORIES = Object.keys(MERCHANTS) as Array<
  keyof typeof MERCHANTS
>;

function randomItem<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error("randomItem called with empty array");
  }
  const index = Math.floor(Math.random() * arr.length);
  return arr[index]!;
}


// generate a date between two dates
function randomDate(start: Date, end: Date): Date {
  const ts =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(ts);
}

// amount ranges by category
function randomAmount(category: keyof typeof MERCHANTS): number {
  switch (category) {
    case "income":
      // salary / income
      return 800 + Math.random() * 1500; // 800–2300
    case "groceries":
      return -(10 + Math.random() * 60); // -10 to -70
    case "bnpl":
      return -(20 + Math.random() * 150); // -20 to -170
    case "subscription":
      return -(5 + Math.random() * 20); // -5 to -25
    case "fun":
      return -(5 + Math.random() * 80); // -5 to -85
    case "transport":
      return -(2 + Math.random() * 30); // -2 to -32
    default:
      return -(5 + Math.random() * 50);
  }
}

async function createDemoUsers() {
  const demoUsersData = [
    {
		id: "demo1",
      email: "demo.user1@example.com",
      name: "Demo User 1",
    },
    {
		id: "demo2",
      email: "demo.user2@example.com",
      name: "Demo User 2",
    },
    {
		id: "demo3",
      email: "demo.user3@example.com",
      name: "Demo User 3",
    },
  ];

  const users = [];

  for (const u of demoUsersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    users.push(user);
  }

  return users;
}

async function createTransactionsForUser(
  userId: string,
  monthsBack = 6,
  avgTransactionsPerMonth = 60
) {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth() - monthsBack,
    1
  );

  const allTxs = [];

  // Roughly monthsBack * avgTransactionsPerMonth
  const totalTx = monthsBack * avgTransactionsPerMonth;

  for (let i = 0; i < totalTx; i++) {
    // pick a random category
    const category = randomItem(CATEGORIES);
    const merchant = randomItem(MERCHANTS[category]);

    // random date in the period
    const date = randomDate(start, now);

    const amount = randomAmount(category);

    // Make sure there's some regular "income" each month
    // by forcing 1–2 income events per month
    if (i % 35 === 0) {
      // salary-ish
      const salaryDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        25 + Math.floor(Math.random() * 3)
      );
      allTxs.push({
        userId,
        date: salaryDate,
        amount: 900 + Math.random() * 1400,
        currency: "EUR",
        merchant: randomItem(MERCHANTS.income),
        description: "Salary payment",
        category: "income",
      });
      continue;
    }

    allTxs.push({
      userId,
      date,
      amount,
      currency: "EUR",
      merchant,
      description: `${category} purchase`,
      category,
    });
  }

  await prisma.transaction.createMany({
    data: allTxs,
  });

  console.log(
    `Created ~${allTxs.length} transactions for user ${userId}`
  );
}

async function main() {
  console.log("Clearing old data...");
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating demo users...");
  const users = await createDemoUsers();

  console.log("Creating transactions...");
  for (const user of users) {
    await createTransactionsForUser(user.id, 6, 70); // 6 months, ~70 tx/month
  }

  console.log("Done seeding mock bank data.");
  console.log(
    "Demo users (bank side):",
    users.map((u) => ({ id: u.id, email: u.email }))
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

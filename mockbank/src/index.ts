import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "MockBank" });
});


app.get("/users/:userId/transactions", async (req, res) => {
  const { userId } = req.params;
  const { from, to } = req.query;

  try {
	const user = await prisma.user.findUnique({
	  where: { id: userId },
	});

	if (!user) {
	  return res.status(404).json({ error: "User not found in mock bank" });
	}


	const dateFilter: any = {};
	if (from) dateFilter.gte = new Date(from as string);
	if (to) dateFilter.lte = new Date(to as string);

	const whereClause: any = {
	  userId,
	};

	if (from || to) {
	  whereClause.date = dateFilter;
	}

	const txs = await prisma.transaction.findMany({
	  where: whereClause,
	  orderBy: { date: "desc" },
	});

	res.json({
	  user_id: userId,
	  count: txs.length,
	  transactions: txs,
	});
  } catch (err) {
	console.error("Error fetching transactions:", err);
	res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
	select: { id: true, email: true, name: true },
  });

  res.json({ count: users.length, users });
});

app.listen(PORT, () => {
  console.log(`MockBank API running at http://localhost:${PORT}`);
});

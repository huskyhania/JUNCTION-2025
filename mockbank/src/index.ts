import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = 3001;

/**
 * Normalizes optional date query parameters.
 * Returns `undefined` when the param is missing and `null` when the value cannot be parsed as a date.
 */
const parseDateParam = (value: unknown): Date | undefined | null => {
  if (value === undefined) {
    return undefined;
  }

  const normalized = Array.isArray(value) ? value[0] : value;
  if (typeof normalized !== "string") {
    return null;
  }

  const trimmed = normalized.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

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


	const fromDate = parseDateParam(from);
	const toDate = parseDateParam(to);

	if (fromDate === null || toDate === null) {
	  return res.status(400).json({
		error: "Query parameters `from` and `to` must be valid ISO date strings.",
	  });
	}

	if (fromDate && toDate && fromDate > toDate) {
	  return res.status(400).json({
		error: "`from` must be earlier than or equal to `to`.",
	  });
	}

	const dateFilter: Record<string, Date> = {};
	if (fromDate) dateFilter.gte = fromDate;
	if (toDate) dateFilter.lte = toDate;

	const whereClause: any = {
	  userId,
	};

	if (fromDate || toDate) {
	  whereClause.date = dateFilter;
	}

	const txs = await prisma.transaction.findMany({
	  where: whereClause,
	  orderBy: { date: "desc" },
	});

	res.json({
	  userId,
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

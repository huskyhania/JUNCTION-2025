import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { PrismaClient, Prisma } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ??
  true;

const PORT = 3001;

type AiResponsePayload = {
  prompt?: unknown;
  response?: unknown;
  model?: unknown;
  metadata?: unknown;
};

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

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalizeMetadata = (
  value: unknown
): Prisma.JsonValue | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeMetadata(entry) ?? null);
  }

  if (typeof value === "object") {
    const normalized: Record<string, Prisma.JsonValue> = {};
    for (const [key, entry] of Object.entries(
      value as Record<string, unknown>
    )) {
      normalized[key] = normalizeMetadata(entry) ?? null;
    }
    return normalized;
  }

  return undefined;
};

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use((req, res, next) => {
  const origin = req.header("Origin");
  if (origin && Array.isArray(allowedOrigins)) {
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
  } else if (allowedOrigins === true) {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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

app.get("/users/:userId/ai-responses", async (req, res) => {
  const { userId } = req.params;

  try {
	const user = await prisma.user.findUnique({
	  where: { id: userId },
	  select: { id: true },
	});

	if (!user) {
	  return res.status(404).json({ error: "User not found in mock bank" });
	}

	const responses = await prisma.aiResponse.findMany({
	  where: { userId },
	  orderBy: { createdAt: "desc" },
	});

	res.json({
	  userId,
	  count: responses.length,
	  responses,
	});
  } catch (err) {
	console.error("Error fetching AI responses:", err);
	res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/users/:userId/ai-responses", async (req, res) => {
  const { userId } = req.params;
  const payload = req.body as AiResponsePayload;

  const prompt = isNonEmptyString(payload.prompt)
    ? payload.prompt.trim()
    : null;

  const responseText = isNonEmptyString(payload.response)
    ? payload.response.trim()
    : null;

  // Prisma column is likely `String?` → string | null, so normalize to null
  const model =
    isNonEmptyString(payload.model) ? payload.model.trim() : null;

  const metadata = normalizeMetadata(payload.metadata); // JsonValue | undefined

  if (!prompt || !responseText) {
    return res.status(400).json({
      error: "`prompt` and `response` fields are required strings.",
    });
  }

  if (payload.metadata !== undefined && metadata === undefined) {
    return res.status(400).json({
      error: "`metadata` must be JSON-serializable (object, array, or primitive).",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in mock bank" });
    }

    const created = await prisma.aiResponse.create({
      data: {
        userId,
        prompt,
        response: responseText,
        model: model ?? null,
        ...(metadata === undefined
          ? {}
          : {
              metadata:
                metadata === null ? Prisma.JsonNull : metadata,
            }),
      },
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Error persisting AI response:", err);
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

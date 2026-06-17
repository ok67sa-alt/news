import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";

const DATA_PATH = path.resolve(process.cwd(), '..', 'src', 'data', 'news.json');

// CORS headers middleware
const setCorsHeaders = (res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    if (process.env.DATABASE_URL) {
      const cats = await prisma.category.findMany();
      res.status(200).json(cats);
      return;
    }

    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    const names: Record<string, { name: string; slug: string }> = {};
    data.forEach((a: any) => {
      const name = a.category || "Misc";
      const slug = String(name).toLowerCase().split(" ")[0];
      if (!names[slug]) names[slug] = { name, slug };
    });
    res.status(200).json(Object.values(names));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load categories" });
  }
}

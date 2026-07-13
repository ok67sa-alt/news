import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import prisma from "./prisma";
import { setCorsHeaders } from "./cors";

const DATA_PATH = path.resolve(process.cwd(), '..', '..', 'src', 'data', 'news.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }
  const nid = Number(id);

  if (req.method === "GET") {
    try {
      if (process.env.DATABASE_URL) {
        const article = await prisma.article.findUnique({ where: { id: nid } });
        if (!article) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        res.status(200).json(article);
        return;
      }

      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      const data = JSON.parse(raw);
      const article = data.find((a: any) => a.id === nid);
      if (!article) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(200).json(article);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load article" });
      return;
    }
  }

  // Update article (admin)
  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const payload = req.body;
      if (process.env.DATABASE_URL) {
        const updated = await prisma.article.update({ where: { id: nid }, data: payload });
        res.status(200).json(updated);
        return;
      }

      const raw = fs.readFileSync(DATA_PATH, "utf-8");
      const data = JSON.parse(raw);
      const idx = data.findIndex((a: any) => a.id === nid);
      if (idx === -1) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      data[idx] = { ...data[idx], ...payload };
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
      res.status(200).json(data[idx]);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update article" });
      return;
    }
  }

  res.setHeader("Allow", "GET,PUT,PATCH,OPTIONS");
  res.status(405).json({ error: "Method Not Allowed" });
}

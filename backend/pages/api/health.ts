import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Health Check API
 * للتحقق من أن السيرفر يعمل
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  try {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Backend is running"
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
}

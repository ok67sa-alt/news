import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import prisma from '../../lib/prisma';
import path from 'path';

function runCommand(cmd: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}\nStderr: ${stderr}\nStdout: ${stdout}`);
      } else {
        resolve(stdout || stderr || 'Success');
      }
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { migrate } = req.query;

  if (migrate === 'true') {
    try {
      const projectRoot = process.cwd();
      
      // 1. Run Prisma DB Push (using process.execPath since node isn't in shell PATH)
      const pushOutput = await runCommand(`"${process.execPath}" ./node_modules/prisma/build/index.js db push --accept-data-loss`, projectRoot);
      
      // 2. Run Database Seed
      const seedOutput = await runCommand(`"${process.execPath}" prisma/seed.cjs`, projectRoot);

      return res.status(200).json({
        status: 'success',
        message: 'Migration and seeding executed successfully!',
        pushOutput,
        seedOutput
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Migration or seeding failed',
        error: err.message || String(err)
      });
    }
  }

  // Normal status check
  try {
    const userCount = await prisma.user.count();
    return res.status(200).json({
      status: 'success',
      message: 'Database connection successful!',
      userCount
    });
  } catch (error: any) {
    return res.status(200).json({
      status: 'tables_missing',
      message: 'Database connection works, but tables do not exist. Visit /api/debug-db?migrate=true to create them.',
      error: error.message || String(error)
    });
  }
}

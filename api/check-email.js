import { promises as fs } from 'fs';
const file = 'emails.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Nur POST erlaubt' });
  }

  try {
    const body = req.body;
    const email = body?.email?.toLowerCase();
    if (!email) {
      return res.status(400).json({ zugelassen: false });
    }

    const data = await fs.readFile(file, 'utf8');
    const emails = new Set(JSON.parse(data));

    const zugelassen = emails.has(email);
    res.status(200).json({ zugelassen });
  } catch (err) {
    res.status(500).json({ zugelassen: false, error: err });
  }
} 

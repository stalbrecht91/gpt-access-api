import { promises as fs } from 'fs';
const file = 'emails.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Nur POST erlaubt' });
  }

  try {
    const body = req.body;

    // Falls von systeme.io, holen wir die verschachtelte Email heraus
    const email = body?.email || body?.contact?.email;
    if (!email) {
      return res.status(400).json({ message: 'Keine E-Mail empfangen' });
    }

    const data = await fs.readFile(file, 'utf8');
    const emails = new Set(JSON.parse(data));
    emails.add(email.toLowerCase());

    await fs.writeFile(file, JSON.stringify([...emails]));

    res.status(200).json({ status: 'ok', email });
  } catch (err) {
    res.status(500).json({ message: 'Fehler beim Speichern', error: err });
  }
} 

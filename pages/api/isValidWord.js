const API_URL = process.env.WORD_LOOKUP_API_URL;

export default async function isValidWord(req, res) {
  const word = req.body.word;
  const resp = await fetch(`${API_URL}${word}`);
  const data = await resp.json();
  console.warn("do i get here??", word, data);
  return res.status(200).json({ isValid: Array.isArray(data) });
}

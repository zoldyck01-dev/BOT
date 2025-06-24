const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Sajikan file static (index.html dll)
app.use(express.static(path.join(__dirname)));

// ✅ API Key langsung dimasukkan (⚠️ hanya untuk testing / lokal)
const OPENAI_API_KEY = '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';

// ✅ Endpoint untuk menerima chat
app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ error: 'Prompt tidak boleh kosong' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API Error:', data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ✅ Jalankan server di port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server aktif di http://localhost:${PORT}`);
});
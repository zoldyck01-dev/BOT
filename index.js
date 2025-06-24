const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // install: npm install node-fetch@2
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve file index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const OPENAI_API_KEY = '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';

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
          { role: 'system', content: 'You are a helpful learning assistant.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

const express = require('express');
const app = express();

app.get('/api', (req, res) => {
  res.json({"users":["Tom","Paul","Jane"]});
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
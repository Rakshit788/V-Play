import express from 'express';
import app from './app.js';
const port = 3001;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
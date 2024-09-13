import dotenv from "dotenv"
import express from 'express';

dotenv.config({ path: './env'})

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

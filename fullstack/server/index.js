import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import carRoutes from './routes/cars.js';
import ownerRoutes from './routes/owners.js';

const app = express();
const port = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Data sanitization against XSS
app.use(xssClean());

app.use(bodyParser.json());
app.use(cors());

app.use("/", carRoutes);
app.use("/", ownerRoutes);

app.get("/", (req, res) => res.send("Hello from Express"));
app.all("*", (req, res) => res.send("That route does not exist"));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () =>
    console.log(`Server is listening on port: http://localhost:${port}`)
  );
}

export default app;
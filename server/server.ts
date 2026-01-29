import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
import 'dotenv/config';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
};

app.use(cors(corsOptions));

// Stripe webhook MUST be before express.json()
app.post('/api/stripe', express.raw({type:'application/json'}), stripeWebhook);

app.use(express.json());
app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json({limit:'50mb'}));

// API Routes
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);

// Serve React Frontend in Production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from React build
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    // Handle React routing - return index.html for all non-API routes
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
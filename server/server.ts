import express, { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
import 'dotenv/config';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhook.js';

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.TRUSTED_ORIGINS?.split(',') || [];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cookie',              // ✅ iOS needs this explicitly
    ],
    exposedHeaders: ['Set-Cookie'],  // ✅ Expose Set-Cookie to client
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));

// ✅ Handle preflight explicitly (iOS Safari sends these)
app.options('/{*any}', cors());

app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json({ limit: '50mb' }));
app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
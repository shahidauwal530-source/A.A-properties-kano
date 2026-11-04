import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db.ts';
import { seedDatabase } from './server/seedData.ts';
import authRoutes from './server/routes/authRoutes.ts';
import propertyRoutes from './server/routes/propertyRoutes.ts';
import inspectionRoutes from './server/routes/inspectionRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';
import { toggleFavorite, getFavorites } from './server/controllers/propertyController.ts';
import { getMyInspections } from './server/controllers/inspectionController.ts';
import { authMiddleware } from './server/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Connect to DB and seed initial data
  await connectDB();
  await seedDatabase();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/properties', propertyRoutes);
  app.use('/api/inspections', inspectionRoutes);

  // User shortcuts as requested in prompt:
  // - POST /api/favorites/:propertyId
  // - GET /api/favorites
  // - GET /api/my-inspections
  app.post('/api/favorites/:propertyId', authMiddleware, toggleFavorite);
  app.get('/api/favorites', authMiddleware, getFavorites);
  app.get('/api/my-inspections', authMiddleware, getMyInspections);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      company: 'A.A Properties Kano',
      owner: 'Adam Auwal Adam',
      time: new Date().toISOString(),
    });
  });

  // Vite middleware in dev or static files in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 A.A Properties Kano full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

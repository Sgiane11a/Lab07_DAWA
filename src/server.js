import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import viewRoutes from './routes/views.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedAdminUser from './utils/seedUsers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

// MIDDLEWARES PARA PARSEAR EL BODY DE LA PETICIÓN
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- 1. LÍNEA AÑADIDA

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de Vistas
app.use('/', viewRoutes);

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// MANEJADOR 404
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Página No Encontrada' });
});

// MANEJADOR DE ERRORES
app.use((err, req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
    }
    console.error(err);
    res.status(err.status || 500).render('error', {
        title: 'Error',
        message: err.message || 'Ocurrió un error inesperado.'
    });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then( async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedAdminUser();
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });
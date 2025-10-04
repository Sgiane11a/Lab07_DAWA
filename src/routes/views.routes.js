import express from 'express';
const router = express.Router();

router.get('/signIn', (req, res) => {
    res.render('signIn', { title: 'Iniciar Sesión' });
});

router.get('/signUp', (req, res) => {
    res.render('signUp', { title: 'Registrarse' });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/admin/dashboard', (req, res) => {
    res.render('admin-dashboard', { title: 'Admin Dashboard' });
});

router.get('/profile', (req, res) => {
    res.render('profile', { title: 'Mi Perfil' });
});

router.get('/403', (req, res) => {
    res.status(403).render('403', { title: 'Acceso Denegado' });
});

router.get('/', (req, res) => {
    res.redirect('/dashboard');
});

export default router;
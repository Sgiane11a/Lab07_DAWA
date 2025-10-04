import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {

    // --- MÉTODO signUp CORREGIDO ---
    async signUp(userData) { // Aceptamos el objeto completo 'userData'
        const { email, password, roles = ['user'] } = userData; // Desestructuramos solo lo que necesitamos para validaciones iniciales

        const existing = await userRepository.findByEmail(email);
        if (existing) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400;
            throw err;
        }

        // Validar la complejidad de la contraseña aquí, sobre el texto plano
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            const err = new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial (@$!%*?&).');
            err.status = 400;
            throw err;
        }

        //lógica para encriptar el password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(password, saltRounds);

        // Asignar los role ids
        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }

        // Creamos el objeto final para la base de datos
        // Usamos el spread operator (...) para pasar todos los campos de userData
        // y sobreescribimos 'password' y 'roles' con nuestros valores procesados.
        const userToCreate = {
            ...userData,
            password: hashed,
            roles: roleDocs
        };

        const user = await userRepository.create(userToCreate);

        return {
                id: user._id,
                email: user.email,
                name: user.name
            };
    }

    async signIn({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const token = jwt.sign({ 
            sub: user._id, 
            roles: user.roles.map(r => r.name) }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
            }
        );

        return { token };
    }
}

export default new AuthService();
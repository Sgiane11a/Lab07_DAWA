import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedAdminUser() {
    try {
        const adminEmail = 'admin@example.com';
        const existingAdmin = await userRepository.findByEmail(adminEmail);

        if (!existingAdmin) {
            console.log('Admin user not found, creating one...');

            const adminRole = await roleRepository.findByName('admin');
            if (!adminRole) {
                console.error('Error: "admin" role not found. Please run seedRoles first.');
                return;
            }

            const adminPassword = 'AdminPassword123!';

            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
            const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

            const adminUserData = {
                email: adminEmail,
                password: hashedPassword,
                name: 'Admin',
                lastName: 'User',
                phoneNumber: '999888777',
                birthdate: new Date('1990-01-01'),
                roles: [adminRole._id]
            };

            await userRepository.create(adminUserData);
            
            console.log('============================================');
            console.log('Admin user seeded successfully!');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('¡Guarda esta contraseña en un lugar seguro!');
            console.log('============================================');
        }

    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}
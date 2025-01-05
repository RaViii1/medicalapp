const mongoose = require('mongoose');
const Role = require('./models/Role');
require('dotenv').config(); 
const url = process.env.MONGODB_URL;

async function seedRoles() {
    
    await mongoose.connect(url); 

    const rolesData = [
        { name: 'admin', specializations: [] }, 
        { name: 'user', specializations: [] }, 
        { name: 'doctor', specializations: ['Cardiology', 'Dermatology', 'Pediatrics'] } 
    ];

    for (const roleData of rolesData) {
        const existingRole = await Role.findOne({ name: roleData.name });
        if (!existingRole) {
            const role = new Role(roleData);
            await role.save();
            console.log(`Dodano rolę: ${roleData.name} z specjalizacjami ${roleData.specializations.join(', ')}`);
        }
    }

    await mongoose.disconnect();
}

seedRoles().catch(err => console.error(err));

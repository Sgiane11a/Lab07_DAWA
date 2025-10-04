import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true 
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                const age = new Date(Date.now() - value);
                return Math.abs(age.getUTCFullYear() - 1970) >= 14;
            },
            message: 'Debes ser mayor de 14 años.'
        }
    },
    url_profile: {
        type: String
    },
    address: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
}, { timestamps: true });

// Hash password prima del salvataggio
UserSchema.pre('save', async function (next) {
    // Se la password non è stata modificata, passa al middleware successivo
    if (!this.isModified('password')) return next();

    // Genera un hash della password con fattore di costo 10
    this.password = await bcrypt.hash(this.password, 10);

    next();
});

module.exports = mongoose.model('User', UserSchema);
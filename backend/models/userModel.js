const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Hash password prima del salvataggio
UserSchema.pre('save', async function (next) {
    // Definisce un middleware che si esegue prima dell'operazione 'save'

    if (!this.isModified('password')) return next();
    // Se la password non è stata modificata, passa al middleware successivo

    this.password = await bcrypt.hash(this.password, 10);
    // Genera un hash della password con fattore di costo 10

    next();
    // Passa al middleware successivo
});


module.exports = mongoose.model('User', UserSchema);

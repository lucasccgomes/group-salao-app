const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cliente = new Schema({
    nome: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    foto: {
        type: String,
        required: true,
    },
    dataNascimento: {
        type: String,
        required: true,
    },
    sexo: {
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I'],
        default: 'A',
    },
    documento: {
        tipo: {
            type: String,
            required: true,
        },
        numero: {
            type: String,
            enum: ['individual', 'corporation']
        },
        endereco: {
            cidade: String,
            uf: String,
            cep: String,
            numero: String,
            pais: String,
        },
        dataCadastro: {
            type: Date,
            default: Date.now,
        }
    }
});

salao.index({ geo: '2dsphere' })

module.exports = mongoose.model('Cliente', cliente);
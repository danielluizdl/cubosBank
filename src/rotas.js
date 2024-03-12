const express = require('express');
const { validarSenhaBanco } = require('./middleware');

const {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato
} = require('./controladores/cubosController');

const rotas = express();

rotas.get('/contas', validarSenhaBanco, listarContas);
rotas.get('/contas/saldo', consultarSaldo);
rotas.get('/contas/extrato', emitirExtrato);

rotas.post('/contas', criarConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);

rotas.put('/contas/:numeroConta/usuario', atualizarUsuarioConta);

rotas.delete('/contas/:numeroConta', excluirConta);

module.exports = rotas;

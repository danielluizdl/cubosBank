const bancodedados = require('./bancodedados');

const validarSenhaBanco = (req, res, next) => {
    const senhaBanco = req.query.senha_banco;

    if (!senhaBanco || senhaBanco !== bancodedados.banco.senha) {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }

    next();
};

module.exports = {
    validarSenhaBanco
};
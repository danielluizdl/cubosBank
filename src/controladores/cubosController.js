const { format } = require('date-fns');
const fs = require('fs/promises');
const bancodedadosPath = './src/bancodedados.json';

const formatarDataBrasileira = (data) => {
    return format(new Date(data), "dd/MM/yyyy HH:mm:ss");
};

const listarContas = async (req, res) => {
    try {
        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        res.json(bancodedados.contas);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao listar contas." });
    }
};

const criarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }

    try {
        const dadosCliente = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dadosCliente);

        let maiorNumeroConta = 0;
        bancodedados.contas.forEach(conta => {
            const numeroConta = parseInt(conta.numero);
            if (numeroConta > maiorNumeroConta) {
                maiorNumeroConta = numeroConta;
            }
        });

        const proximoNumeroConta = (maiorNumeroConta + 1).toString().padStart(4, '0');

        const contaComMesmoCPF = bancodedados.contas.find(conta => conta.usuario && conta.usuario.cpf === cpf);

        if (contaComMesmoCPF) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado." });
        }

        const contaComMesmoEmail = bancodedados.contas.find(conta => conta.usuario && conta.usuario.email === email);

        if (contaComMesmoEmail) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o e-mail informado." });
        }

        const saldo = 0;

        const novaConta = { usuario: { nome, cpf, data_nascimento, telefone, email, senha }, numero: proximoNumeroConta, saldo };
        bancodedados.contas.push(novaConta);

        await fs.writeFile(bancodedadosPath, JSON.stringify(bancodedados, null, 4));

        return res.status(201).json({ mensagem: "Conta criada com sucesso." });
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao criar conta." });
    }
};



const atualizarUsuarioConta = async (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    try {
        const dadosCliente = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dadosCliente);

        const contaIndex = bancodedados.contas.findIndex(
            (conta) => conta.numero === numeroConta
        );

        if (contaIndex === -1) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada." });
        }

        const conta = bancodedados.contas[contaIndex];

        if (cpf && bancodedados.contas.some((c) => c.usuario.cpf === cpf && c.numero !== numeroConta)) {
            return res.status(400).json({ mensagem: "CPF já cadastrado." });
        }

        if (email && bancodedados.contas.some((c) => c.usuario.email === email && c.numero !== numeroConta)) {
            return res.status(400).json({ mensagem: "E-mail já cadastrado." });
        }

        conta.usuario.nome = nome || conta.usuario.nome;
        conta.usuario.cpf = cpf || conta.usuario.cpf;
        conta.usuario.data_nascimento = data_nascimento || conta.usuario.data_nascimento;
        conta.usuario.telefone = telefone || conta.usuario.telefone;
        conta.usuario.email = email || conta.usuario.email;
        conta.usuario.senha = senha || conta.usuario.senha;

        await fs.writeFile(bancodedadosPath, JSON.stringify(bancodedados, null, 4));

        res.status(204).end();
    } catch (error) {
        console.error("Erro ao atualizar conta:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao atualizar conta." });
    }
};


const excluirConta = async (req, res) => {
    const numeroConta = req.params.numeroConta;

    try {
        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        const contaIndex = bancodedados.contas.findIndex(conta => conta.numero === numeroConta);

        if (contaIndex === -1) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        const saldoConta = bancodedados.contas[contaIndex].saldo;
        if (saldoConta !== 0) {
            return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
        }

        bancodedados.contas.splice(contaIndex, 1);

        await fs.writeFile(bancodedadosPath, JSON.stringify(bancodedados, null, 4));

        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao excluir conta." });
    }
};

const depositar = async (req, res) => {
    const { numero_conta, valor } = req.body;

    try {
        if (!numero_conta || !valor) {
            return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
        }

        if (valor <= 0) {
            return res.status(400).json({ mensagem: "O valor do depósito deve ser maior que zero!" });
        }

        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        const conta = bancodedados.contas.find(conta => conta.numero === numero_conta);

        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        conta.saldo += valor;

        const dataDeposito = formatarDataBrasileira(new Date());
        const registroDeposito = {
            data: dataDeposito,
            numero_conta,
            valor
        };

        bancodedados.depositos.push(registroDeposito);

        await fs.writeFile(bancodedadosPath, JSON.stringify(bancodedados, null, 4));

        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao registrar depósito:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao registrar depósito." });
    }
};


const sacar = async (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Número da conta, valor do saque e senha são obrigatórios." });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor do saque deve ser maior que zero." });
    }

    try {
        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        const conta = bancodedados.contas.find(conta => conta.numero === numero_conta);

        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        if (conta.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }

        if (conta.saldo < valor) {
            return res.status(403).json({ mensagem: "Saldo insuficiente para realizar o saque!" });
        }

        conta.saldo -= valor;

        const dataSaque = formatarDataBrasileira(new Date());
        const registroSaque = { dataSaque, numero_conta, valor };

        bancodedados.saques.push(registroSaque);

        await fs.writeFile(bancodedadosPath, JSON.stringify(bancodedados, null, 4));

        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao sacar:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao sacar." });
    }
};


const transferir = async (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Número da conta de origem, número da conta de destino, valor da transferência e senha são obrigatórios." });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: "O valor da transferência deve ser maior que zero." });
    }

    try {
        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        const contaOrigem = bancodedados.contas.find(conta => conta.numero === numero_conta_origem);

        if (!contaOrigem) {
            return res.status(404).json({ mensagem: "Conta bancária de origem não encontrada!" });
        }

        const contaDestino = bancodedados.contas.find(conta => conta.numero === numero_conta_destino);

        if (!contaDestino) {
            return res.status(404).json({ mensagem: "Conta bancária de destino não encontrada!" });
        }

        if (numero_conta_origem === numero_conta_destino) {
            return res.status(400).json({ mensagem: "Não é possível transferir para a mesma conta de origem!" });
        }

        if (contaOrigem.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }

        if (contaOrigem.saldo < valor) {
            return res.status(403).json({ mensagem: "Saldo insuficiente para realizar a transferência!" });
        }

        contaOrigem.saldo -= valor;

        contaDestino.saldo += valor;

        const dataTransferencia = formatarDataBrasileira(new Date());
        const registroTransferencia = { dataTransferencia, numero_conta_origem, numero_conta_destino, valor };

        bancodedados.transferencias.push(registroTransferencia);

        await fs.writeFile(bancodedadosPath, JSON.stringify(bancodedados, null, 4));

        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao transferir:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao transferir." });
    }
};


const consultarSaldo = async (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios." });
    }
    try {
        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        const conta = bancodedados.contas.find(conta => conta.numero === numero_conta);

        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        if (conta.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }

        return res.status(200).json({ saldo: conta.saldo });
    } catch (error) {
        console.error("Erro ao obter saldo da conta:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao obter saldo da conta." });
    }
};

const emitirExtrato = async (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios." });
    }
    try {
        const dados = await fs.readFile(bancodedadosPath, 'utf-8');
        const bancodedados = JSON.parse(dados);

        const conta = bancodedados.contas.find(conta => conta.numero === numero_conta);

        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        if (conta.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" });
        }

        const depositos = bancodedados.depositos.filter(deposito => deposito.numero_conta === numero_conta);
        const saques = bancodedados.saques.filter(saques => saques.numero_conta === numero_conta);
        const transferenciasEnviadas = bancodedados.transferencias.filter(transferencia => transferencia.numero_conta_origem === numero_conta);
        const transferenciasRecebidas = bancodedados.transferencias.filter(transferencia => transferencia.numero_conta_destino === numero_conta);

        const extrato = {
            depositos,
            saques,
            transferenciasEnviadas,
            transferenciasRecebidas
        };

        return res.status(200).json(extrato);
    } catch (error) {
        console.error("Erro ao emitir extrato:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor ao emitir extrato." });
    }
};

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato
}
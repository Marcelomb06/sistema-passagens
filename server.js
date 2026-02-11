const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Banco de dados simulado em memória
let reservas = [];
let idCounter = 1;

// Rotas da API

// Buscar voos
app.post('/api/voos/buscar', (req, res) => {
    const { origem, destino, dataIda, passageiros } = req.body;
    
    const companhias = ['LATAM', 'GOL', 'Azul', 'Avianca'];
    const voos = [];
    
    for (let i = 0; i < 5; i++) {
        const hora = 6 + (i * 3);
        const minuto = Math.floor(Math.random() * 60);
        const precoBase = 200 + Math.random() * 800;
        const preco = (precoBase * passageiros).toFixed(2);
        
        voos.push({
            id: i + 1,
            companhia: companhias[Math.floor(Math.random() * companhias.length)],
            horario: `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`,
            duracao: `${2 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}min`,
            preco: preco,
            origem: origem,
            destino: destino,
            data: dataIda,
            assentosDisponiveis: Math.floor(Math.random() * 50) + 10
        });
    }
    
    res.json({ success: true, voos });
});

// Criar reserva
app.post('/api/reservas', (req, res) => {
    const { voo, passageiro, pagamento } = req.body;
    
    const reserva = {
        id: idCounter++,
        voo,
        passageiro,
        pagamento: {
            forma: pagamento.forma,
            status: 'confirmado'
        },
        dataReserva: new Date().toISOString(),
        codigoReserva: `AV${Date.now().toString().slice(-8)}`
    };
    
    reservas.push(reserva);
    
    res.json({ 
        success: true, 
        reserva,
        mensagem: 'Reserva criada com sucesso!'
    });
});

// Buscar reserva por código
app.get('/api/reservas/:codigo', (req, res) => {
    const reserva = reservas.find(r => r.codigoReserva === req.params.codigo);
    
    if (reserva) {
        res.json({ success: true, reserva });
    } else {
        res.status(404).json({ success: false, mensagem: 'Reserva não encontrada' });
    }
});

// Listar todas as reservas
app.get('/api/reservas', (req, res) => {
    res.json({ success: true, reservas });
});

// Cancelar reserva
app.delete('/api/reservas/:codigo', (req, res) => {
    const index = reservas.findIndex(r => r.codigoReserva === req.params.codigo);
    
    if (index !== -1) {
        reservas.splice(index, 1);
        res.json({ success: true, mensagem: 'Reserva cancelada com sucesso' });
    } else {
        res.status(404).json({ success: false, mensagem: 'Reserva não encontrada' });
    }
});

// Validar CPF
app.post('/api/validar/cpf', (req, res) => {
    const { cpf } = req.body;
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length === 11) {
        res.json({ success: true, valido: true });
    } else {
        res.json({ success: false, valido: false, mensagem: 'CPF inválido' });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Sistema de Vendas de Passagens Aéreas`);
});

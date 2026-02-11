// Dados globais
let dadosBusca = {};
let vooSelecionado = {};
let dadosPassageiro = {};
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

const companhias = ['LATAM', 'GOL', 'Azul', 'Avianca'];

// Tema
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.querySelector('.theme-toggle i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Carregar tema salvo
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataIda').min = hoje;
    document.getElementById('dataVolta').min = hoje;
    
    carregarOfertas();
    carregarReservas();
    
    // Controlar visibilidade do campo data de volta
    document.querySelectorAll('input[name="tripType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const formRow = document.querySelector('.form-row.dates-row');
            const dataVoltaGroup = document.getElementById('dataVolta').closest('.form-group');
            
            if (this.value === 'somente-ida') {
                formRow.style.gridTemplateColumns = '1fr';
                dataVoltaGroup.style.display = 'none';
                document.getElementById('dataVolta').value = '';
                document.getElementById('dataVolta').removeAttribute('required');
            } else {
                formRow.style.gridTemplateColumns = '1fr 1fr';
                dataVoltaGroup.style.display = 'block';
            }
        });
    });
});

// Navegação
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0, 0);
    
    // Recarregar reservas ao abrir a seção
    if (sectionId === 'minhasReservas') {
        carregarReservas();
    }
}

// Gerar voos
function gerarVoos(origem, destino, data, passageiros, classe) {
    const voos = [];
    const numVoos = 8;
    
    for (let i = 0; i < numVoos; i++) {
        const hora = 6 + (i * 2);
        const minuto = Math.floor(Math.random() * 60);
        let precoBase = 200 + Math.random() * 800;
        
        if (classe === 'executiva') precoBase *= 2;
        if (classe === 'primeira') precoBase *= 3;
        
        const preco = (precoBase * passageiros).toFixed(2);
        const duracaoHoras = 2 + Math.floor(Math.random() * 3);
        const duracaoMinutos = Math.floor(Math.random() * 60);
        
        voos.push({
            id: i + 1,
            companhia: companhias[Math.floor(Math.random() * companhias.length)],
            horario: `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`,
            duracao: `${duracaoHoras}h ${duracaoMinutos}min`,
            duracaoMinutos: duracaoHoras * 60 + duracaoMinutos,
            preco: parseFloat(preco),
            origem: origem,
            destino: destino,
            data: data,
            classe: classe
        });
    }
    
    return voos;
}

// Exibir voos
function exibirVoos(voos) {
    const listaVoos = document.getElementById('listaVoos');
    listaVoos.innerHTML = '';
    
    voos.forEach(voo => {
        const vooCard = document.createElement('div');
        vooCard.className = 'voo-card';
        vooCard.innerHTML = `
            <div class="voo-info">
                <h3><i class="fas fa-plane"></i> ${voo.companhia}</h3>
                <p><i class="fas fa-clock"></i> <strong>Horário:</strong> ${voo.horario}</p>
                <p><i class="fas fa-hourglass-half"></i> <strong>Duração:</strong> ${voo.duracao}</p>
                <p><i class="fas fa-route"></i> <strong>Rota:</strong> ${voo.origem} → ${voo.destino}</p>
                <p><i class="fas fa-chair"></i> <strong>Classe:</strong> ${voo.classe.charAt(0).toUpperCase() + voo.classe.slice(1)}</p>
            </div>
            <div class="voo-preco">
                <div class="preco">R$ ${voo.preco.toFixed(2)}</div>
                <button class="btn-selecionar" onclick="selecionarVoo(${voo.id})">
                    <i class="fas fa-check"></i> Selecionar
                </button>
            </div>
        `;
        listaVoos.appendChild(vooCard);
    });
}

// Filtrar voos
function filtrarVoos(tipo) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let voosFiltrados = [...dadosBusca.voos];
    
    if (tipo === 'preco') {
        voosFiltrados.sort((a, b) => a.preco - b.preco);
    } else if (tipo === 'duracao') {
        voosFiltrados.sort((a, b) => a.duracaoMinutos - b.duracaoMinutos);
    } else if (tipo === 'horario') {
        voosFiltrados.sort((a, b) => {
            const horaA = parseInt(a.horario.split(':')[0]);
            const horaB = parseInt(b.horario.split(':')[0]);
            return Math.abs(horaA - 12) - Math.abs(horaB - 12);
        });
    }
    
    exibirVoos(voosFiltrados);
}

// Selecionar voo
function selecionarVoo(vooId) {
    vooSelecionado = dadosBusca.voos.find(v => v.id === vooId);
    exibirResumoVoo();
    showSection('passageiro');
}

// Exibir resumo
function exibirResumoVoo() {
    const resumoHTML = `
        <h3><i class="fas fa-ticket-alt"></i> Resumo do Voo</h3>
        <p><strong>Companhia:</strong> ${vooSelecionado.companhia}</p>
        <p><strong>Origem:</strong> ${vooSelecionado.origem}</p>
        <p><strong>Destino:</strong> ${vooSelecionado.destino}</p>
        <p><strong>Data:</strong> ${formatarData(vooSelecionado.data)}</p>
        <p><strong>Horário:</strong> ${vooSelecionado.horario}</p>
        <p><strong>Classe:</strong> ${vooSelecionado.classe.charAt(0).toUpperCase() + vooSelecionado.classe.slice(1)}</p>
        <p><strong>Valor Total:</strong> R$ ${vooSelecionado.preco.toFixed(2)}</p>
    `;
    
    document.getElementById('resumoVoo').innerHTML = resumoHTML;
    document.getElementById('resumoPagamento').innerHTML = resumoHTML;
}

// Formatar data
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Toggle pagamento
function togglePagamento() {
    const forma = document.getElementById('formaPagamento').value;
    const camposCartao = document.getElementById('camposCartao');
    const camposPix = document.getElementById('camposPix');
    
    if (forma === 'cartao') {
        camposCartao.style.display = 'block';
        camposPix.style.display = 'none';
    } else {
        camposCartao.style.display = 'none';
        camposPix.style.display = 'block';
    }
}

// Exibir confirmação
function exibirConfirmacao() {
    const codigoReserva = 'AV' + Date.now().toString().slice(-8);
    
    const reserva = {
        codigo: codigoReserva,
        passageiro: dadosPassageiro,
        voo: vooSelecionado,
        data: new Date().toISOString()
    };
    
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    
    const resumoFinal = document.getElementById('resumoFinal');
    resumoFinal.innerHTML = `
        <p><strong><i class="fas fa-barcode"></i> Código da Reserva:</strong> ${codigoReserva}</p>
        <p><strong><i class="fas fa-user"></i> Passageiro:</strong> ${dadosPassageiro.nome}</p>
        <p><strong><i class="fas fa-id-card"></i> CPF:</strong> ${dadosPassageiro.cpf}</p>
        <p><strong><i class="fas fa-envelope"></i> Email:</strong> ${dadosPassageiro.email}</p>
        <p><strong><i class="fas fa-phone"></i> Telefone:</strong> ${dadosPassageiro.telefone}</p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid var(--border);">
        <p><strong><i class="fas fa-plane"></i> Companhia:</strong> ${vooSelecionado.companhia}</p>
        <p><strong><i class="fas fa-map-marker-alt"></i> Origem:</strong> ${vooSelecionado.origem}</p>
        <p><strong><i class="fas fa-map-marker-alt"></i> Destino:</strong> ${vooSelecionado.destino}</p>
        <p><strong><i class="fas fa-calendar"></i> Data:</strong> ${formatarData(vooSelecionado.data)}</p>
        <p><strong><i class="fas fa-clock"></i> Horário:</strong> ${vooSelecionado.horario}</p>
        <hr style="margin: 20px 0; border: none; border-top: 2px solid var(--border);">
        <p style="font-size: 28px; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            <strong>Valor Total: R$ ${vooSelecionado.preco.toFixed(2)}</strong>
        </p>
    `;
}

// Baixar bilhete
function baixarBilhete() {
    alert('Bilhete enviado para seu email! 📧');
}

// Resetar
function resetarSistema() {
    dadosBusca = {};
    vooSelecionado = {};
    dadosPassageiro = {};
    document.getElementById('formBusca').reset();
    document.getElementById('formPassageiro').reset();
    document.getElementById('formPagamento').reset();
}

// Carregar ofertas
function carregarOfertas() {
    const ofertas = [
        {
            destino: 'Rio de Janeiro',
            descricao: 'Cidade Maravilhosa te espera!',
            preco: 299.90,
            desconto: '50% OFF',
            imagem: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400'
        },
        {
            destino: 'Salvador',
            descricao: 'Praias paradisíacas da Bahia',
            preco: 349.90,
            desconto: '40% OFF',
            imagem: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400'
        },
        {
            destino: 'Fortaleza',
            descricao: 'Sol e mar o ano todo',
            preco: 399.90,
            desconto: '35% OFF',
            imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'
        },
        {
            destino: 'Manaus',
            descricao: 'Aventura na Amazônia',
            preco: 449.90,
            desconto: '30% OFF',
            imagem: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400'
        }
    ];
    
    const grid = document.getElementById('ofertasGrid');
    grid.innerHTML = '';
    
    ofertas.forEach(oferta => {
        const card = document.createElement('div');
        card.className = 'oferta-card';
        card.innerHTML = `
            <img src="${oferta.imagem}" alt="${oferta.destino}" class="oferta-img">
            <div class="oferta-content">
                <span class="oferta-badge">${oferta.desconto}</span>
                <h3>${oferta.destino}</h3>
                <p>${oferta.descricao}</p>
                <div class="oferta-preco">
                    <span class="preco">R$ ${oferta.preco.toFixed(2)}</span>
                    <button class="btn-primary" onclick="preencherBusca('São Paulo', '${oferta.destino}')">
                        <i class="fas fa-search"></i> Ver
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Preencher busca
function preencherBusca(origem, destino) {
    document.getElementById('origem').value = origem;
    document.getElementById('destino').value = destino;
    showSection('busca');
}

// Carregar reservas
function carregarReservas() {
    const lista = document.getElementById('listaReservas');
    if (!lista) return;
    
    reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    
    if (reservas.length === 0) {
        lista.innerHTML = '<div class="form-card" style="text-align: center; padding: 60px;"><i class="fas fa-inbox" style="font-size: 64px; color: var(--text-secondary); margin-bottom: 20px;"></i><p style="color: var(--text-secondary); font-size: 18px;">Nenhuma reserva encontrada</p></div>';
        return;
    }
    
    lista.innerHTML = '';
    const reservasReversed = [...reservas].reverse();
    reservasReversed.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'voo-card';
        card.innerHTML = `
            <div class="voo-info">
                <h3><i class="fas fa-ticket-alt"></i> ${reserva.codigo}</h3>
                <p><i class="fas fa-user"></i> ${reserva.passageiro.nome}</p>
                <p><i class="fas fa-plane"></i> ${reserva.voo.origem} → ${reserva.voo.destino}</p>
                <p><i class="fas fa-calendar"></i> ${formatarData(reserva.voo.data)} às ${reserva.voo.horario}</p>
            </div>
            <div class="voo-preco">
                <div class="preco">R$ ${reserva.voo.preco.toFixed(2)}</div>
                <button class="btn-secondary" onclick="verDetalhesReserva('${reserva.codigo}')">
                    <i class="fas fa-eye"></i> Detalhes
                </button>
            </div>
        `;
        lista.appendChild(card);
    });
}

// Buscar reserva
function buscarReserva() {
    const codigo = document.getElementById('codigoReserva').value.trim();
    if (!codigo) {
        alert('Digite um código de reserva');
        return;
    }
    
    const reserva = reservas.find(r => r.codigo === codigo);
    if (reserva) {
        verDetalhesReserva(codigo);
    } else {
        alert('Reserva não encontrada');
    }
}

// Ver detalhes
function verDetalhesReserva(codigo) {
    const reserva = reservas.find(r => r.codigo === codigo);
    if (!reserva) return;
    
    alert(`
Código: ${reserva.codigo}
Passageiro: ${reserva.passageiro.nome}
CPF: ${reserva.passageiro.cpf}
Voo: ${reserva.voo.origem} → ${reserva.voo.destino}
Data: ${formatarData(reserva.voo.data)}
Horário: ${reserva.voo.horario}
Valor: R$ ${reserva.voo.preco.toFixed(2)}
    `);
}

// Event Listeners
document.getElementById('formBusca').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;
    const dataIda = document.getElementById('dataIda').value;
    const dataVolta = document.getElementById('dataVolta').value;
    const passageiros = parseInt(document.getElementById('passageiros').value);
    const classe = document.getElementById('classe').value;
    
    const hoje = new Date().toISOString().split('T')[0];
    if (dataIda < hoje) {
        alert('A data de ida não pode ser anterior a hoje!');
        return;
    }
    
    if (dataVolta && dataVolta < dataIda) {
        alert('A data de volta não pode ser anterior à data de ida!');
        return;
    }
    
    dadosBusca = {
        origem,
        destino,
        dataIda,
        dataVolta,
        passageiros,
        classe,
        voos: gerarVoos(origem, destino, dataIda, passageiros, classe)
    };
    
    exibirVoos(dadosBusca.voos);
    showSection('resultados');
});

document.getElementById('formPassageiro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    dadosPassageiro = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    };
    
    const cpf = dadosPassageiro.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
        alert('CPF inválido! Digite 11 dígitos.');
        return;
    }
    
    showSection('pagamento');
});

document.getElementById('formPagamento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const forma = document.getElementById('formaPagamento').value;
    
    if (forma === 'cartao') {
        const nomeCartao = document.getElementById('nomeCartao').value;
        const numeroCartao = document.getElementById('numeroCartao').value;
        const validade = document.getElementById('validade').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!nomeCartao || !numeroCartao || !validade || !cvv) {
            alert('Preencha todos os campos do cartão!');
            return;
        }
        
        const numero = numeroCartao.replace(/\D/g, '');
        if (numero.length !== 16) {
            alert('Número do cartão inválido!');
            return;
        }
    }
    
    exibirConfirmacao();
    showSection('confirmacao');
});

// Máscaras
document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    }
});

document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    }
});

document.getElementById('numeroCartao').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    }
});

document.getElementById('validade').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
        value = value.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = value;
    }
});

document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

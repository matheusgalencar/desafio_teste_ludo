function criarJogo() {
  return { jogadorAtual: 0, seisConsecutivos: 0, peoes: Array.from({ length: 2 }, () => Array.from({ length: 4 }, () => ({ passos: -1 }))), vencedor: null };
}

function validarDado(dado) { if (!Number.isInteger(dado) || dado < 1 || dado > 6) throw new RangeError('Dado deve ser inteiro entre 1 e 6'); }
function casaGlobal(jogador, passos) {
  if (![0,1].includes(jogador)) throw new RangeError('Jogador inválido');
  return Number.isInteger(passos) && passos >= 0 && passos <= 50 ? ((jogador === 0 ? 0 : 26) + passos) % 52 : null;
}

function jogadasLegais(jogo, dado) {
  validarDado(dado);
  if (jogo.vencedor !== null || (dado === 6 && jogo.seisConsecutivos === 2)) return [];
  return jogo.peoes[jogo.jogadorAtual].flatMap((peao, indice) => {
    const passos = peao.passos;
    const pode = passos === -1 ? dado === 6 : passos < 57 && passos + dado <= 57;
    return pode ? [indice] : [];
  });
}

function jogar(jogo, dado, indicePeao) {
  validarDado(dado);
  if (jogo.vencedor !== null) throw new Error('Partida encerrada');
  const legais = jogadasLegais(jogo, dado);
  if (!legais.length) {
    if (indicePeao !== null) throw new Error('Não há movimento legal');
    jogo.jogadorAtual = 1 - jogo.jogadorAtual;
    jogo.seisConsecutivos = 0;
    return jogo;
  }
  if (!legais.includes(indicePeao)) throw new Error('Peão ou movimento ilegal');
  const jogador = jogo.jogadorAtual, peao = jogo.peoes[jogador][indicePeao];
  peao.passos = peao.passos === -1 ? 0 : peao.passos + dado;
  const casa = casaGlobal(jogador, peao.passos);
  if (casa !== null && casa !== 0 && casa !== 26) {
    const adversario = 1 - jogador;
    for (const outro of jogo.peoes[adversario]) if (casaGlobal(adversario, outro.passos) === casa) outro.passos = -1;
  }
  if (jogo.peoes[jogador].every(p => p.passos === 57)) jogo.vencedor = jogador;
  else if (dado === 6) jogo.seisConsecutivos++;
  else { jogo.jogadorAtual = 1 - jogador; jogo.seisConsecutivos = 0; }
  return jogo;
}

module.exports = { criarJogo, jogadasLegais, jogar, casaGlobal };

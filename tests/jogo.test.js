const test = require('node:test');
const assert = require('node:assert/strict');
const { criarJogo, jogadasLegais, jogar, casaGlobal } = require('../src/jogo.js');

const pos = (estado, jogador, indice, passos) => { estado.peoes[jogador][indice].passos = passos; return estado; };

test('LU01: dois jogadores com quatro peões na base', () => {
  const jogo = criarJogo();
  assert.equal(jogo.jogadorAtual, 0);
  assert.equal(jogo.seisConsecutivos, 0);
  assert.equal(jogo.peoes.length, 2);
  assert.deepEqual(jogo.peoes.map(mao => mao.map(p => p.passos)), [[-1,-1,-1,-1],[-1,-1,-1,-1]]);
  assert.equal(jogo.vencedor, null);
});

test('LU02: saída da base exige 6 e dado válido', () => {
  const jogo = criarJogo();
  assert.deepEqual(jogadasLegais(jogo, 1), []);
  assert.deepEqual(jogadasLegais(jogo, 6), [0,1,2,3]);
  assert.throws(() => jogadasLegais(jogo, 0), RangeError);
  assert.throws(() => jogar(jogo, 7, 0), RangeError);
  const novo = jogar(jogo, 6, 0);
  assert.equal(novo.peoes[0][0].passos, 0);
});

test('LU03: circuito mapeia entradas e movimento', () => {
  assert.equal(casaGlobal(0, 0), 0);
  assert.equal(casaGlobal(1, 0), 26);
  assert.equal(casaGlobal(0, 50), 50);
  assert.equal(casaGlobal(0, 51), null);
  const jogo = pos(criarJogo(), 0, 0, 5);
  assert.equal(jogar(jogo, 3, 0).peoes[0][0].passos, 8);
});

test('LU04: 6 repete turno; outro valor passa e zera sequência', () => {
  let jogo = jogar(criarJogo(), 6, 0);
  assert.equal(jogo.jogadorAtual, 0);
  assert.equal(jogo.seisConsecutivos, 1);
  jogo = jogar(jogo, 2, 0);
  assert.equal(jogo.jogadorAtual, 1);
  assert.equal(jogo.seisConsecutivos, 0);
});

test('LU05: terceiro 6 perde a jogada sem mover peão', () => {
  let jogo = jogar(criarJogo(), 6, 0);
  jogo = jogar(jogo, 6, 1);
  const antes = jogo.peoes[0].map(p => p.passos);
  jogo = jogar(jogo, 6, null);
  assert.deepEqual(jogo.peoes[0].map(p => p.passos), antes);
  assert.equal(jogo.jogadorAtual, 1);
  assert.equal(jogo.seisConsecutivos, 0);
});

test('LU06: captura em casa comum devolve o adversário à base', () => {
  let jogo = pos(criarJogo(), 0, 0, 4);
  jogo = pos(jogo, 1, 0, 31); // casa global 5
  jogo = jogar(jogo, 1, 0);
  assert.equal(jogo.peoes[0][0].passos, 5);
  assert.equal(jogo.peoes[1][0].passos, -1);
});

test('LU07: entradas globais 0 e 26 são seguras', () => {
  let jogo = pos(criarJogo(), 0, 0, 25);
  jogo = pos(jogo, 1, 0, 0); // casa global 26
  jogo = jogar(jogo, 1, 0);
  assert.equal(jogo.peoes[1][0].passos, 0);
});

test('LU08: chegada exige valor exato', () => {
  const jogo = pos(criarJogo(), 0, 0, 55);
  assert.deepEqual(jogadasLegais(jogo, 3), []);
  assert.deepEqual(jogadasLegais(jogo, 2), [0]);
  assert.equal(jogar(jogo, 2, 0).peoes[0][0].passos, 57);
});

test('LU09: quatro peões na chegada encerram a partida', () => {
  let jogo = criarJogo();
  [0,1,2].forEach(i => { jogo = pos(jogo, 0, i, 57); });
  jogo = pos(jogo, 0, 3, 56);
  assert.deepEqual(jogadasLegais(jogo, 1), [3]);
  jogo = jogar(jogo, 1, 3);
  assert.equal(jogo.vencedor, 0);
});

test('LU10: sem movimento legal, o turno passa', () => {
  const jogo = jogar(criarJogo(), 1, null);
  assert.equal(jogo.jogadorAtual, 1);
});

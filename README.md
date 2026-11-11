# Desafio: testes de Ludo

## Colaboradores

- Matheus Goulart de Alencar 24131995-2
- Miguel Falcão Costacurta 24011302-2

## Especificação adotada

Partida para **dois jogadores**, com quatro peões por jogador, dado de 1 a 6 e trilha circular de 52 casas. O jogador `0` entra na casa global `0`; o jogador `1`, na `26`. Cada peão tem `passos` de `-1` (base) até `57` (chegada). Com `6`, um peão sai da base para `passos: 0`; movimentos seguintes somam o dado. Os passos `0..50` ficam no circuito; `51..56` ficam na reta final privativa; `57` é a chegada. A casa global de um peão no circuito é `(inicioDoJogador + passos) % 52`. É necessário valor **exato** para chegar: movimento acima de 57 é proibido.

Casas globais `0` e `26` são seguras. Ao terminar em uma casa comum ocupada por peão adversário, o peão adversário volta à base. Captura não ocorre em casa segura, na reta final nem na chegada. Depois de tirar `6`, o mesmo jogador joga novamente. Três resultados `6` consecutivos no mesmo turno fazem perder a jogada e passam a vez, sem mover peão no terceiro lançamento. Qualquer outro resultado zera a contagem. Fora isso, o turno passa depois do movimento; se não houver movimento legal, também passa. Vence quem colocar os quatro peões na chegada. Não há bloqueio de casas por dois peões nem regra de lançamento extra por captura nesta variante.

## API implementada em `src/jogo.js`

Exportações CommonJS:

- `criarJogo()`: retorna `{ jogadorAtual: 0, seisConsecutivos: 0, peoes: [[{passos:-1}, ...], [{passos:-1}, ...]], vencedor: null }` com quatro peões por jogador.
- `jogadasLegais(estado, dado)`: retorna índices dos peões do `jogadorAtual` que podem mover; dado fora de `1..6` lança `RangeError`.
- `jogar(estado, dado, indicePeao)`: retorna novo estado após lançar dado e mover o peão. Índice ilegal lança `Error`. Para terceiro `6` ou quando não existir movimento legal, `indicePeao` deve ser `null` e a vez passa sem movimento.
- `casaGlobal(jogador, passos)`: retorna índice `0..51` para `passos` de `0..50`, ou `null` para base, reta final e chegada.

Os testes podem montar estados específicos a partir de `criarJogo()` para verificar capturas e chegada. O estado retornado por `jogar` é a referência para a ação seguinte.

## Casos de teste

| ID | Cenário e resultado esperado |
| --- | --- |
| LU01 | Estado inicial: dois jogadores, quatro peões em cada base, jogador 0 inicia. |
| LU02 | Só `6` permite sair da base; dado fora de `1..6` é recusado. |
| LU03 | Movimento no circuito e mapeamento das entradas 0/26. |
| LU04 | `6` concede outro turno; resultado diferente passa a vez e zera sequência. |
| LU05 | Terceiro `6` consecutivo perde a jogada, sem mover peão. |
| LU06 | Captura em casa comum devolve adversário à base. |
| LU07 | Casas de entrada são seguras e não permitem captura. |
| LU08 | Reta final é privativa; chegar exige dado exato. |
| LU09 | Peão que chegou não se move; quatro peões na chegada dão vitória. |
| LU10 | Sem movimento legal, o turno passa. |

## Como os testes funcionam

`tests/jogo.test.js` executa `src/jogo.js` com valores fixos do dado e peões em posições estratégicas. Usa `node:test` e `node:assert/strict`; execute `npm test` com Node.js 20+. **Resultado verificado: 10 testes aprovados.**

testeConnection
===============

Testes da Aula 14/03/2014 - Teste de Estados e Diferentes Conexoes

Servidor estatico usando express(definicao paths) e socket.io(comunicacoes)...

Aplicaçao de teste de varias paths e varios estados.
  ->"localhost:80" -> para cliente mobile (player.html)
  ->"localhost:80/jogo" -> para ecra publico (testeConnect.html)
  
Descricao da Aplicacao:

  -> Existem 3 estados:
      -> InGame: cliente mobile pronto a jogar,
      -> InQueue: cliente mobile em fila de espera(a qualquer momento pode.se registar para o jogo),
      -> outGame: cliente mobile nao participa no jogo porque servidor atingui o limite de jogadores(neste caso 12j);
      
  -> Quando o servidor recebe um novo cliente mobile, da.lhe um id e uma cor e adiciona.o na fila de espera.
  -> O cliente mobile tem a oportunidade de se registar no jogo, e fica com o status "inGame",
  -> Os clientes mobiles sao avisados do ser estado actual,
  
  Ecra publico:
  
  -> Apresenta os clientes mobile com status inGame e inQueue, clientes com status outGame nao aparecem... 

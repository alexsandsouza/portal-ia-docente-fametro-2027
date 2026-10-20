# Contract: superfície da participante

Rotas em português na interface. Autorização sempre no servidor. Sem senha.

## `GET /inscricao`

Formulário com nome completo e e-mail, rótulos visíveis e envio por teclado.

## `POST /inscricao`

Entrada: `fullName`, `email`.

Sucesso: cria `participant` e `enrollment` em `pending`, mostra o comprovante com identificador e estado, e dispara o vínculo da versão vigente para o e-mail.

Erros, sem criar inscrição:

- nome vazio ou e-mail inválido, indicando o campo;
- e-mail que já possui inscrição ativa, respondendo apenas «este e-mail já possui inscrição», sem nome, estado nem identificador, quando não há vínculo vigente;
- sequência repetida acima do limite, com recusa temporária.

## `GET /auth/confirm`

Entrada: retorno do magic link e a versão do vínculo.

Sucesso: versão igual à vigente abre somente a ficha daquela pessoa.

Erro: versão antiga ou vínculo de outra pessoa não mostra ficha.

## `GET /ficha`

Exige o vínculo vigente. Mostra estado da inscrição, check-in se existir, andamento dos cinco desafios e pedidos da pessoa titular, cada um com data quando o evento existe.

## `GET /materiais`

Exige inscrição. Lista só materiais publicados, com título, descrição e destino. Lista vazia mostra orientação em português.

## `GET /laboratorio`

Exige inscrição. Mostra exatamente cinco desafios e o andamento de cada um.

## `POST /laboratorio/{position}/concluir`

Exige inscrição confirmada e enunciado presente. Grava `completed` e a data. Sem enunciado, recusa e mantém `waiting_for_content`. Sem confirmação, recusa.

## `GET /check-in/codigo`

Exige inscrição confirmada. Mostra o código em texto e em QR Code. O QR Code não contém nome nem e-mail. Inscrição pendente não tem código.

## `GET /certificado`

Sem autorização da equipe, explica que a emissão não foi autorizada e não gera arquivo. Com autorização, devolve o PDF em português com nome, formação, instituição, data e código.

## `POST /meus-dados/acesso`

Mostra nome e e-mail guardados e registra o pedido com data. Não mostra controlador, encarregado, base legal nem prazo de retenção.

## `POST /meus-dados/correcao`

Entrada: nome novo. Atualiza a ficha e registra o nome anterior, o nome novo e a data.

## `POST /meus-dados/exclusao`

Registra o pedido visível para a participante e para a equipe. Não apaga os dados.

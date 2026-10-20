# Contract: superfície operacional

Prefixo `/operacao`. Sessão sem e-mail na lista operacional recebe recusa e não altera dados. Cada ação bem-sucedida grava `operational_action` com autor e data.

## `GET /operacao`

Lista inscrições e o estado de cada uma.

## `POST /operacao/inscricoes/{id}/confirmar`

Somente de `pending` para `confirmed`. Preenche `confirmed_at` e `confirmed_by`. A participante não chama esta ação com sucesso.

## `POST /operacao/check-in`

Entrada: código opaco, lido ou digitado.

Sucesso: um `check_in` com data e hora para a inscrição confirmada daquele código.

Erros, sem novo registro:

- código inexistente;
- inscrição não confirmada;
- check-in já existente, informando que ele já foi feito;
- sequência inválida acima do limite.

A resposta de sucesso identifica a pessoa só o bastante para a operação presencial e não publica a ficha inteira na tela de leitura.

## `POST /operacao/materiais`

Entrada: título, descrição, URL do Drive e publicação. URL fora de `https://drive.google.com` ou `https://docs.google.com` é recusada.

## `POST /operacao/materiais/{id}/retirar`

`published` passa a falso. O item some da biblioteca da participante.

## `POST /operacao/desafios/{position}`

Atualiza título e enunciado. Não apaga andamento já concluído.

## `POST /operacao/certificados/{participantId}`

Cria o único certificado da participante. Check-in e cinco conclusões não dispensam esta ação. Segunda autorização não cria outro código vigente.

## `GET /operacao/fichas/{participantId}`

Mostra os mesmos eventos que a participante vê na própria ficha, mais o histórico operacional daquele registro.

# Quickstart: validar o Portal da Formação Docente 2027

Este guia prova a spec. Ele não implementa o portal. Os comandos passam a valer quando a fase de implementação criar a aplicação.

## Antes de implementar

- Node.js LTS e npm ainda precisam ser instalados nesta máquina.
- O projeto Supabase e o projeto Vercel ainda não existem. Não inventar URL nem chave.
- Variáveis previstas, sem valores neste arquivo: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPERATIONAL_EMAILS`.
- `.env.local` fica fora do Git. O `.gitignore` já cobre `.env` e `.env.*`.

## Arranque previsto

```text
npm install
npm run dev
npm test
npm run test:e2e
```

A aplicação local usa o endereço de desenvolvimento do Next.js. Esse endereço não é o endereço de produção.

## Cenários

Os detalhes de entrada e saída estão em [data-model.md](data-model.md), [contracts/participant.md](contracts/participant.md), [contracts/operations.md](contracts/operations.md) e [contracts/public-certificate.md](contracts/public-certificate.md).

1. Inscrição válida mostra comprovante pendente e envia o vínculo. Inscrição inválida não cria registro. O mesmo e-mail, em outra capitalização, não cria segunda inscrição.
2. A equipe confirma. A participante, pelo vínculo vigente, vê o estado confirmado. A participante não confirma a si mesma.
3. O vínculo antigo, depois de um novo envio, não abre a ficha.
4. Inscrição confirmada mostra código em texto e em QR Code, sem nome nem e-mail. A primeira leitura cria um check-in. A segunda não cria outro. Código de inscrição pendente é recusado.
5. Material publicado aparece para quem tem inscrição e abre o Drive. Material retirado não aparece. Pessoa sem inscrição não vê a lista.
6. O laboratório mostra cinco desafios. Sem enunciado, a conclusão é recusada. Com enunciado e inscrição confirmada, a conclusão permanece depois de sair e voltar.
7. A ficha da participante mostra só os eventos dela. A equipe vê a ficha de qualquer inscrita. A participante não abre `/operacao`.
8. Sem autorização da equipe, não há PDF, mesmo com check-in e cinco conclusões. Com autorização, o PDF contém nome, formação, instituição, data e código. A consulta pública desse código e a de um código desconhecido dão respostas diferentes, sem e-mail.
9. Pedido de acesso mostra nome e e-mail e fica registrado. Correção de nome atualiza a ficha. Pedido de exclusão não apaga os dados. Controlador, encarregado, base legal e prazo de retenção não aparecem.
10. Inscrição, check-in por texto, biblioteca, laboratório, download e consulta pública funcionam por teclado, em português, na largura de celular e na de computador.

## Pronto quando

Os dez cenários passam no Playwright ou, enquanto a automação daquele cenário não existir, a tarefa correspondente permanece aberta. Fluxo crítico sem teste não está concluído.

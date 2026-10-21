# Portal de Formação Continuada Docente

Portal do Centro Universitário CEUNI FAMETRO. A Formação Docente 2027 é a primeira edição.

A pessoa se cadastra com nome, sobrenome, CPF e e-mail. A inscrição já nasce confirmada. O acesso à área do professor chega por um link no e-mail cadastrado, sem senha. Nessa área ficam o comprovante, a foto, o QR Code do registro e, quando a equipe autorizar, o certificado. Os materiais são publicados ao final do evento.

O site publicado está em [formacaodocente2027.vercel.app](https://formacaodocente2027.vercel.app).

O repositório é privado. A especificação vigente está em `specs/001-portal-formacao-docente`.

## Como rodar nesta máquina

É preciso ter Node.js LTS e npm.

```text
npm install
npm run dev
```

O endereço que aparece no terminal é só o de desenvolvimento. Não é o endereço de produção.

Sem as variáveis do Supabase, os dados ficam em `.data/portal-state.json`, que não entra no Git. Sem o envio de e-mail configurado, o vínculo de acesso aparece no comprovante.

## Variáveis

Copie `.env.example` para `.env.local` e preencha fora do Git:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPERATIONAL_EMAILS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

`OPERATIONAL_EMAILS` é a lista de e-mails da equipe, separada por vírgula. Com a lista vazia, ninguém entra em `/operacao`.

O envio do vínculo e do certificado sai pelo Gmail (`smtp.gmail.com`, porta 587). `SMTP_USER` e `EMAIL_FROM` são a conta que envia. `SMTP_PASS` é a senha de app dessa conta. Sem esses três, o PDF continua disponível para download e o vínculo aparece no comprovante.

Não grave URL, chave nem senha neste repositório.

## Testes

```text
npm test
npx playwright install chromium
npm run test:e2e
```

Os testes de ponta a ponta usam `equipe@example.com` só dentro do Playwright. Esse endereço não libera o painel fora da suíte.

## O que o portal ainda não decide

O certificado traz nome, formação, instituição, data de emissão e código de autenticidade. Não inclui signatário nem carga horária. Controlador, encarregado, base legal e prazo de retenção da LGPD só entram quando a instituição os informar.

# Portal IA Docente FAMETRO 2027

Portal da Formação Docente 2027 do Centro Universitário CEUNI FAMETRO. A pessoa se inscreve com nome e e-mail. Os materiais são liberados ao final do evento. O certificado, quando emitido, pode ser baixado e é enviado ao e-mail cadastrado.

O repositório é privado. A especificação vigente está em `specs/001-portal-formacao-docente`.

## Como rodar nesta máquina

É preciso ter Node.js LTS e npm.

```text
npm install
npm run dev
```

O endereço que aparece no terminal é só o de desenvolvimento. Não é o endereço de produção.

Sem projeto Supabase configurado, os dados ficam em `.data/portal-state.json`, que não entra no Git. O vínculo de acesso aparece no comprovante porque não há envio de e-mail.

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

O projeto Supabase e a publicação na Vercel ainda não existem. Não há URL nem chave neste repositório.

## Testes

```text
npm test
npx playwright install chromium
npm run test:e2e
```

Os testes de ponta a ponta usam `equipe@example.com` só dentro do Playwright. Esse endereço não libera o painel fora da suíte.

## O que o portal ainda não decide

O certificado traz nome, formação, instituição, data de emissão e código de autenticidade. Não inclui signatário nem carga horária. Controlador, encarregado, base legal e prazo de retenção da LGPD só entram quando a instituição os informar.

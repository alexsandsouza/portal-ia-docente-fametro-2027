# Research: Portal da Formação Docente 2027

## 1. Aplicação web

- **Decision**: Uma aplicação Next.js com App Router na raiz do repositório, TypeScript estrito e Tailwind CSS. Server Components por padrão. Server Actions para alterações de estado. Client Components só para o QR Code, o foco do campo e a leitura opcional por câmera.
- **Rationale**: A constituição já fixa essa plataforma. O volume da spec cabe em um único app: até 500 inscrições e 50 pessoas ao mesmo tempo.
- **Alternatives considered**: Monorepo com apps separadas para participante e operação. Rejeitado porque as duas superfícies compartilham os mesmos dados e a separação exigida é de rota e autorização, não de repositório.

## 2. Dados e autorização

- **Decision**: Supabase Postgres com Row Level Security. Sessão por cookie via `@supabase/ssr`. No servidor, a identidade é conferida com `getClaims()`, não com `getSession()`. A publicação usa a chave pública do projeto; a chave privilegiada fica só no servidor e fora do Git.
- **Rationale**: É o caminho atual da documentação do Supabase para Next.js. A constituição exige RLS e papéis distintos.
- **Alternatives considered**: Confiar no papel só escondendo o menu. Rejeitado porque a participante precisa receber recusa mesmo no endereço direto do painel.

Referências: [cliente SSR do Supabase](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs) e [magic link](https://supabase.com/docs/guides/auth/auth-email-passwordless).

## 3. Vínculo pessoal sem senha

- **Decision**: O e-mail da inscrição recebe um magic link do Supabase Auth, com senha desligada. A aplicação grava uma versão inteira do vínculo. O endereço do e-mail carrega essa versão. Na volta, a rota de confirmação só abre a ficha se a versão for a vigente; caso contrário encerra a sessão e não mostra dados. Um novo envio incrementa a versão. O vínculo não aberto segue o prazo configurado no projeto Supabase. A sessão criada depois do clique permanece pelo cookie renovado.
- **Rationale**: O envio de e-mail fica dentro do Supabase, sem outro fornecedor. A versão na aplicação garante o teste da spec: o vínculo anterior não abre a ficha. O tempo de vida do vínculo não aberto é a configuração do projeto Supabase, sem número fixo nesta versão. O padrão de cerca de uma hora do magic link não usado é só o comportamento atual da plataforma e muda quando o projeto existir.
- **Alternatives considered**: Senha criada na inscrição. Rejeitada pela FR-020. Token só na aplicação com um serviço de e-mail novo. Rejeitado porque acrescentaria um fornecedor fora da constituição.

## 4. Papel operacional

- **Decision**: A lista de e-mails operacionais não nasce no formulário. Ela entra por variável de ambiente não commitada, lida no servidor, e é espelhada numa tabela que a participante não lê. O layout de `/operacao` recusa qualquer sessão cujo e-mail não esteja nessa lista.
- **Rationale**: A spec diz que a instituição nomeia essas pessoas na operação. O plano não inventa a lista.
- **Alternatives considered**: Autoatribuição do papel no cadastro. Rejeitada pela separação de papéis.

## 5. Código de check-in e QR Code

- **Decision**: Código aleatório de 128 bits, em texto, único e não sequencial. O QR Code contém só esse código. O valor fica legível para a própria participante e para a equipe, porque a spec exige exibir o código. Ele não contém nome nem e-mail.
- **Rationale**: Hash irreversível impediria mostrar o QR Code de novo. A opacidade exigida é a ausência de dado pessoal e a impossibilidade de adivinhar o código, não o descarte do valor.
- **Alternatives considered**: QR Code com o e-mail da pessoa. Rejeitado pela constituição e pela FR-007.

## 6. Certificado PDF

- **Decision**: O PDF é gerado no servidor no momento do download, com `pdf-lib`, a partir do registro já autorizado. Campos visíveis: nome, formação, instituição, data de emissão e código de autenticidade. Não há logotipo, signatário nem carga horária. O arquivo não é copiado para o repositório nem para um bucket.
- **Rationale**: Gerar na hora evita um arquivo antigo divergir do registro. `pdf-lib` não exige os dados visuais que a instituição ainda não entregou.
- **Alternatives considered**: Guardar o PDF no Storage. Rejeitado nesta versão porque a anulação ainda está fora da spec e o registro já é a fonte do documento.

## 7. Consulta pública

- **Decision**: Rota pública, sem sessão. Resposta de código vigente: autenticidade, nome da formação e data de emissão. Resposta de código desconhecido: ausência, sem dizer se um código parecido existe. E-mail e documento de identificação nunca saem nessa resposta.
- **Rationale**: É o texto fechado da FR-016.
- **Alternatives considered**: Exigir login para verificar. Rejeitado porque a consulta pública funciona sem entrar no portal.

## 8. Materiais

- **Decision**: A tabela guarda título, descrição e uma URL `https` de `drive.google.com` ou `docs.google.com`. O portal não chama a API do Drive e não copia o arquivo. Endereço fora desses domínios é recusado, para não transformar o destino em redirecionamento aberto.
- **Rationale**: A spec manda manter o arquivo no Drive. A restrição de domínio protege a participante sem inventar identificador de pasta.
- **Alternatives considered**: Qualquer URL. Rejeitada pelo risco de redirecionamento. Integração OAuth com o Drive. Rejeitada porque credencial e pasta ainda não existem.

## 9. Limite de tentativas

- **Decision**: Contador no Postgres para inscrição, validação de código de check-in e consulta de certificado. Depois de 5 tentativas inválidas na mesma janela, a ação fica recusada por 15 minutos, com mensagem em português e sem revelar se um código parecido existe.
- **Rationale**: A FR-019 fixa esses dois números. Um contador no banco evita um novo serviço de cache.
- **Alternatives considered**: Só o limite de e-mail do Supabase. Insuficiente para check-in e consulta pública.

## 10. Testes

- **Decision**: Vitest para regras de domínio e Playwright para inscrição, confirmação, check-in por texto, recusa do painel, download do certificado e consulta pública. Os testes nascem na fase de tarefas.
- **Rationale**: A constituição exige teste automatizado nos fluxos cuja falha impede essas jornadas.
- **Alternatives considered**: Só teste manual. Rejeitado pelo princípio VIII.

## 11. O que permanece nomeado e vazio

Projeto Supabase, projeto Vercel, URL de produção, lista de e-mails operacionais, pastas do Drive, logotipo, signatário, carga horária, controlador, encarregado, base legal e prazo de retenção não recebem valor neste plano.

# Tasks: Portal da Formação Docente 2027

**Input**: Design documents from `/specs/001-portal-formacao-docente/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluídos. A constituição exige teste automatizado para inscrição, confirmação, check-in, emissão e verificação de certificado e ação operacional. Os testes de cada história são escritos primeiro e devem falhar antes da implementação.

**Organization**: Tarefas agrupadas por história para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem dependência incompleta)
- **[Story]**: História da spec (US1–US9)
- Cada tarefa cita o arquivo que altera

## Path Conventions

- Aplicação Next.js na raiz: `app/`, `lib/`, `components/`, `supabase/migrations/`, `tests/unit/`, `tests/e2e/`
- Documentos da feature: `specs/001-portal-formacao-docente/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criar a aplicação vazia com a stack do plano, sem regra de negócio

- [x] T001 Criar a estrutura Next.js na raiz com `package.json`, `app/layout.tsx`, `app/page.tsx` e as pastas `app/`, `lib/`, `components/`, `supabase/migrations/`, `tests/unit/` e `tests/e2e/`
- [x] T002 Declarar as dependências `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `pdf-lib`, `qrcode`, `vitest` e `@playwright/test` em `package.json`
- [x] T003 [P] Ativar TypeScript estrito em `tsconfig.json`
- [x] T004 [P] Configurar Tailwind e o anel de foco visível em `app/globals.css`
- [x] T005 [P] Configurar ESLint para TypeScript em `eslint.config.mjs`
- [x] T006 [P] Configurar Vitest em `vitest.config.ts`
- [x] T007 [P] Configurar Playwright em `playwright.config.ts`
- [x] T008 [P] Criar `.env.example` só com os nomes `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e `OPERATIONAL_EMAILS`, sem valores

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Sessão, papel operacional e limite de tentativas, usados por todas as histórias

**⚠️ CRITICAL**: Nenhuma história começa antes do fim desta fase

- [x] T009 Criar `supabase/migrations/0001_foundation.sql` com `operational_member` (`email` único em minúsculas, `created_at`) e `rate_limit_bucket` (`scope` `enrollment`, `check_in` ou `certificate_lookup`; `subject_key`; `window_started_at`; `attempts`), com RLS e sem leitura pela participante
- [x] T010 [P] Criar o cliente de navegador do Supabase em `lib/supabase/browser.ts`
- [x] T011 [P] Criar o cliente de servidor do Supabase em `lib/supabase/server.ts`
- [x] T012 Renovar a sessão com `getClaims()` em `proxy.ts`, usando `middleware.ts` se o Next.js instalado for 15 ou anterior
- [x] T013 Conferir o papel operacional em `lib/auth/operational.ts` a partir de `OPERATIONAL_EMAILS` e de `operational_member`, sem lista inventada
- [x] T014 [P] Normalizar e-mail em `lib/validation/email.ts` com a regra "Obrigatório, único, guardado em minúsculas"
- [x] T015 [P] Implementar o contador de tentativas em `lib/rate-limit.ts` para os escopos `enrollment`, `check_in` e `certificate_lookup`, com recusa de 15 minutos depois de 5 tentativas inválidas na mesma janela
- [x] T016 [P] Centralizar as mensagens de interface em português em `lib/messages/pt-br.ts`
- [x] T017 Definir `lang="pt-BR"` e o link de pular para o conteúdo em `app/layout.tsx`
- [x] T018 Recusar sessão sem papel operacional em `app/operacao/layout.tsx`

**Checkpoint**: Fundação pronta. As histórias podem começar.

---

## Phase 3: User Story 1 - Inscrever-se na formação (Priority: P1) 🎯 MVP

**Goal**: Uma pessoa envia nome e e-mail, recebe comprovante pendente e um vínculo pessoal sem senha

**Independent Test**: Dados válidos criam uma inscrição `pending` e disparam o vínculo. Dados inválidos ou e-mail já inscrito não criam outra inscrição ativa.

### Tests for User Story 1

- [x] T019 [P] [US1] Escrever teste que falha em `tests/unit/enrollment-validation.test.ts` para `full_name` "Obrigatório, sem ficar vazio depois do trim" e e-mail "Obrigatório, único, guardado em minúsculas", inclusive maiúsculas e minúsculas como o mesmo e-mail
- [x] T020 [P] [US1] Escrever jornada que falha em `tests/e2e/enrollment.spec.ts` para comprovante pendente, campo inválido e, na inscrição duplicada sem vínculo vigente, apenas a resposta «este e-mail já possui inscrição», sem nome, estado nem identificador, em `app/inscricao/page.tsx`

### Implementation for User Story 1

- [x] T021 [US1] Criar `participant` e `enrollment` em `supabase/migrations/0002_enrollment.sql` com `access_link_version` "Inteiro. Começa em 1", `status` "`pending` ou `confirmed`", `confirmed_at` "Nulo enquanto `pending`" e `confirmed_by` "Nulo enquanto `pending`"
- [x] T022 [US1] Restringir a leitura da própria inscrição por RLS em `supabase/migrations/0002_enrollment.sql`
- [x] T023 [US1] Implementar a criação da inscrição em `lib/enrollment/create-enrollment.ts`
- [x] T024 [US1] Validar e gravar `POST /inscricao` em `app/inscricao/actions.ts`, com recusa de 15 minutos depois de 5 tentativas inválidas no escopo `enrollment`
- [x] T025 [US1] Construir o formulário com rótulos visíveis em `app/inscricao/page.tsx`
- [x] T026 [US1] Mostrar identificador e estado "recebida/pendente" em `app/inscricao/receipt.tsx`
- [x] T027 [US1] Enviar o magic link sem senha e gravar `access_link_version` em `lib/auth/send-access-link.ts`
- [x] T028 [US1] Aceitar só a versão vigente do vínculo, e não mostrar ficha na versão antiga, em `app/auth/confirm/route.ts`

**Checkpoint**: A história 1 funciona sozinha.

---

## Phase 4: User Story 2 - Acompanhar a confirmação (Priority: P1)

**Goal**: Só o papel operacional muda `pending` para `confirmed`. A participante vê o estado e não confirma a si mesma.

**Independent Test**: Com uma inscrição pendente semeada, a ação operacional confirma e preenche data e autor. A sessão participante não altera o estado.

### Tests for User Story 2

- [x] T029 [P] [US2] Escrever teste que falha em `tests/unit/confirm-enrollment.test.ts` para a transição "`pending` → `confirmed`, somente por papel operacional" e para "Não há volta nem estado recusado nesta spec"
- [x] T030 [P] [US2] Escrever jornada que falha em `tests/e2e/confirmation.spec.ts` cobrindo confirmação operacional e recusa da própria participante

### Implementation for User Story 2

- [x] T031 [US2] Implementar a confirmação em `lib/enrollment/confirm-enrollment.ts`, preenchendo `confirmed_at` e `confirmed_by` só nessa transição
- [x] T032 [US2] Expor `POST /operacao/inscricoes/[id]/confirmar` em `app/operacao/inscricoes/[id]/confirmar/route.ts`
- [x] T033 [US2] Mostrar "pendente" ou "confirmado" em português em `app/ficha/page.tsx`
- [x] T034 [US2] Gravar autor, ação e data da confirmação em `lib/audit/record-action.ts`

**Checkpoint**: As histórias 1 e 2 funcionam. A confirmação não depende do restante do painel.

---

## Phase 5: User Story 7 - Operar o painel administrativo (Priority: P1)

**Goal**: A superfície `/operacao` lista inscrições e o histórico. A participante recebe recusa no endereço direto.

**Independent Test**: Conta participante é recusada em `/operacao`. Conta operacional vê a lista e cada ação testada tem autor e data.

### Tests for User Story 7

- [x] T035 [P] [US7] Escrever jornada que falha em `tests/e2e/operations-guard.spec.ts` para a recusa da participante em `/operacao`
- [x] T036 [P] [US7] Escrever teste que falha em `tests/unit/operational-action.test.ts` exigindo `actor_id`, `action`, `target_type`, `target_id` e `created_at`

### Implementation for User Story 7

- [x] T037 [US7] Listar inscrições e estados em `app/operacao/page.tsx`
- [x] T038 [US7] Criar `operational_action` com leitura só do papel operacional em `supabase/migrations/0003_operational_action.sql`
- [x] T039 [US7] Mostrar o histórico operacional em `app/operacao/fichas/[participantId]/page.tsx`

**Checkpoint**: O painel existe e a participante não entra nele.

---

## Phase 6: User Story 3 - Fazer check-in por QR Code (Priority: P2)

**Goal**: Inscrição confirmada exibe código opaco em texto e em QR Code. A primeira leitura válida cria um único check-in.

**Independent Test**: Código vigente de inscrição confirmada registra um check-in. Código inexistente, de inscrição pendente ou já usado não cria outro registro. O caminho digitado equivale ao QR Code.

### Tests for User Story 3

- [x] T040 [P] [US3] Escrever teste que falha em `tests/unit/check-in.test.ts` para código "Único, aleatório, 128 bits, não sequencial" e para "`enrollment_id` Único. Impede o segundo registro"
- [x] T041 [P] [US3] Escrever jornada que falha em `tests/e2e/check-in.spec.ts` para leitura válida, repetida, inválida e para o código informado em texto

### Implementation for User Story 3

- [x] T042 [US3] Criar `check_in_code` e `check_in` em `supabase/migrations/0004_check_in.sql`, com código só para inscrição `confirmed` e sem nome ou e-mail dentro do valor
- [x] T043 [US3] Emitir o código na confirmação em `lib/check-in/issue-code.ts`
- [x] T044 [US3] Mostrar o código em texto e o QR Code só com esse código em `app/check-in/codigo/page.tsx`
- [x] T045 [US3] Receber o código lido ou digitado em `app/operacao/check-in/route.ts`, com recusa de 15 minutos depois de 5 tentativas inválidas no escopo `check_in`
- [x] T046 [US3] Gravar o único `check_in` com `recorded_by` e `checked_in_at` em `lib/check-in/record-check-in.ts`

**Checkpoint**: O check-in funciona com uma inscrição confirmada semeada, sem depender de laboratório ou certificado.

---

## Phase 7: User Story 4 - Consultar a biblioteca de materiais (Priority: P2)

**Goal**: A equipe publica título, descrição e destino no Drive. Quem tem inscrição vê só o que está publicado. O arquivo não entra no portal.

**Independent Test**: Material publicado aparece com título, descrição e destino. Material retirado e pessoa sem inscrição não veem o item.

### Tests for User Story 4

- [x] T047 [P] [US4] Escrever teste que falha em `tests/unit/material-url.test.ts` para `destination_url` "`https` em `drive.google.com` ou `docs.google.com`"
- [x] T048 [P] [US4] Escrever jornada que falha em `tests/e2e/materials.spec.ts` para publicação, retirada, lista vazia em português e pessoa sem inscrição

### Implementation for User Story 4

- [x] T049 [US4] Criar `material` em `supabase/migrations/0005_material.sql` com `title` e `description` obrigatórios e `published` verdadeiro ou falso
- [x] T050 [US4] Publicar e retirar material em `lib/materials/publish-material.ts`
- [x] T051 [US4] Receber título, descrição, URL e publicação em `app/operacao/materiais/route.ts`
- [x] T052 [US4] Implementar a retirada em `app/operacao/materiais/[id]/retirar/route.ts`
- [x] T053 [US4] Listar só materiais publicados, sem copiar arquivo, em `app/materiais/page.tsx`

**Checkpoint**: A biblioteca funciona sem check-in e sem certificado.

---

## Phase 8: User Story 5 - Percorrer os cinco desafios (Priority: P2)

**Goal**: Existem exatamente cinco desafios. A participante confirmada conclui só o que já tem enunciado, e o andamento permanece.

**Independent Test**: A página mostra cinco desafios. Sem enunciado, a conclusão é recusada. Com enunciado, a conclusão e a data permanecem depois de sair e voltar.

### Tests for User Story 5

- [x] T054 [P] [US5] Escrever teste que falha em `tests/unit/challenges.test.ts` para "Exatamente cinco linhas, com `position` de 1 a 5, único", `statement` nulo forçando `waiting_for_content`, e atualização de enunciado sem apagar `completed`
- [x] T055 [P] [US5] Escrever jornada que falha em `tests/e2e/lab.spec.ts` para os cinco desafios, a recusa sem enunciado e a conclusão com enunciado

### Implementation for User Story 5

- [x] T056 [US5] Semear as cinco linhas de `challenge` e `challenge_progress` em `supabase/migrations/0006_challenge.sql`, com par `participant_id` e `challenge_id` único
- [x] T057 [US5] Atualizar título e enunciado sem apagar andamento em `app/operacao/desafios/[position]/route.ts`
- [x] T058 [US5] Concluir desafio só com inscrição `confirmed` e `statement` presente em `lib/challenges/complete-challenge.ts`
- [x] T059 [US5] Mostrar os cinco desafios e o andamento em `app/laboratorio/page.tsx`
- [x] T060 [US5] Receber a conclusão em `app/laboratorio/[position]/concluir/route.ts`

**Checkpoint**: O laboratório não emite certificado.

---

## Phase 9: User Story 6 - Consultar o registro de participação (Priority: P2)

**Goal**: A ficha lista, com data, os eventos que já ocorreram. A participante vê só a própria ficha. A equipe vê a ficha de qualquer inscrita.

**Independent Test**: Confirmação e check-in aparecem com data. Evento inexistente não aparece como ocorrido. Outra ficha é recusada para a participante.

### Tests for User Story 6

- [x] T061 [P] [US6] Escrever jornada que falha em `tests/e2e/record.spec.ts` para a própria ficha, a ficha vista pela equipe e a recusa da ficha alheia

### Implementation for User Story 6

- [x] T062 [US6] Montar a lista cronológica de inscrição, confirmação, check-in e conclusão de desafio em `lib/records/participant-record.ts`
- [x] T063 [US6] Renderizar só os eventos da participante em `app/ficha/page.tsx`
- [x] T064 [US6] Renderizar a ficha de uma inscrita para o papel operacional em `app/operacao/fichas/[participantId]/page.tsx`

**Checkpoint**: A ficha reúne evidências e não decide o certificado.

---

## Phase 10: User Story 8 - Obter e verificar o certificado (Priority: P3)

**Goal**: A equipe autoriza a emissão. Só então a participante baixa o PDF. A consulta pública não exige sessão.

**Independent Test**: Check-in e cinco conclusões, sem autorização, não geram PDF. Com autorização, o PDF sai uma vez. Código desconhecido não revela dados de participantes.

### Tests for User Story 8

- [x] T065 [P] [US8] Escrever teste que falha em `tests/unit/certificate.test.ts` para "`participant_id` Único nesta spec", código "Único, aleatório, 128 bits" e para a segunda autorização não criar outro código vigente
- [x] T066 [P] [US8] Escrever jornada que falha em `tests/e2e/certificate.spec.ts` para recusa sem autorização, download e consulta pública em `app/certificados/[code]/page.tsx`

### Implementation for User Story 8

- [x] T067 [US8] Criar `certificate` em `supabase/migrations/0007_certificate.sql` com `issued_at` obrigatório e `authorized_by` de papel operacional
- [x] T068 [US8] Autorizar a emissão sem usar check-in ou desafios como substituto em `lib/certificates/authorize-certificate.ts`
- [x] T069 [US8] Expor `POST /operacao/certificados/[participantId]` em `app/operacao/certificados/[participantId]/route.ts`
- [x] T070 [US8] Gerar o PDF na hora, sem logotipo, signatário ou carga horária, em `lib/certificates/render-pdf.ts`
- [x] T071 [US8] Entregar o PDF só à participante autorizada em `app/certificado/route.ts`
- [x] T072 [US8] Responder a consulta pública sem sessão em `app/certificados/[code]/page.tsx`, com recusa de 15 minutos depois de 5 tentativas inválidas no escopo `certificate_lookup`, sem e-mail e sem indicar código parecido

**Checkpoint**: Emissão e verificação funcionam sem anulação, que continua fora da spec.

---

## Phase 11: User Story 9 - Pedir acesso, correção ou exclusão (Priority: P3)

**Goal**: A participante pede acesso, corrige o nome ou registra exclusão. Os dados não somem em silêncio. Os quatro dados institucionais da LGPD não aparecem.

**Independent Test**: O pedido de acesso mostra nome e e-mail e fica datado. A correção muda o nome. A exclusão permanece visível e não apaga cadastro, inscrição, check-in nem certificado.

### Tests for User Story 9

- [x] T073 [P] [US9] Escrever teste que falha em `tests/unit/data-subject.test.ts` para `kind` "`access`, `correction` ou `deletion`" e para `executed_at` "Permanece nulo em exclusão até autorização institucional"
- [x] T074 [P] [US9] Escrever jornada que falha em `tests/e2e/data-rights.spec.ts` garantindo a ausência de controlador, encarregado, base legal e prazo de retenção

### Implementation for User Story 9

- [x] T075 [US9] Criar `data_subject_request` em `supabase/migrations/0008_data_subject_request.sql` com `previous_name` e `new_name` só na correção
- [x] T076 [US9] Registrar acesso, correção e exclusão em `lib/privacy/data-subject-request.ts`
- [x] T077 [US9] Receber os três pedidos em `app/meus-dados/actions.ts`
- [x] T078 [US9] Mostrar os pedidos e o nome corrigido, sem os quatro dados institucionais, em `app/meus-dados/page.tsx`

**Checkpoint**: Os direitos da titular estão registrados sem executar exclusão.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Acessibilidade transversal e a validação do quickstart

- [x] T079 [P] Cobrir teclado, rótulos em português e larguras de celular e de computador para inscrição, check-in por texto, biblioteca, laboratório, download e consulta pública em `tests/e2e/a11y.spec.ts`
- [ ] T080 Executar os dez cenários de `specs/001-portal-formacao-docente/quickstart.md` e deixar aberta qualquer tarefa cuja prova ainda falhe

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediatamente
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias
- **Histórias (Phase 3+)**: dependem da Phase 2
- **Polish (Phase 12)**: depende das histórias que entrarem na entrega

### User Story Dependencies

- **US1 (P1)**: só depende da Phase 2. É o MVP.
- **US2 (P1)**: integra com a inscrição da US1. O teste independente semeia uma inscrição `pending`.
- **US7 (P1)**: o guarda de `/operacao` já nasce na Phase 2. A lista usa inscrições da US1. O teste de recusa não precisa das outras histórias.
- **US3 (P2)**: o caminho feliz usa inscrição `confirmed` da US2. O teste semeia essa inscrição.
- **US4 (P2)**: independente depois da Phase 2, com uma inscrição semeada para a leitura.
- **US5 (P2)**: a conclusão exige inscrição `confirmed`. O teste semeia essa inscrição e um enunciado.
- **US6 (P2)**: lê eventos das histórias anteriores. O teste semeia os eventos e prova a própria ficha sem precisar do certificado.
- **US8 (P3)**: não usa check-in nem desafios como autorização. O teste semeia uma participante e uma conta operacional.
- **US9 (P3)**: depende da participante da US1. Não apaga dados das outras histórias.

### Within Each User Story

- O teste da história fica vermelho antes da implementação
- A migração vem antes do serviço
- O serviço vem antes da rota
- A história termina no checkpoint, antes da próxima prioridade

### Parallel Opportunities

- T003–T008 podem correr juntas depois de T002
- T010, T011, T014, T015 e T016 podem correr juntas depois de T009
- Os testes marcados [P] de uma mesma história podem ser escritos juntos
- US4 pode avançar em paralelo a US3 depois da Phase 2, se a inscrição de teste estiver semeada

---

## Parallel Example: User Story 1

```text
T019 tests/unit/enrollment-validation.test.ts
T020 tests/e2e/enrollment.spec.ts
```

Depois que os dois testes estiverem vermelhos, T021 abre a migração e o restante da US1 segue em série.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Phase 1 e Phase 2
2. Concluir Phase 3, a inscrição com comprovante e vínculo
3. Parar e validar a história 1 sozinha
4. Só então seguir para confirmação e painel

### Incremental Delivery

1. US1 entrega a inscrição
2. US2 e US7 entregam a confirmação e o painel
3. US3, US4, US5 e US6 entregam presença, materiais, laboratório e ficha
4. US8 e US9 entregam certificado e direitos da titular
5. T079 e T080 fecham acessibilidade e o quickstart

### Parallel Team Strategy

1. Todo o time conclui Setup e Foundational
2. Em seguida, uma pessoa conduz US1
3. Com a inscrição semeada, outra pessoa pode abrir US4 enquanto a confirmação da US2 avança
4. US8 espera a conta operacional, não a conclusão dos cinco desafios

---

## Notes

- [P] significa arquivos diferentes e sem dependência incompleta
- O rótulo [USn] liga a tarefa à história da spec
- Não inventar URL, chave, e-mail operacional, logotipo, signatário, carga horária, controlador, encarregado, base legal ou prazo de retenção
- Commitar ao fim de cada tarefa ou de um grupo lógico
- Parar em qualquer checkpoint para validar a história sozinha

# Implementation Plan: Portal da Formação Docente 2027

**Branch**: `001-portal-formacao-docente` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-portal-formacao-docente/spec.md`

## Summary

O portal cobre a inscrição, a confirmação manual, o check-in por código opaco, a biblioteca com destino no Google Drive, os cinco desafios, a ficha, o painel operacional e o certificado PDF verificável. A aplicação é um único Next.js com App Router, TypeScript estrito, Tailwind CSS, Supabase e publicação na Vercel. O vínculo sem senha usa o magic link do Supabase Auth, com uma versão conferida pela aplicação para invalidar o vínculo anterior. O PDF nasce no servidor só depois da autorização operacional.

## Technical Context

**Language/Version**: TypeScript estrito e Node.js LTS, na versão estável vigente quando a implementação começar

**Primary Dependencies**: Next.js com App Router, Tailwind CSS, `@supabase/supabase-js`, `@supabase/ssr`, Zod, `pdf-lib`, biblioteca de QR Code

**Storage**: Supabase Postgres com Row Level Security. PDF gerado na hora, sem bucket. Arquivos de material permanecem no Google Drive

**Testing**: Vitest para regras de domínio e Playwright para os fluxos críticos

**Target Platform**: Navegador em celular e computador. Hospedagem prevista na Vercel. O projeto Vercel ainda não existe

**Project Type**: Aplicação web com duas superfícies, participante e operação, no mesmo app

**Performance Goals**: Comprovante de inscrição em até 3 minutos na primeira tentativa humana. Consulta pública do código em uma etapa. Até 50 pessoas simultâneas sem fila perceptível nos fluxos principais

**Constraints**: Português brasileiro. WCAG 2.2 AA. Sem senha. Sem segredo no repositório. Sem logotipo, signatário, carga horária, controlador, encarregado, base legal ou prazo de retenção até a instituição entregá-los. Check-in exige conexão

**Scale/Scope**: Uma formação, até 500 inscrições ativas, cinco desafios fixos, um certificado vigente por participante

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Antes da pesquisa | Depois do desenho |
| --- | --- | --- |
| I. Especificação antes do código | Passa. A spec esclarecida é a entrada deste plano. Implementação ainda não começa | Passa. Nenhum código de aplicação foi criado |
| II. Idioma | Passa. Interface e documentos de negócio em português. Identificadores técnicos em inglês | Passa nos contratos e no modelo |
| III. Plataforma decidida | Passa. Next.js, TypeScript, Tailwind, Supabase, Vercel, Drive só por link, PDF e QR Code opaco | Passa. Nenhum fornecedor novo foi acrescentado |
| IV. Código verificável | Passa como regra do plano: TypeScript estrito, validação no servidor, Server Components por padrão, segredos fora do Git | Passa. Os contratos não contêm chave nem URL real |
| V. Acessibilidade | Passa. Teclado, rótulos, foco e caminho em texto para QR Code e PDF | Passa no quickstart, cenário 10 |
| VI. LGPD por minimização | Passa. Só nome e e-mail. Os quatro dados institucionais ficam de fora. Exclusão não apaga em silêncio | Passa. O modelo não tem colunas para esses quatro dados |
| VII. Segurança por padrão | Passa. Papéis separados, RLS, código opaco, consulta pública mínima e limite de tentativas | Passa. `/operacao` é recusado no servidor. A versão do vínculo impede o link antigo |
| VIII. Testes nos fluxos críticos | Passa como compromisso. Os testes entram na fase de tarefas | Passa. O quickstart lista os cenários que precisam de teste |
| IX. Versionamento rastreável | Passa. O incremento está em `specs/001-portal-formacao-docente` | Passa. Nenhuma release foi declarada |
| X. Documentação viva | Passa. Este plano não substitui a spec e não cria README de código inexistente | Passa |

Nenhuma violação. A seção Complexity Tracking fica vazia de propósito.

## Project Structure

### Documentation (this feature)

```text
specs/001-portal-formacao-docente/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── participant.md
│   ├── operations.md
│   └── public-certificate.md
└── tasks.md              # ainda não existe; nasce em /speckit-tasks
```

### Source Code (repository root)

```text
app/
├── inscricao/
├── auth/confirm/
├── ficha/
├── materiais/
├── laboratorio/
├── certificado/
├── certificados/[code]/
├── meus-dados/
└── operacao/
lib/
├── supabase/
├── validation/
└── certificates/
components/
supabase/migrations/
tests/
├── unit/
└── e2e/
```

**Structure Decision**: Um app Next.js na raiz, com a superfície operacional isolada em `app/operacao`. O mesmo banco serve as duas superfícies. A autorização de operação não depende de esconder o link.

## Complexity Tracking

Nenhuma violação da constituição precisa de justificativa.

## Phase 0

A pesquisa está em [research.md](research.md). Não restou `NEEDS CLARIFICATION` técnico. As pendências institucionais continuam nomeadas e sem valor inventado.

## Phase 1

- Modelo: [data-model.md](data-model.md)
- Contratos: [contracts/participant.md](contracts/participant.md), [contracts/operations.md](contracts/operations.md), [contracts/public-certificate.md](contracts/public-certificate.md)
- Validação: [quickstart.md](quickstart.md)

## Constitution Check pós-desenho

Os dez princípios permanecem sem violação. O desenho não adicionou dado pessoal, não copiou arquivo do Drive, não publicou segredo e não emitiu certificado sem o ato operacional. O próximo comando é `/speckit-checklist` e, em seguida, `/speckit-tasks`. A implementação continua fora desta fase.

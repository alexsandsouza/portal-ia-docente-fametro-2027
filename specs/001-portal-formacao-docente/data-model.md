# Data Model: Portal da Formação Docente 2027

Identificadores de campo em inglês. Textos visíveis em português brasileiro. E-mail é comparado em minúsculas.

## participant

Pessoa inscrita. Uma linha por e-mail.

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `auth_user_id` | Usuário Supabase Auth correspondente |
| `full_name` | Obrigatório, sem ficar vazio depois do trim |
| `email` | Obrigatório, único, guardado em minúsculas |
| `access_link_version` | Inteiro. Começa em 1. Cada novo vínculo soma 1 |
| `created_at` | Data da inscrição |

Relação: uma inscrição ativa.

## enrollment

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno e o identificador mostrado no comprovante |
| `participant_id` | Obrigatório, único nesta versão |
| `status` | `pending` ou `confirmed` |
| `created_at` | Obrigatório |
| `confirmed_at` | Nulo enquanto `pending` |
| `confirmed_by` | Nulo enquanto `pending`. Preenchido só por papel operacional |

Transição: `pending` → `confirmed`, somente por papel operacional. Não há volta nem estado recusado nesta spec.

## check_in_code

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `enrollment_id` | Único. Só existe para inscrição `confirmed` |
| `code` | Único, aleatório, 128 bits, não sequencial |
| `created_at` | Obrigatório |

Não há expiração nesta spec. O código não contém nome nem e-mail.

## check_in

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `enrollment_id` | Único. Impede o segundo registro |
| `recorded_by` | Papel operacional |
| `checked_in_at` | Data e hora |

Recusas que não criam linha: código inexistente, inscrição não confirmada, check-in já existente.

## material

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `title` | Obrigatório |
| `description` | Obrigatório |
| `destination_url` | `https` em `drive.google.com` ou `docs.google.com` |
| `published` | Verdadeiro ou falso |
| `updated_by` | Papel operacional |
| `updated_at` | Obrigatório |

A participante com inscrição vê somente `published = true`. O arquivo não é armazenado.

## challenge

Exatamente cinco linhas, com `position` de 1 a 5, único.

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `position` | 1 a 5 |
| `title` | Obrigatório |
| `statement` | Nulo enquanto a instituição não entregar o enunciado |
| `updated_by` | Papel operacional |
| `updated_at` | Obrigatório |

## challenge_progress

| Campo | Regra |
| --- | --- |
| `participant_id` | Obrigatório |
| `challenge_id` | Obrigatório. Par único com a participante |
| `status` | `waiting_for_content`, `not_started` ou `completed` |
| `completed_at` | Preenchido só em `completed` |

`statement` nulo força `waiting_for_content` e recusa conclusão. Trocar o enunciado não apaga `completed`.

## certificate

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `participant_id` | Único nesta spec |
| `authenticity_code` | Único, aleatório, 128 bits, impresso no PDF |
| `issued_at` | Obrigatório |
| `authorized_by` | Papel operacional |

A linha só nasce com a autorização da equipe. Check-in e desafios concluídos não criam a linha. Anulação fica fora desta spec. O PDF é derivado desses campos mais o nome da participante, o nome fixo da formação e o nome fixo da instituição.

## data_subject_request

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `participant_id` | Obrigatório |
| `kind` | `access`, `correction` ou `deletion` |
| `previous_name` | Preenchido em correção |
| `new_name` | Preenchido em correção e copiado para `participant.full_name` |
| `created_at` | Obrigatório |
| `executed_at` | Permanece nulo em exclusão até autorização institucional |

Pedido de exclusão não apaga participante, inscrição, check-in nem certificado.

## operational_action

| Campo | Regra |
| --- | --- |
| `id` | Identificador interno |
| `actor_id` | Papel operacional |
| `action` | Confirmação, check-in, publicação, retirada, edição de desafio, autorização de certificado ou novo vínculo operacional |
| `target_type` | Tipo do registro afetado |
| `target_id` | Identificador do registro |
| `created_at` | Obrigatório |

Consulta restrita ao papel operacional.

## operational_member

| Campo | Regra |
| --- | --- |
| `email` | Único, em minúsculas |
| `created_at` | Obrigatório |

A participante não lê esta tabela. A lista chega pela configuração do ambiente, não pelo formulário.

## rate_limit_bucket

| Campo | Regra |
| --- | --- |
| `scope` | `enrollment`, `check_in` ou `certificate_lookup` |
| `subject_key` | Identificador da origem da tentativa, sem dado pessoal desnecessário |
| `window_started_at` | Início da janela |
| `attempts` | Contagem na janela |

## Regras de leitura

- Participante autenticada lê a própria ficha, os próprios códigos, os materiais publicados, os cinco desafios, o próprio andamento e o próprio certificado.
- Participante não lê outra ficha, não escreve `enrollment.status`, não escreve check-in e não abre `/operacao`.
- Papel operacional lê as fichas e escreve as ações da spec.
- Anônimo lê apenas o resultado mínimo da consulta pública do código de autenticidade.
- Controlador, encarregado, base legal e prazo de retenção não têm colunas.

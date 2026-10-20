import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { recordAction } from "@/lib/audit/record-action";
import { createOpaqueCode } from "@/lib/check-in/code";
import { isDriveUrl } from "@/lib/materials/url";
import { messages } from "@/lib/messages/pt-br";
import { isOperationalEmail } from "@/lib/auth/operational";
import { registerInvalidAttempt, type RateBucket, type RateScope } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/validation/email";
import { normalizeName } from "@/lib/validation/name";

export type EnrollmentStatus = "pending" | "confirmed";
export type ProgressStatus = "waiting_for_content" | "not_started" | "completed";
export type RequestKind = "access" | "correction" | "deletion";

export type Participant = {
  id: string;
  fullName: string;
  email: string;
  accessLinkVersion: number;
  accessToken: string;
  createdAt: string;
};

export type Enrollment = {
  id: string;
  participantId: string;
  status: EnrollmentStatus;
  createdAt: string;
  confirmedAt: string | null;
  confirmedBy: string | null;
};

export type CheckInCode = { enrollmentId: string; code: string; createdAt: string };
export type CheckIn = { id: string; enrollmentId: string; recordedBy: string; checkedInAt: string };
export type Material = {
  id: string;
  title: string;
  description: string;
  destinationUrl: string;
  published: boolean;
  updatedBy: string;
  updatedAt: string;
};
export type Challenge = {
  id: string;
  position: number;
  title: string;
  statement: string | null;
  updatedBy: string | null;
  updatedAt: string;
};
export type Progress = {
  participantId: string;
  challengeId: string;
  status: ProgressStatus;
  completedAt: string | null;
};
export type Certificate = {
  id: string;
  participantId: string;
  authenticityCode: string;
  issuedAt: string;
  authorizedBy: string;
  emailStatus: "pending" | "sent" | "not_configured" | "failed";
  emailSentAt: string | null;
};
export type DataRequest = {
  id: string;
  participantId: string;
  kind: RequestKind;
  previousName: string | null;
  newName: string | null;
  createdAt: string;
  executedAt: string | null;
};
export type OperationalAction = {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
};
export type Session = { id: string; email: string; role: "participant" | "operational"; version: number };

type State = {
  participants: Participant[];
  enrollments: Enrollment[];
  codes: CheckInCode[];
  checkIns: CheckIn[];
  materials: Material[];
  challenges: Challenge[];
  progress: Progress[];
  certificates: Certificate[];
  requests: DataRequest[];
  actions: OperationalAction[];
  sessions: Session[];
  rates: RateBucket[];
};

function emptyState(): State {
  const now = new Date().toISOString();
  const challenges = [1, 2, 3, 4, 5].map((position) => ({
    id: `challenge-${position}`,
    position,
    title: `Desafio ${position}`,
    statement: null,
    updatedBy: null,
    updatedAt: now,
  }));
  return {
    participants: [],
    enrollments: [],
    codes: [],
    checkIns: [],
    materials: [],
    challenges,
    progress: [],
    certificates: [],
    requests: [],
    actions: [],
    sessions: [],
    rates: [],
  };
}

const stateFile = path.join(process.cwd(), ".data", "portal-state.json");
const memory = globalThis as typeof globalThis & { __portalState?: State };

function persist(state: State) {
  if (process.env.VITEST) return;
  try {
    mkdirSync(path.dirname(stateFile), { recursive: true });
    writeFileSync(stateFile, JSON.stringify(state));
  } catch {
    memory.__portalState = state;
  }
}

export function getState(): State {
  if (process.env.VITEST) {
    if (!memory.__portalState) memory.__portalState = emptyState();
    return memory.__portalState;
  }
  if (memory.__portalState && process.env.VERCEL) return memory.__portalState;
  try {
    return JSON.parse(readFileSync(stateFile, "utf8")) as State;
  } catch (error) {
    const missing = (error as NodeJS.ErrnoException).code === "ENOENT";
    if (missing && !process.env.VERCEL) {
      const state = emptyState();
      persist(state);
      return state;
    }
    if (!memory.__portalState) memory.__portalState = emptyState();
    return memory.__portalState;
  }
}

export function resetState(): void {
  if (process.env.VITEST) {
    memory.__portalState = emptyState();
    return;
  }
  persist(emptyState());
}

function id(prefix: string): string {
  return `${prefix}-${createOpaqueCode().slice(0, 12)}`;
}

function audit(state: State, actorId: string, action: string, targetType: string, targetId: string) {
  recordAction(state, actorId, action, targetType, targetId);
}

function saved<T>(state: State, value: T): T {
  persist(state);
  return value;
}

function hitRate(state: State, scope: RateScope, subjectKey: string, now: number): boolean {
  const index = state.rates.findIndex((item) => item.scope === scope && item.subjectKey === subjectKey);
  const current = index >= 0 ? state.rates[index] : undefined;
  const result = registerInvalidAttempt(current, scope, subjectKey, now);
  if (index >= 0) state.rates[index] = result.bucket;
  else state.rates.push(result.bucket);
  return result.blocked;
}

export function createEnrollment(input: {
  fullName: string;
  email: string;
  now?: number;
  ids?: { participantId: string; enrollmentId: string; code: string; accessToken: string };
}) {
  const state = getState();
  const now = input.now ?? Date.now();
  const fullName = normalizeName(input.fullName);
  const email = normalizeEmail(input.email);
  const subjectKey = email ?? "invalid";
  if (!fullName || !email) {
    const blocked = hitRate(state, "enrollment", subjectKey, now);
    return saved(state, {
      ok: false as const,
      field: !fullName ? "fullName" : "email",
      message: blocked ? messages.rateLimited : !fullName ? messages.nameRequired : messages.emailInvalid,
    });
  }
  const existing = state.participants.find((item) => item.email === email);
  if (existing) {
    const blocked = hitRate(state, "enrollment", email, now);
    return saved(state, { ok: false as const, field: "email", message: blocked ? messages.rateLimited : messages.duplicate });
  }
  const participant: Participant = {
    id: input.ids?.participantId ?? id("par"),
    fullName,
    email,
    accessLinkVersion: 1,
    accessToken: input.ids?.accessToken ?? createOpaqueCode(),
    createdAt: new Date(now).toISOString(),
  };
  const enrollment: Enrollment = {
    id: input.ids?.enrollmentId ?? id("ins"),
    participantId: participant.id,
    status: "confirmed",
    createdAt: participant.createdAt,
    confirmedAt: participant.createdAt,
    confirmedBy: participant.email,
  };
  state.participants.push(participant);
  state.enrollments.push(enrollment);
  state.codes.push({
    enrollmentId: enrollment.id,
    code: input.ids?.code ?? createOpaqueCode(),
    createdAt: enrollment.confirmedAt ?? enrollment.createdAt,
  });
  audit(state, participant.email, "confirm", "enrollment", enrollment.id);
  for (const challenge of state.challenges) {
    state.progress.push({
      participantId: participant.id,
      challengeId: challenge.id,
      status: challenge.statement ? "not_started" : "waiting_for_content",
      completedAt: null,
    });
  }
  return saved(state, { ok: true as const, participant, enrollment });
}

export function sendNewLink(email: string) {
  const state = getState();
  const participant = state.participants.find((item) => item.email === normalizeEmail(email));
  if (!participant) return null;
  participant.accessLinkVersion += 1;
  participant.accessToken = createOpaqueCode();
  persist(state);
  return participant;
}

export function confirmLink(email: string, version: number, token: string) {
  const state = getState();
  const participant = state.participants.find((item) => item.email === normalizeEmail(email));
  if (!participant || participant.accessLinkVersion !== version || participant.accessToken !== token) {
    return null;
  }
  const session: Session = { id: id("ses"), email: participant.email, role: "participant", version };
  state.sessions.push(session);
  persist(state);
  return session;
}

export function openOperationalSession(email: string) {
  if (!isOperationalEmail(email)) return null;
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const state = getState();
  const session: Session = { id: id("ses"), email: normalized, role: "operational", version: 0 };
  state.sessions.push(session);
  persist(state);
  return session;
}

export function getSessionById(sessionId: string): Session | null {
  return getState().sessions.find((item) => item.id === sessionId) ?? null;
}

export function confirmEnrollment(enrollmentId: string, actorEmail: string) {
  if (!isOperationalEmail(actorEmail)) return { ok: false as const, message: messages.accessDenied };
  const state = getState();
  const enrollment = state.enrollments.find((item) => item.id === enrollmentId);
  if (!enrollment) return { ok: false as const, message: messages.accessDenied };
  if (enrollment.status === "confirmed") return { ok: true as const, enrollment };
  const actor = normalizeEmail(actorEmail)!;
  enrollment.status = "confirmed";
  enrollment.confirmedAt = new Date().toISOString();
  enrollment.confirmedBy = actor;
  if (!state.codes.some((item) => item.enrollmentId === enrollment.id)) {
    state.codes.push({ enrollmentId: enrollment.id, code: createOpaqueCode(), createdAt: enrollment.confirmedAt });
  }
  audit(state, actor, "confirm", "enrollment", enrollment.id);
  return saved(state, { ok: true as const, enrollment });
}

export function recordCheckIn(code: string, actorEmail: string, now = Date.now()) {
  if (!isOperationalEmail(actorEmail)) return { ok: false as const, message: messages.accessDenied };
  const state = getState();
  const subjectKey = normalizeEmail(actorEmail) ?? "check-in";
  const found = state.codes.find((item) => item.code === code.trim().toLowerCase());
  const enrollment = found ? state.enrollments.find((item) => item.id === found.enrollmentId) : undefined;
  if (!found || !enrollment || enrollment.status !== "confirmed") {
    const blocked = hitRate(state, "check_in", subjectKey, now);
    return saved(state, { ok: false as const, message: blocked ? messages.rateLimited : messages.checkInInvalid });
  }
  if (state.checkIns.some((item) => item.enrollmentId === enrollment.id)) {
    const blocked = hitRate(state, "check_in", subjectKey, now);
    return saved(state, { ok: false as const, message: blocked ? messages.rateLimited : messages.checkInDone });
  }
  const actor = normalizeEmail(actorEmail)!;
  const checkIn: CheckIn = {
    id: id("chk"),
    enrollmentId: enrollment.id,
    recordedBy: actor,
    checkedInAt: new Date(now).toISOString(),
  };
  state.checkIns.push(checkIn);
  audit(state, actor, "check-in", "enrollment", enrollment.id);
  const participant = state.participants.find((item) => item.id === enrollment.participantId);
  return saved(state, { ok: true as const, checkIn, participantName: participant?.fullName ?? "" });
}

export function publishMaterial(input: {
  title: string;
  description: string;
  destinationUrl: string;
  published: boolean;
  actorEmail: string;
}) {
  if (!isOperationalEmail(input.actorEmail)) return { ok: false as const, message: messages.accessDenied };
  if (!normalizeName(input.title) || !normalizeName(input.description) || !isDriveUrl(input.destinationUrl)) {
    return { ok: false as const, message: "Informe título, descrição e um destino https do Google Drive." };
  }
  const actor = normalizeEmail(input.actorEmail)!;
  const material: Material = {
    id: id("mat"),
    title: input.title.trim(),
    description: input.description.trim(),
    destinationUrl: input.destinationUrl.trim(),
    published: input.published,
    updatedBy: actor,
    updatedAt: new Date().toISOString(),
  };
  const state = getState();
  state.materials.push(material);
  audit(state, actor, "publish-material", "material", material.id);
  return saved(state, { ok: true as const, material });
}

export function withdrawMaterial(materialId: string, actorEmail: string) {
  if (!isOperationalEmail(actorEmail)) return { ok: false as const, message: messages.accessDenied };
  const state = getState();
  const material = state.materials.find((item) => item.id === materialId);
  if (!material) return { ok: false as const, message: "Material não encontrado." };
  material.published = false;
  material.updatedAt = new Date().toISOString();
  material.updatedBy = normalizeEmail(actorEmail)!;
  audit(state, material.updatedBy, "withdraw-material", "material", material.id);
  return saved(state, { ok: true as const, material });
}

export function updateChallenge(position: number, title: string, statement: string, actorEmail: string) {
  if (!isOperationalEmail(actorEmail)) return { ok: false as const, message: messages.accessDenied };
  const state = getState();
  const challenge = state.challenges.find((item) => item.position === position);
  if (!challenge || !normalizeName(title)) return { ok: false as const, message: "Desafio inválido." };
  challenge.title = title.trim();
  challenge.statement = statement.trim() ? statement.trim() : null;
  challenge.updatedBy = normalizeEmail(actorEmail)!;
  challenge.updatedAt = new Date().toISOString();
  for (const progress of state.progress.filter((item) => item.challengeId === challenge.id)) {
    if (progress.status !== "completed") {
      progress.status = challenge.statement ? "not_started" : "waiting_for_content";
    }
  }
  audit(state, challenge.updatedBy, "edit-challenge", "challenge", challenge.id);
  return saved(state, { ok: true as const, challenge });
}

export function completeChallenge(email: string, position: number) {
  const state = getState();
  const participant = state.participants.find((item) => item.email === normalizeEmail(email));
  const enrollment = participant ? state.enrollments.find((item) => item.participantId === participant.id) : undefined;
  if (!participant || !enrollment || enrollment.status !== "confirmed") {
    return { ok: false as const, message: messages.accessDenied };
  }
  const challenge = state.challenges.find((item) => item.position === position);
  const progress = challenge
    ? state.progress.find((item) => item.participantId === participant.id && item.challengeId === challenge.id)
    : undefined;
  if (!challenge || !progress || !challenge.statement) {
    return { ok: false as const, message: messages.waitingContent };
  }
  progress.status = "completed";
  progress.completedAt = new Date().toISOString();
  return saved(state, { ok: true as const, progress });
}

export function authorizeCertificate(participantId: string, actorEmail: string) {
  if (!isOperationalEmail(actorEmail)) return { ok: false as const, message: messages.accessDenied };
  const state = getState();
  const existing = state.certificates.find((item) => item.participantId === participantId);
  if (existing) return { ok: true as const, certificate: existing, created: false };
  const participant = state.participants.find((item) => item.id === participantId);
  if (!participant) return { ok: false as const, message: "Participante não encontrada." };
  const actor = normalizeEmail(actorEmail)!;
  const certificate: Certificate = {
    id: id("cer"),
    participantId,
    authenticityCode: createOpaqueCode(),
    issuedAt: new Date().toISOString(),
    authorizedBy: actor,
    emailStatus: "pending",
    emailSentAt: null,
  };
  state.certificates.push(certificate);
  audit(state, actor, "authorize-certificate", "certificate", certificate.id);
  return saved(state, { ok: true as const, certificate, created: true });
}

export function markCertificateEmail(participantId: string, status: "sent" | "not_configured" | "failed") {
  const state = getState();
  const certificate = state.certificates.find((item) => item.participantId === participantId);
  if (!certificate) return null;
  certificate.emailStatus = status;
  certificate.emailSentAt = status === "sent" ? new Date().toISOString() : null;
  persist(state);
  return certificate;
}

export function lookupCertificate(code: string, now = Date.now()) {
  const state = getState();
  const normalized = code.trim().toLowerCase();
  const certificate = state.certificates.find((item) => item.authenticityCode === normalized);
  if (!certificate) {
    const blocked = hitRate(state, "certificate_lookup", "public", now);
    return saved(state, { ok: false as const, message: blocked ? messages.rateLimited : messages.certificateMissing });
  }
  return {
    ok: true as const,
    formation: messages.formation,
    institution: messages.institution,
    issuedAt: certificate.issuedAt,
  };
}

export function recordDataRequest(email: string, kind: RequestKind, newName?: string) {
  const state = getState();
  const participant = state.participants.find((item) => item.email === normalizeEmail(email));
  if (!participant) return { ok: false as const, message: messages.accessDenied };
  if (kind === "correction") {
    const name = normalizeName(newName ?? "");
    if (!name) return { ok: false as const, message: messages.nameRequired };
    const previous = participant.fullName;
    participant.fullName = name;
    state.requests.push({
      id: id("req"),
      participantId: participant.id,
      kind,
      previousName: previous,
      newName: name,
      createdAt: new Date().toISOString(),
      executedAt: new Date().toISOString(),
    });
    return saved(state, { ok: true as const, participant });
  }
  state.requests.push({
    id: id("req"),
    participantId: participant.id,
    kind,
    previousName: null,
    newName: null,
    createdAt: new Date().toISOString(),
    executedAt: null,
  });
  return saved(state, { ok: true as const, participant });
}

export function forgetEnrollment(email: string) {
  const state = getState();
  const normalized = normalizeEmail(email);
  const participant = state.participants.find((item) => item.email === normalized);
  if (!participant) return;
  const enrollmentIds = state.enrollments.filter((item) => item.participantId === participant.id).map((item) => item.id);
  state.participants = state.participants.filter((item) => item.id !== participant.id);
  state.enrollments = state.enrollments.filter((item) => item.participantId !== participant.id);
  state.codes = state.codes.filter((item) => !enrollmentIds.includes(item.enrollmentId));
  state.progress = state.progress.filter((item) => item.participantId !== participant.id);
  state.actions = state.actions.filter((item) => !enrollmentIds.includes(item.targetId));
  persist(state);
}

export function participantByEmail(email: string) {
  return getState().participants.find((item) => item.email === normalizeEmail(email)) ?? null;
}

export function enrollmentByParticipant(participantId: string) {
  return getState().enrollments.find((item) => item.participantId === participantId) ?? null;
}

export function codeByEnrollment(enrollmentId: string) {
  return getState().codes.find((item) => item.enrollmentId === enrollmentId) ?? null;
}

export function publishedMaterials() {
  return getState().materials.filter((item) => item.published);
}

export function recordFor(email: string) {
  const state = getState();
  const participant = participantByEmail(email);
  if (!participant) return null;
  const enrollment = enrollmentByParticipant(participant.id);
  const checkIn = enrollment ? state.checkIns.find((item) => item.enrollmentId === enrollment.id) ?? null : null;
  const challenges = state.challenges
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((challenge) => ({
      challenge,
      progress: state.progress.find((item) => item.participantId === participant.id && item.challengeId === challenge.id) ?? null,
    }));
  const requests = state.requests.filter((item) => item.participantId === participant.id);
  const certificate = state.certificates.find((item) => item.participantId === participant.id) ?? null;
  return { participant, enrollment, checkIn, challenges, requests, certificate };
}

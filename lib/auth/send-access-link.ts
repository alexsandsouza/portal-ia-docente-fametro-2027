import { messages } from "@/lib/messages/pt-br";
import { sendNewLink, type Participant } from "@/lib/store/memory";

export function accessPath(participant: Participant): string {
  const params = new URLSearchParams({
    email: participant.email,
    version: String(participant.accessLinkVersion),
    token: participant.accessToken,
  });
  return `/auth/confirm?${params.toString()}`;
}

export function issueAccessLink(email: string) {
  const participant = sendNewLink(email);
  if (!participant) return null;
  return { participant, path: accessPath(participant), notice: messages.formation };
}

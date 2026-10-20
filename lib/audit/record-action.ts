import { createOpaqueCode } from "@/lib/check-in/code";

export type OperationalAction = {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
};

export function recordAction(
  state: { actions: OperationalAction[] },
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
): OperationalAction {
  const entry: OperationalAction = {
    id: `act-${createOpaqueCode().slice(0, 12)}`,
    actorId,
    action,
    targetType,
    targetId,
    createdAt: new Date().toISOString(),
  };
  state.actions.push(entry);
  return entry;
}

import { rmSync } from "node:fs";

export default function globalSetup() {
  rmSync(".data/portal-state.json", { force: true });
}

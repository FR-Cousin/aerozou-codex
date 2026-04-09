import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { VaultDocument } from "../account/vault.js";
import type { Checklist, CommunityPost, LogbookEntry } from "./inMemoryStores.js";

export type PersistedState = {
  checklists: Checklist[];
  logbook: LogbookEntry[];
  community: CommunityPost[];
  vault: VaultDocument[];
};

const STORE_PATH = resolve(process.cwd(), "data", "aerozou-store.json");

function ensureDir(): void {
  const dir = dirname(STORE_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function loadState(): PersistedState {
  ensureDir();
  if (!existsSync(STORE_PATH)) {
    return { checklists: [], logbook: [], community: [], vault: [] };
  }

  const raw = readFileSync(STORE_PATH, "utf8");
  return JSON.parse(raw) as PersistedState;
}

export function saveState(state: PersistedState): void {
  ensureDir();
  writeFileSync(STORE_PATH, JSON.stringify(state, null, 2), "utf8");
}

export function getStorePath(): string {
  return STORE_PATH;
}

import { existsSync } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const standaloneRoot = path.join(root, ".next", "standalone");
const standaloneNext = path.join(standaloneRoot, ".next");
const sourceStatic = path.join(root, ".next", "static");
const targetStatic = path.join(standaloneNext, "static");
const sourcePublic = path.join(root, "public");
const targetPublic = path.join(standaloneRoot, "public");

async function copyDir(source, target) {
  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
}

async function main() {
  if (!existsSync(standaloneRoot)) {
    throw new Error("Standalone output was not found. Run `next build` first.");
  }

  if (!existsSync(sourceStatic)) {
    throw new Error("Missing `.next/static` folder. Build output is incomplete.");
  }

  await copyDir(sourceStatic, targetStatic);

  if (existsSync(sourcePublic)) {
    await copyDir(sourcePublic, targetPublic);
  }

  console.log("cPanel bundle ready in `.next/standalone`.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

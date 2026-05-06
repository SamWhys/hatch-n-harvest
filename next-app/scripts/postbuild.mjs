import { rmSync, renameSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const repoRoot = resolve(projectRoot, "..");
const out = resolve(projectRoot, "out");
const docs = resolve(repoRoot, "docs");

if (!existsSync(out)) {
  console.error(`postbuild: expected ${out} to exist after \`next build\`.`);
  process.exit(1);
}

if (existsSync(docs)) {
  rmSync(docs, { recursive: true, force: true });
}

renameSync(out, docs);

writeFileSync(resolve(docs, ".nojekyll"), "");

console.log(`postbuild: moved ${out} → ${docs} and wrote .nojekyll`);

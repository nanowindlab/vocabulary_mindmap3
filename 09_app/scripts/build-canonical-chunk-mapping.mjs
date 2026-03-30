import { canonicalChunkMappingPath, ensureCanonicalChunkMapping } from "./canonical-chunk-mapping-core.mjs";

const payload = ensureCanonicalChunkMapping({ force: false });

console.log(JSON.stringify({
  written: canonicalChunkMappingPath,
  entry_count: payload.entry_count,
  chunk_count: payload.chunk_count,
  chunk_size: payload.chunk_size,
}, null, 2));

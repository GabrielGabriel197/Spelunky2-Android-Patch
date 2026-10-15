// Lowers the heap VirtualAlloc hint address from the 7-8 TiB range to below 512 GiB.
const PATCHES = [
  {
    name: "Heap base address (RBX constant 0x7017F800000 -> 0x17F800000)",
    signature: [0x48, 0xbb, 0x00, 0x00, 0x80, 0x7f, 0x01, 0x07, 0x00, 0x00],
    anchor: 5, // rare byte used to speed up scanning
    offset: 7,
    expected: 0x07,
    value: 0x00,
  },
  {
    name: "Heap address random mask (0xFE -> 0x7E)",
    signature: [
      0x81, 0xe1, 0xfe, 0x00, 0x00, 0x00, 0x48, 0xc1, 0xe1, 0x20, 0x48, 0x09,
      0xd9, 0xba, 0x00, 0x00, 0x00, 0x02,
    ],
    anchor: 13,
    offset: 2,
    expected: 0xfe,
    value: 0x7e,
  },
];

function findAll(data, sig, anchor) {
  const hits = [];
  const key = sig[anchor];
  let i = data.indexOf(key, anchor);
  while (i !== -1) {
    const start = i - anchor;
    if (start + sig.length <= data.length) {
      let ok = true;
      for (let j = 0; j < sig.length; j++) {
        if (data[start + j] !== sig[j]) {
          ok = false;
          break;
        }
      }
      if (ok) hits.push(start);
    }
    i = data.indexOf(key, i + 1);
  }
  return hits;
}

function isPE(data) {
  if (data.length < 0x40 || data[0] !== 0x4d || data[1] !== 0x5a) return false;
  const pe = data[0x3c] | (data[0x3d] << 8) | (data[0x3e] << 16) | (data[0x3f] << 24);
  return (
    pe > 0 && pe + 4 <= data.length &&
    data[pe] === 0x50 && data[pe + 1] === 0x45 && data[pe + 2] === 0 && data[pe + 3] === 0
  );
}

// Patches `data` (Uint8Array) in place; throws if any signature is not matched exactly once.
function applyPatches(data) {
  if (!isPE(data)) throw new Error("Not a valid Windows executable.");
  const found = PATCHES.map((p) => ({ p, hits: findAll(data, p.signature, p.anchor) }));
  for (const { p, hits } of found) {
    if (hits.length !== 1) {
      throw new Error(
        `"${p.name}": expected 1 match, found ${hits.length}. ` +
          "The file is an unsupported version or is already patched."
      );
    }
  }
  return found.map(({ p, hits }) => {
    const at = hits[0] + p.offset;
    data[at] = p.value;
    return { name: p.name, fileOffset: at };
  });
}

if (typeof module !== "undefined") module.exports = { PATCHES, applyPatches, findAll, isPE };

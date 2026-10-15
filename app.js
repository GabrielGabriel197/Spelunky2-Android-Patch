const fileInput = document.getElementById("file");
const statusEl = document.getElementById("status");
const hashEl = document.getElementById("hash");
const downloadEl = document.getElementById("download");

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.className = isError ? "error" : "";
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  downloadEl.hidden = true;
  hashEl.textContent = "";
  if (!file) return;

  try {
    setStatus("Reading file...");
    const buffer = await file.arrayBuffer();

    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    hashEl.textContent = `Original SHA-256: ${hex}`;

    setStatus("Patching...");
    await new Promise((r) => setTimeout(r, 0));
    const applied = applyPatches(new Uint8Array(buffer));

    const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.microsoft.portable-executable" }));
    downloadEl.href = url;
    downloadEl.download = "Spel2.exe";
    downloadEl.hidden = false;
    setStatus("Patched " + applied.map((a) => `0x${a.fileOffset.toString(16)}`).join(", ") + ".");
  } catch (e) {
    setStatus(e.message, true);
  }
});

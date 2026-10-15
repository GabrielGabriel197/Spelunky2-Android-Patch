# Spelunky2-Android-Patch
Patcher for the Spelunky 2 exe, so it can run on android via compatibility layers (Such as GameNative or DroidDeck)

Open the GitHub Pages site, select your own `Spel2.exe`, and download the patched copy. Patching happens entirely in the browser; no game files are hosted or uploaded.

## What it patches
The game reserves its 32 MiB heap blocks at a random address in the 7-8 TiB range, which Android compatibility layers cannot provide. Two single-byte edits move it below 512 GiB:

- `MOV RBX, 0x7017F800000` becomes `MOV RBX, 0x17F800000`
- `AND ECX, 0xFE` becomes `AND ECX, 0x7E`

The patcher locates both instructions by byte signature and refuses files where either is not found exactly once.

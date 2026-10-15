# Spelunky2-Android-Patch
Patcher for the Spelunky 2 exe, so it can run on android via compatibility layers (Such as DroidDeck and GameNative)

Open the [GitHub Pages site](https://gabrielgabriel197.github.io/Spelunky2-Android-Patch/), select your own `Spel2.exe` (located in the game's folder), and download the patched copy. Patching happens entirely in the browser; no game files are hosted or uploaded.

Simply replace the .exe in the game's folder with your patched version:

On DroidDeck: Install the game normally, then on the DroidDeck UI (BEFORE you open steam), go to Games, Spelunky 2, Game Files, replace the `Spel2.exe` with the patched version.

On GameNative: Go to the game on GameNative, tap the cog icon, scroll down and tap Import Files, select the patched `Spel2.exe`, choose Game Directory, check "Replace existing files" on the bottom, and tap copy file.

So far only tested via DroidDeck and GameNative on a Retroid Pocket G2. I booted the game and played (badly) a few runs to try and verify everything was working, and so far everything looks good. Feel free to share this tool with anyone trying to get the game running on android. Other compatibility layers should work, as long as you can replace the .exe. 

# LLM Disclaimer
I am not proud of it, but this was very much so vibe coded. I am not versed in decompiling, and the work was mostly done by Claude. I simply ran the .exe through Ghidra and provided the few (raw machine) code snippets that have to do with the memory allocation that were asked. I provide this tool so hopefully no more water is wasted on trying to get this game working on android.

This is not a recompilation or a reimplementation, only a patch for the original .exe so it can easily run through compatibility layers. This repository hosts no game files, and Claude only ever saw a few snippets of the memory allocation code.

## What it patches
The game reserves its 32 MiB heap blocks at a random address in the 7-8 TiB range, which Android compatibility layers cannot provide. Two single-byte edits move it below 512 GiB:

- `MOV RBX, 0x7017F800000` becomes `MOV RBX, 0x17F800000`
- `AND ECX, 0xFE` becomes `AND ECX, 0x7E`

The patcher locates both instructions by byte signature and refuses files where either is not found exactly once.


## Special Thanks

[Zod](https://github.com/zod701) First figured out the memory allocation issue, which allowed for this patch to be created. Thanks!

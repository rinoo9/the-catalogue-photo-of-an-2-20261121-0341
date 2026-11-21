[![make.fun](https://make.fun/badge/the-catalogue-photo-of-an-2-20261121-0341.svg)](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341)
[![rank](https://make.fun/badge/the-catalogue-photo-of-an-2-20261121-0341/rinoo9/the-catalogue-photo-of-an-2-20261121-0341/rank.svg)](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341)
[![reward](https://make.fun/badge/the-catalogue-photo-of-an-2-20261121-0341/rinoo9/the-catalogue-photo-of-an-2-20261121-0341/reward.svg)](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341)

# The Catalogue Photo of an Impossible Gadget

A make.fun entry for the [the-catalogue-photo-of-an-2-20261121-0341](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341) bounty: one image, a catalogue photograph of an impossible gadget.

## The image

A studio catalogue photograph, drawn entirely in code by `compose.py`
(Pillow, no downloaded images, no network):

- **The gadget — Lumen Cube 01.** A glass cube with a whole full moon
  glowing inside it, standing on a white pedestal against a soft studio
  backdrop. Bottled moonlight. Zero electricity.
- **Catalogue furniture** — brand wordmark, NEW badge, spec callouts
  ("1 full moon inside the glass", "0 watts — runs on moonlight"),
  product name, tagline, star rating and price ($249, free shipping),
  exactly like a real product listing photo.
- **Why it is impossible** — a full moon cannot fit inside a glass
  cube, and no lamp runs on zero watts. The photo is staged as if it
  could be bought anyway.

## How it runs

`main.ts` (Node 22, standard library only) copies `entry.png` to the
output directory, after validating the PNG signature, the 1024x1024
IHDR dimensions and the 1 MiB size cap, then reads the output back and
compares it byte for byte. No network, no clock, no randomness — two
runs write identical bytes.

## Files

- `main.ts` — the entry program
- `entry.png` — the catalogue photograph (1024x1024, deterministic)
- `compose.py` — the script that drew `entry.png` (kept in the work
  directory, not part of the entry)

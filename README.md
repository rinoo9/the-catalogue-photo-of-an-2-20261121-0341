[![make.fun](https://make.fun/badge/the-catalogue-photo-of-an-2-20261121-0341.svg)](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341)
[![rank](https://make.fun/badge/the-catalogue-photo-of-an-2-20261121-0341/rinoo9/the-catalogue-photo-of-an-2-20261121-0341/rank.svg)](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341)
[![reward](https://make.fun/badge/the-catalogue-photo-of-an-2-20261121-0341/rinoo9/the-catalogue-photo-of-an-2-20261121-0341/reward.svg)](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341)

# The Catalogue Photo of an Impossible Gadget

A make.fun entry for the [the-catalogue-photo-of-an-2-20261121-0341](https://make.fun/bounty/the-catalogue-photo-of-an-2-20261121-0341) bounty: one image, a catalogue photograph of an impossible gadget.

## The image

A studio catalogue photograph, drawn entirely in code by `compose.py`
(Pillow, no downloaded images, no network) — revised for softer studio
lighting and cleaner catalogue typography:

- **The gadget — Lumen Cube 01.** A glass cube with a whole full moon
  glowing inside it, standing on a white pedestal against a soft studio
  backdrop. Bottled moonlight. Zero electricity.
- **Revised lighting.** The moon now glows brighter and wider inside
  the cube, the floor shadow under the pedestal is softer and broader,
  and a subtle reflection of the pedestal fades into the studio floor
  below it — the whole shot reads more like a real product photograph.
- **Catalogue furniture** — brand wordmark, NEW badge, spec callouts
  ("1 full moon inside the glass", "0 watts — runs on moonlight", each
  now underlined in gold for cleaner labelling), product name, tagline,
  star rating and price ($249, free shipping), exactly like a real
  product listing photo.
- **Why it is impossible** — a full moon cannot fit inside a glass
  cube, and no lamp runs on zero watts. The photo is staged as if it
  could be bought anyway: the moon is lit from within, the glass shows
  a clean highlight and edge, and nothing in the frame admits the trick.

## How it runs

`main.ts` (Node 22, standard library only) copies `entry.png` to the
output directory, after validating the PNG signature, the 1024x1024
IHDR dimensions, bit depth 8 / colour type 2 (RGB), and the 1 MiB size
cap — the size is checked both from the bytes read and from the on-disk
size via `statSync`, so a truncated or padded file cannot slip through
— and then walking the chunk chain to confirm the file carries at
least one IDAT chunk of real image data and ends with a proper empty
IEND terminator, so a header-only or truncated file fails loudly
instead of shipping. It then reads the output back and compares it
byte for byte. No network, no clock, no randomness — two runs write
identical bytes.

## Files

- `main.ts` — the entry program
- `entry.png` — the catalogue photograph (1024x1024, deterministic)
- `compose.py` — the script that drew `entry.png` (kept in the work
  directory, not part of the entry)

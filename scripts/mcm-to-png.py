#!/usr/bin/env python3
"""Convert a Betaflight MAX7456 .mcm font into a 16x16 PNG sprite sheet.

Each glyph is 12x18 pixels, 2 bits per pixel (00 black, 10 white, x1 transparent).
Usage: mcm-to-png.py <font.mcm> <out.png>
"""
import struct, sys, zlib

W, H, COLS = 12, 18, 16
lines = open(sys.argv[1]).read().split()
assert lines[0] == "MAX7456"
data = [int(b, 2) for b in lines[1:]]
glyphs = len(data) // 64

rows = (glyphs + COLS - 1) // COLS
img = [[(0, 0, 0, 0)] * (COLS * W) for _ in range(rows * H)]
for g in range(glyphs):
    chunk = data[g * 64 : g * 64 + 54]
    px = [(byte >> s) & 3 for byte in chunk for s in (6, 4, 2, 0)]
    gx, gy = (g % COLS) * W, (g // COLS) * H
    for i, v in enumerate(px):
        color = {0: (0, 0, 0, 255), 2: (255, 255, 255, 255)}.get(v, (0, 0, 0, 0))
        img[gy + i // W][gx + i % W] = color

def chunk(tag, body):
    return struct.pack(">I", len(body)) + tag + body + struct.pack(">I", zlib.crc32(tag + body))

raw = b"".join(b"\0" + bytes(c for p in row for c in p) for row in img)
png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", COLS * W, rows * H, 8, 6, 0, 0, 0))
png += chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
open(sys.argv[2], "wb").write(png)
print(f"{glyphs} glyphs -> {COLS * W}x{rows * H}")

/**
 * Generates public/og-image.png — the Open Graph social share image.
 * Also generates public/favicon.png and public/apple-touch-icon.png from app/icon.svg.
 * Run: node scripts/generate-og.mjs
 */
import satori from "satori";
import sharp from "sharp";
import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/og-image.png");

// Fetch a font file from Google Fonts using a legacy UA to get TTF format
async function fetchFont(family) {
  const css = await fetch(
    `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}`,
    { headers: { "User-Agent": "Mozilla/4.0" } }
  ).then((r) => r.text());

  const url = css.match(/url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`No font URL found for: ${family}`);
  return Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
}

console.log("Fetching fonts...");
const [bebasFont, outfitFont] = await Promise.all([
  fetchFont("Bebas Neue"),
  fetchFont("Outfit:300"),
]);

console.log("Rendering...");
const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        width: 1200,
        height: 630,
        background: "#0a0e1a",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Top-right glow
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              right: 0,
              width: 500,
              height: 500,
              background:
                "linear-gradient(225deg, rgba(0,212,255,0.12) 0%, transparent 65%)",
            },
            children: "",
          },
        },

        // Left cyan accent bar
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              width: 6,
              height: 630,
              background:
                "linear-gradient(to bottom, #00d4ff, rgba(0,212,255,0))",
            },
            children: "",
          },
        },

        // Main content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 80px",
              flex: 1,
            },
            children: [
              // Eyebrow
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 16,
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          width: 40,
                          height: 1,
                          background: "#00d4ff",
                        },
                        children: "",
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "Bebas Neue",
                          fontSize: 15,
                          letterSpacing: 7,
                          color: "#00d4ff",
                        },
                        children: "FULL STACK DEVELOPER",
                      },
                    },
                  ],
                },
              },

              // MIKE E.
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "Bebas Neue",
                    fontSize: 155,
                    lineHeight: 0.9,
                    letterSpacing: 3,
                    color: "#f0f4ff",
                  },
                  children: "MIKE E.",
                },
              },

              // TAYLOR
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "Bebas Neue",
                    fontSize: 155,
                    lineHeight: 0.9,
                    letterSpacing: 3,
                    color: "#00d4ff",
                  },
                  children: "TAYLOR",
                },
              },

              // Stats row
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    gap: 36,
                    marginTop: 32,
                    paddingTop: 28,
                    borderTop: "1px solid rgba(0,212,255,0.15)",
                  },
                  children: [
                    "15+ Years Experience",
                    "5 Federal Clients",
                    "10+ Apps Shipped",
                  ].map((stat) => ({
                    type: "div",
                    props: {
                      style: {
                        fontFamily: "Outfit",
                        fontSize: 15,
                        color: "#7a8aaa",
                        letterSpacing: 1.5,
                      },
                      children: stat,
                    },
                  })),
                },
              },
            ],
          },
        },

        // URL — bottom right
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: 36,
              right: 80,
              fontFamily: "Bebas Neue",
              fontSize: 17,
              letterSpacing: 5,
              color: "rgba(0,212,255,0.35)",
            },
            children: "MIKEETAYLOR.COM",
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Bebas Neue", data: bebasFont, style: "normal" },
      { name: "Outfit", data: outfitFont, weight: 300, style: "normal" },
    ],
  }
);

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(OUT, png);
console.log("✓ OG image → public/og-image.png");

// Favicon PNGs from public/icon.svg
const iconSvg = readFileSync(resolve(__dirname, "../public/icon.svg"));
const favicon96 = await sharp(iconSvg).resize(96, 96).png().toBuffer();
writeFileSync(resolve(__dirname, "../public/favicon.png"), favicon96);
console.log("✓ Favicon → public/favicon.png");

const favicon180 = await sharp(iconSvg).resize(180, 180).png().toBuffer();
writeFileSync(resolve(__dirname, "../public/apple-touch-icon.png"), favicon180);
console.log("✓ Apple touch icon → public/apple-touch-icon.png");

// favicon.ico (48x48 PNG embedded in ICO container)
const png48 = await sharp(iconSvg).resize(48, 48).png().toBuffer();
const icoHeader = Buffer.alloc(6); icoHeader.writeUInt16LE(0,0); icoHeader.writeUInt16LE(1,2); icoHeader.writeUInt16LE(1,4);
const dirEntry = Buffer.alloc(16); dirEntry.writeUInt8(48,0); dirEntry.writeUInt8(48,1); dirEntry.writeUInt8(0,2); dirEntry.writeUInt8(0,3); dirEntry.writeUInt16LE(1,4); dirEntry.writeUInt16LE(32,6); dirEntry.writeUInt32LE(png48.length,8); dirEntry.writeUInt32LE(22,12);
writeFileSync(resolve(__dirname, "../public/favicon.ico"), Buffer.concat([icoHeader, dirEntry, png48]));
console.log("✓ favicon.ico → public/favicon.ico");

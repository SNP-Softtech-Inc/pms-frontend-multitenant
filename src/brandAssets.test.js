// The browser tab shows the SNP mark and the product's name, not Create
// React App's defaults. The page shell is plain files in public/, so they are
// checked as files.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const pub = (file) => path.join(__dirname, "..", "public", file);
const read = (file) => fs.readFileSync(pub(file));

const NAME = "SNP Taxes & Financials PMS";

// Create React App's own React-logo icons, by the start of their SHA-256:
// none may be left in place.
const CRA_DEFAULTS = {
  "favicon.ico": "3d10f7da6c603178",
  "logo192.png": "c386396ec70db360",
  "logo512.png": "9ea4f4da7050c0cc",
};
const fingerprint = (buf) => crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16);

const pngSize = (buf) => ({
  png: buf.slice(1, 4).toString("latin1") === "PNG",
  width: buf.readUInt32BE(16),
  height: buf.readUInt32BE(20),
});

describe("browser tab branding", () => {
  const html = read("index.html").toString("utf8");
  const manifest = JSON.parse(read("manifest.json").toString("utf8"));

  it("names the tab after the product", () => {
    expect(html).toMatch(/<title>SNP Taxes &amp; Financials PMS<\/title>/);
    expect(html).not.toMatch(/React App|Client Portal<\/title>/);
  });

  it("uses the SNP icon for the tab and home-screen", () => {
    expect(html).toMatch(/<link rel="icon" href="%PUBLIC_URL%\/favicon\.ico" \/>/);
    expect(html).toMatch(/<link rel="apple-touch-icon" href="%PUBLIC_URL%\/logo192\.png" \/>/);
  });

  it("describes the app as itself", () => {
    expect(html).toMatch(/name="description"\s+content="SNP Taxes &amp; Financials PMS"/);
  });

  it("names the installed app the same way", () => {
    expect(manifest.name).toBe(NAME);
    expect(manifest.short_name).toBe("SNP PMS");
  });

  it("ships square SNP icons, not Create React App's", () => {
    expect(pngSize(read("logo192.png"))).toEqual({ png: true, width: 192, height: 192 });
    expect(pngSize(read("logo512.png"))).toEqual({ png: true, width: 512, height: 512 });

    const ico = read("favicon.ico");
    expect(ico.readUInt16LE(2)).toBe(1); // an icon file
    const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => ico[6 + i * 16] || 256);
    expect(sizes).toEqual(expect.arrayContaining([16, 32, 48]));

    Object.entries(CRA_DEFAULTS).forEach(([file, react]) => {
      expect(fingerprint(read(file))).not.toBe(react);
    });
  });
});

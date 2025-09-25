// lib/badWords.ts

// Kumpulan kata kasar + variasinya
const badWordsRaw = [
  // Hewan dipakai sebagai makian
  "anjing",
  "anjir",
  "anjirrr",
  "anjrit",
  "monyet",
  "monyettt",
  "bangke",
  "bangkai",
  "kampret",
  "keparat",
  "babi",
  "tai babi",
  "asu",

  // Kata kasar umum
  "bangsat",
  "bajingan",
  "brengsek",
  "sialan",
  "tolol",
  "goblok",
  "bodoh",
  "dongo",
  "idiot",
  "belegug",
  "pantek",
  "asw",

  // Alat kelamin
  "kontol",
  "kntl",
  "memek",
  "pepek",
  "peler",
  "titit",
  "penis",
  "vagina",
  "jembut",
  "ewe",
  "ngewe",

  // Gabungan kata kasar
  "tai",
  "tai kucing",
  "tai anjing",
  "anjing lo",
  "anjing lu",
  "goblok lo",
  "tolol lu",

  // Umpatan daerah
  "jancok",
  "cukimai",
  "puki",
  "pukimak",
  "kampang",

  // Singkatan & variasi
  "perek",
  "pelacur",
  "lonte",
  "jablay",
  "bencong",
  "banci",
  "ngentot",
  "entod",
  "entot",
  "kentot",
  "colmek",
  "colok",
  "coli",
  "masturbasi",
  "bokep",
  "porno",
  "mesum",
  "hentai",

  // Tambahan variasi karakter
  "anj!ng",
  "anj*ng",
  "anj#ng",
  "anj1ng",
  "k0nt0l",
  "k0ntl",
  "mem3k",
  "p3pek",
  "t0lol",
  "g0blok",
];

// Hapus duplikat otomatis
export const badWords = Array.from(new Set(badWordsRaw));

// Escape karakter spesial biar aman dipakai di regex
function escapeRegex(char: string) {
  return char.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

// Buat regex fleksibel: "anjing" -> bisa match "a.n.j!iinggg"
export function createRegex(word: string) {
  const pattern = word
    .toLowerCase()
    .split("")
    .map((char) => `${escapeRegex(char)}+[^a-z0-9]*`)
    .join("");
  return new RegExp(pattern, "gi");
}

// Cache regex sekali saja biar performa lebih baik
const badWordRegexes = badWords.map((word) => createRegex(word));

// Fungsi untuk filter kata kasar
export function filterBadWords(text: string, mode: "block" | "star" = "block") {
  let filteredText = text;

  badWordRegexes.forEach((regex) => {
    filteredText = filteredText.replace(regex, (match) => {
      if (mode === "star") {
        return "*".repeat(match.length); // contoh: anjing -> ******
      }
      return "***"; // default: anjing -> [diblokir]
    });
  });

  return filteredText;
}

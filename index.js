const HASH_PRIME_1 = 374761393;
const HASH_PRIME_2 = 668265263;
const MAX_INT = 2147483647;

function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';

    const words = [];
    const asciiBitLength = ascii.length * 8;  

    const hash = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    ascii += '\x80'; // Append '1' bit and seven '0' bits
    while ((ascii.length % 64) - 56) ascii += '\x00';

    for (let i = 0; i < ascii.length; i++) {
        const j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII only
        words[i >> 2] |= j << ((3 - (i % 4)) * 8);
    }

    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    for (let j = 0; j < words.length; ) {
        const w = words.slice(j, j += 16);
        const oldHash = hash.slice();
        for (let i = 0; i < 64; i++) {
            const w15 = w[i - 15], w2 = w[i - 2];
            const a = hash[0], b = hash[1], c = hash[2], d = hash[3];
            const e = hash[4], f = hash[5], g = hash[6], h = hash[7];

            const s0 = rightRotate(w15 || 0, 7) ^ rightRotate(w15 || 0, 18) ^ ((w15 || 0) >>> 3);
            const s1 = rightRotate(w2 || 0, 17) ^ rightRotate(w2 || 0, 19) ^ ((w2 || 0) >>> 10);

            w[i] = (i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);

            const ch = (e & f) ^ (~e & g);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp1 = (h + ((e >>> 6) ^ (e >>> 11) ^ (e >>> 25)) + ch + k[i] + w[i]) | 0;
            const temp2 = (((a >>> 2) ^ (a >>> 13) ^ (a >>> 22)) + maj) | 0;

            hash[7] = hash[6];
            hash[6] = hash[5];
            hash[5] = hash[4];
            hash[4] = (d + temp1) | 0;
            hash[3] = hash[2];
            hash[2] = hash[1];
            hash[1] = hash[0];
            hash[0] = (temp1 + temp2) | 0;
        }

        for (let i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (let i = 0; i < hash.length; i++) {
        result += ('00000000' + (hash[i] >>> 0).toString(16)).slice(-8);
    }

    return result;
}

const smoothstep = (t) => t * t * (3 - 2 * t);

const dot_product = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];
const dist = (p1, p2) => [p2[0] - p1[0], p2[1] - p1[1]];

const interp_point = (corners, p, dots, smooth) => {
    let tx, ty
  if (smooth){
      tx = smoothstep(p[0] - corners[0][0]);
      ty = smoothstep(p[1] - corners[0][1]);
  }
  else{
      tx = p[0] - corners[0][0];
      ty = p[1] - corners[0][1]; 
  }

  const ix0 = dots[0] * (1 - tx) + dots[1] * tx;
  const ix1 = dots[2] * (1 - tx) + dots[3] * tx;

  return ix0 * (1 - ty) + ix1 * ty;
};

// Cache for base angles computed from hashes
const angleCache = new Map();

const getBaseAngle = (x, y, seed) => {
    const key = `${x},${y},${seed}`;
    
    if (!angleCache.has(key)) {
        const hash = sha256(key).toString();
        const hashNum = parseInt(hash.substring(0, 8), 16) / 0xFFFFFFFF;
        const baseAngle = hashNum * 2 * Math.PI;
        angleCache.set(key, baseAngle);
    }
    
    return angleCache.get(key);
};

const generateUnitVector = (x, y, seed, angleOffset) => {
    const baseAngle = getBaseAngle(x, y, seed);
    const angle = baseAngle + angleOffset;
    return [Math.cos(angle), Math.sin(angle)];
};

export default function generateNoiseGrid(
  seed,
  inc_amount,
  gridWidth,
  gridHeight,
  subDiv,
  smooth
) {
  let initialAngle = 1
  const currentAngle = initialAngle * inc_amount;
  const vertsX = gridWidth - 1;
  const vertsY = gridHeight - 1;

  // Generate edge vertices
  const edges = [];
  for (let x = 0; x < gridWidth; x++) {
    const row = [];
    for (let y = 0; y < gridHeight; y++) {
      row.push({
        coords: [x, y],
        unitVector: generateUnitVector(x, y, seed, currentAngle),
      });
    }
    edges.push(row);
  }

  // Generate noise grid
  const noiseGrid = [];
  
  for (let y = 0; y < vertsY; y++) {
    for (let x = 0; x < vertsX; x++) {
      const corners = [
        edges[x][y],
        edges[x + 1][y],
        edges[x][y + 1],
        edges[x + 1][y + 1],
      ];

      for (let j = 1; j <= subDiv; j++) {
        const gridY = y * subDiv + j - 1;
        if (!noiseGrid[gridY]) noiseGrid[gridY] = [];

        for (let i = 1; i <= subDiv; i++) {
          const gridX = x * subDiv + i - 1;
          const point = [
            corners[0].coords[0] + i / (subDiv + 1),
            corners[0].coords[1] + j / (subDiv + 1),
          ];

          const dots = corners.map((corner) =>
            dot_product(dist(corner.coords, point), corner.unitVector)
          );

          const val = interp_point(
            corners.map((c) => c.coords),
            point,
            dots,
            smooth
          );

          noiseGrid[gridY][gridX] = val;
        }
      }
    }
  }

  return noiseGrid;
}
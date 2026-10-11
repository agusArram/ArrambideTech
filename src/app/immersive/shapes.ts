/**
 * Generadores de nubes de puntos para la escena inmersiva.
 * Todas devuelven `count * 3` floats (x, y, z) y son deterministas (PRNG con semilla),
 * de modo que la forma es idéntica entre cargas y no depende de ningún asset externo.
 */

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (dx: number, dy: number, sx: number, sy: number): number =>
  Math.exp(-((dx / sx) ** 2 + (dy / sy) ** 2));

/**
 * Terminal de acceso facial (tablet de pared con módulo de cámara), de frente.
 * Incluye cuerpo con espesor, pantalla en líneas de barrido, visor de captura
 * con esquinas y halos de detección delante del equipo.
 */
export function terminalShape(count: number, rnd: Rng): Float32Array {
  const out = new Float32Array(count * 3);
  const SHIFT = 0.0;

  const put = (i: number, x: number, y: number, z: number): void => {
    out[i * 3] = x;
    out[i * 3 + 1] = y + SHIFT;
    out[i * 3 + 2] = z;
  };

  /** Punto sobre el contorno de un rectángulo redondeado. */
  const rrOutline = (hw: number, hh: number, r: number, cy: number): [number, number] => {
    const straightW = 2 * (hw - r);
    const straightH = 2 * (hh - r);
    const arc = (Math.PI * r) / 2;
    const per = 2 * straightW + 2 * straightH + 4 * arc;
    let d = rnd() * per;
    if (d < straightW) return [-hw + r + d, hh + cy];
    d -= straightW;
    if (d < arc) {
      const a = (d / arc) * (Math.PI / 2);
      return [hw - r + Math.sin(a) * r, hh - r + Math.cos(a) * r + cy];
    }
    d -= arc;
    if (d < straightH) return [hw, hh - r - d + cy];
    d -= straightH;
    if (d < arc) {
      const a = (d / arc) * (Math.PI / 2);
      return [hw - r + Math.cos(a) * r, -hh + r - Math.sin(a) * r + cy];
    }
    d -= arc;
    if (d < straightW) return [hw - r - d, -hh + cy];
    d -= straightW;
    if (d < arc) {
      const a = (d / arc) * (Math.PI / 2);
      return [-hw + r - Math.sin(a) * r, -hh + r - Math.cos(a) * r + cy];
    }
    d -= arc;
    if (d < straightH) return [-hw, -hh + r + d + cy];
    d -= straightH;
    const a = (d / arc) * (Math.PI / 2);
    return [-hw + r - Math.cos(a) * r, hh - r + Math.sin(a) * r + cy];
  };

  const circle = (cx: number, cy: number, r: number): [number, number] => {
    const a = rnd() * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };

  // Visor de captura: centro y semilado
  const vx = 0;
  const vy = -0.06;
  const vh = 0.3;
  const arm = 0.13;

  for (let i = 0; i < count; i++) {
    const k = rnd();

    if (k < 0.15) {
      // Cuerpo: contorno con espesor
      const [x, y] = rrOutline(0.54, 0.97, 0.11, 0);
      put(i, x, y, -rnd() * 0.08);
    } else if (k < 0.23) {
      // Bisel interior
      const [x, y] = rrOutline(0.46, 0.89, 0.08, 0);
      put(i, x, y, 0.004);
    } else if (k < 0.3) {
      // Marco de pantalla
      const [x, y] = rrOutline(0.39, 0.6, 0.04, -0.12);
      put(i, x, y, 0.01);
    } else if (k < 0.5) {
      // Pantalla: líneas de barrido
      const row = Math.round(rnd() * 34) / 34;
      const y = -0.12 + (row * 2 - 1) * 0.58;
      put(i, (rnd() * 2 - 1) * 0.37, y, 0.006);
    } else if (k < 0.58) {
      // Módulo de cámara: anillos concéntricos
      const r = [0.085, 0.052, 0.022][Math.floor(rnd() * 3)];
      const [x, y] = circle(0, 0.745, r);
      put(i, x, y, 0.02);
    } else if (k < 0.61) {
      // Sensores IR laterales
      const side = rnd() < 0.5 ? -1 : 1;
      const [x, y] = circle(side * 0.24, 0.745, 0.018 * rnd());
      put(i, x, y, 0.015);
    } else if (k < 0.73) {
      // Visor: esquinas
      const sx = rnd() < 0.5 ? -1 : 1;
      const sy = rnd() < 0.5 ? -1 : 1;
      const t = rnd() * arm;
      if (rnd() < 0.5) put(i, vx + sx * (vh - t), vy + sy * vh, 0.04);
      else put(i, vx + sx * vh, vy + sy * (vh - t), 0.04);
    } else if (k < 0.78) {
      // Retícula central del visor
      const t = rnd() * 2 - 1;
      if (rnd() < 0.5) put(i, vx + t * 0.045, vy, 0.04);
      else put(i, vx, vy + t * 0.045, 0.04);
    } else if (k < 0.82) {
      // Controles inferiores
      const n = Math.floor(rnd() * 3);
      const [x, y] = circle(-0.14 + n * 0.14, -0.8, 0.026);
      put(i, x, y, 0.012);
    } else if (k < 0.93) {
      // Halos de detección delante del equipo
      const ring = rnd() < 0.55 ? 0 : 1;
      const [x, y] = circle(vx, vy, ring === 0 ? 0.78 : 1.08);
      put(i, x, y, ring === 0 ? 0.38 : 0.72);
    } else {
      // Cara posterior (sparse) para dar volumen al girar
      const [x, y] = rrOutline(0.54, 0.97, 0.11, 0);
      put(i, x * rnd(), y * rnd(), -0.08);
    }
  }
  return out;
}

function insideRounded(x: number, y: number, hw: number, hh: number, r: number): boolean {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  if (ax > hw || ay > hh) return false;
  const cx = ax - (hw - r);
  const cy = ay - (hh - r);
  if (cx > 0 && cy > 0) return cx * cx + cy * cy <= r * r;
  return true;
}

/** Tarjeta de pago: contorno, chip, numeración, línea de nombre y marca. */
export function cardShape(count: number, rnd: Rng): Float32Array {
  const out = new Float32Array(count * 3);
  const hw = 0.86;
  const hh = 0.54;
  const r = 0.12;
  const scale = 1.3;

  const put = (i: number, x: number, y: number): void => {
    out[i * 3] = x * scale;
    out[i * 3 + 1] = y * scale + 0.1;
    out[i * 3 + 2] = (rnd() - 0.5) * 0.02;
  };

  for (let i = 0; i < count; i++) {
    const k = rnd();

    if (k < 0.34) {
      // Relleno suave
      let x = 0;
      let y = 0;
      do {
        x = (rnd() * 2 - 1) * hw;
        y = (rnd() * 2 - 1) * hh;
      } while (!insideRounded(x, y, hw, hh, r));
      put(i, x, y);
    } else if (k < 0.58) {
      // Contorno
      const per = 2 * (2 * hw + 2 * hh);
      let d = rnd() * per;
      let x: number;
      let y: number;
      if (d < 2 * hw) {
        x = -hw + d;
        y = hh;
      } else if ((d -= 2 * hw) < 2 * hh) {
        x = hw;
        y = hh - d;
      } else if ((d -= 2 * hh) < 2 * hw) {
        x = hw - d;
        y = -hh;
      } else {
        d -= 2 * hw;
        x = -hw;
        y = -hh + d;
      }
      const inset = rnd() * 0.014;
      x -= Math.sign(x) * inset;
      y -= Math.sign(y) * inset;
      if (!insideRounded(x, y, hw, hh, r)) {
        x *= 0.96;
        y *= 0.9;
      }
      put(i, x, y);
    } else if (k < 0.72) {
      // Chip
      const cx = -0.55;
      const cy = 0.18;
      const w = 0.27;
      const h = 0.21;
      if (rnd() < 0.5) {
        put(i, cx + (rnd() * 2 - 1) * w, cy + (rnd() * 2 - 1) * h);
      } else {
        const side = Math.floor(rnd() * 4);
        const t = rnd() * 2 - 1;
        if (side === 0) put(i, cx + t * w, cy + h);
        else if (side === 1) put(i, cx + t * w, cy - h);
        else if (side === 2) put(i, cx - w, cy + t * h);
        else put(i, cx + w, cy + t * h);
      }
    } else if (k < 0.87) {
      // Numeración: 4 grupos
      const g = Math.floor(rnd() * 4);
      const x0 = -0.72 + g * 0.4;
      put(i, x0 + rnd() * 0.3, -0.12 + (rnd() - 0.5) * 0.03);
    } else if (k < 0.94) {
      // Línea de nombre
      put(i, -0.72 + rnd() * 0.75, -0.34 + (rnd() - 0.5) * 0.02);
    } else {
      // Marca: dos aros
      const a = rnd() * Math.PI * 2;
      const c = rnd() < 0.5 ? 0.5 : 0.62;
      put(i, c + Math.cos(a) * 0.14, -0.3 + Math.sin(a) * 0.14);
    }
  }
  return out;
}

/** Red de nodos con hub central (el “cerebro” que orquesta). */
export function networkShape(count: number, rnd: Rng): Float32Array {
  const out = new Float32Array(count * 3);
  const nodes: Array<[number, number, number]> = [[0, 0, 0]];
  const n = 17;
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const R = 0.85 + rnd() * 0.5;
    nodes.push([
      Math.cos(th) * rad * R * 1.1,
      y * R * 1.05,
      Math.sin(th) * rad * R,
    ]);
  }

  const edges = new Set<string>();
  const dist = (a: number, b: number): number => {
    const p = nodes[a];
    const q = nodes[b];
    return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  };
  for (let i = 1; i < nodes.length; i++) {
    if (i % 3 === 1) edges.add(`0-${i}`);
    const order = nodes
      .map((_, j) => j)
      .filter((j) => j !== i && j !== 0)
      .sort((a, b) => dist(i, a) - dist(i, b))
      .slice(0, 2);
    for (const j of order) edges.add(i < j ? `${i}-${j}` : `${j}-${i}`);
  }
  const edgeList = [...edges].map((e) => e.split('-').map(Number) as [number, number]);

  for (let i = 0; i < count; i++) {
    let x: number;
    let y: number;
    let z: number;
    if (rnd() < 0.24) {
      const idx = rnd() < 0.18 ? 0 : 1 + Math.floor(rnd() * n);
      const [nx, ny, nz] = nodes[idx];
      const s = idx === 0 ? 0.11 : 0.055;
      x = nx + (rnd() + rnd() + rnd() - 1.5) * s * 2;
      y = ny + (rnd() + rnd() + rnd() - 1.5) * s * 2;
      z = nz + (rnd() + rnd() + rnd() - 1.5) * s * 2;
    } else {
      const [a, b] = edgeList[Math.floor(rnd() * edgeList.length)];
      const t = rnd();
      const p = nodes[a];
      const q = nodes[b];
      x = p[0] + (q[0] - p[0]) * t + (rnd() - 0.5) * 0.012;
      y = p[1] + (q[1] - p[1]) * t + (rnd() - 0.5) * 0.012;
      z = p[2] + (q[2] - p[2]) * t + (rnd() - 0.5) * 0.012;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y + 0.1;
    out[i * 3 + 2] = z;
  }
  return out;
}

/**
 * Muestrea el logo (pixeles claros sobre fondo oscuro o con alfa) y devuelve
 * pares (x, y) normalizados en [-0.5, 0.5]. Si no se puede cargar, usa una "A"
 * dibujada con tipografía como respaldo.
 */
export async function sampleLogoPoints(url: string, want = 4500): Promise<Float32Array> {
  const size = 320;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Float32Array(0);

  const draw = async (): Promise<boolean> => {
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      await img.decode();
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      return true;
    } catch {
      return false;
    }
  };

  if (!(await draw())) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.font = '700 260px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', size / 2, size / 2 + 8);
  }

  const data = ctx.getImageData(0, 0, size, size).data;
  const px: number[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (data[i + 3] > 128 && lum > 170) px.push(x, y);
    }
  }
  const n = px.length / 2;
  if (n < 50) return new Float32Array(0);

  const out = new Float32Array(Math.min(want, n) * 2);
  const step = n / (out.length / 2);
  for (let k = 0; k < out.length / 2; k++) {
    const j = Math.floor(k * step) * 2;
    out[k * 2] = px[j] / size - 0.5;
    out[k * 2 + 1] = 0.5 - px[j + 1] / size;
  }
  return out;
}

/**
 * Intro de marca: el logo (A con flecha de crecimiento) hecho de puntos, con dos
 * órbitas inclinadas, satélites y polvo de partículas alrededor.
 */
export function brandShape(count: number, rnd: Rng, logo: Float32Array, kinds?: Float32Array): Float32Array {
  const out = new Float32Array(count * 3);
  const nLogo = logo.length / 2;
  const SCALE = 2.5;

  const orbit = (r: number, tiltX: number, tiltZ: number, a: number): [number, number, number] => {
    let x = Math.cos(a) * r;
    let y = 0;
    let z = Math.sin(a) * r;
    const cx = Math.cos(tiltX);
    const sx = Math.sin(tiltX);
    const y1 = y * cx - z * sx;
    const z1 = y * sx + z * cx;
    y = y1;
    z = z1;
    const cz = Math.cos(tiltZ);
    const sz = Math.sin(tiltZ);
    const x2 = x * cz - y * sz;
    const y2 = x * sz + y * cz;
    return [x2, y2, z];
  };

  for (let i = 0; i < count; i++) {
    const k = rnd();
    let x: number;
    let y: number;
    let z: number;
    let kind = 0;

    if (k < 0.78 && nLogo > 0) {
      const j = Math.floor(rnd() * nLogo);
      x = logo[j * 2] * SCALE + (rnd() - 0.5) * 0.012;
      y = logo[j * 2 + 1] * SCALE + (rnd() - 0.5) * 0.012;
      z = (Math.floor(rnd() * 3) - 1) * 0.07 + (rnd() - 0.5) * 0.02;
    } else if (k < 0.88) {
      kind = 1;
      [x, y, z] = orbit(1.55, 1.15, 0.35, rnd() * Math.PI * 2);
    } else if (k < 0.94) {
      kind = 2;
      [x, y, z] = orbit(1.18, -0.9, -0.5, rnd() * Math.PI * 2);
    } else if (k < 0.97) {
      // Satélites sobre las órbitas
      const sat = Math.floor(rnd() * 5);
      const a = (sat / 5) * Math.PI * 2 + 0.4;
      kind = sat % 2 ? 1 : 2;
      const [ox, oy, oz] = orbit(sat % 2 ? 1.55 : 1.18, sat % 2 ? 1.15 : -0.9, sat % 2 ? 0.35 : -0.5, a);
      x = ox + (rnd() - 0.5) * 0.09;
      y = oy + (rnd() - 0.5) * 0.09;
      z = oz + (rnd() - 0.5) * 0.09;
    } else {
      // Polvo
      const u = rnd() * 2 - 1;
      const phi = rnd() * Math.PI * 2;
      const r = 1.2 + rnd() * 0.9;
      const s2 = Math.sqrt(1 - u * u);
      x = Math.cos(phi) * s2 * r;
      y = u * r;
      z = Math.sin(phi) * s2 * r;
    }

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
    if (kinds) kinds[i] = kind;
  }
  return out;
}

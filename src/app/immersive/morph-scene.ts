import type * as ThreeNS from 'three';
import { brandShape, cardShape, mulberry32, networkShape, sampleLogoPoints, terminalShape } from './shapes';

export interface MorphSceneOptions {
  /** Cantidad de partículas. */
  count: number;
  /** false → no hay bucle; se dibuja a demanda (prefers-reduced-motion). */
  animate: boolean;
  /** Paralaje con el puntero. */
  parallax: boolean;
}

const VERTEX = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uScan;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute vec3 positionB;
  attribute vec3 positionC;
  attribute vec3 positionD;
  attribute vec3 aRand;
  attribute float aSize;
  varying float vGlow;
  varying float vDepth;

  void main() {
    float m1 = clamp(uMorph, 0.0, 1.0);
    float m2 = clamp(uMorph - 1.0, 0.0, 1.0);
    float m3 = clamp(uMorph - 2.0, 0.0, 1.0);
    float e1 = m1 * m1 * (3.0 - 2.0 * m1);
    float e2 = m2 * m2 * (3.0 - 2.0 * m2);
    float e3 = m3 * m3 * (3.0 - 2.0 * m3);

    vec3 p = mix(position, positionB, e1);
    p = mix(p, positionC, e2);
    p = mix(p, positionD, e3);

    float turb = sin(3.14159 * e1) + sin(3.14159 * e2) + sin(3.14159 * e3);
    p += (aRand - 0.5) * 1.8 * turb;
    p += (aRand - 0.5) * 0.014 * sin(uTime * 1.3 + aRand.x * 30.0);

    float d = abs(p.y - uScan);
    vGlow = smoothstep(0.1, 0.0, d);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = aSize * (1.0 + vGlow * 1.8) * uSize;
    gl_PointSize = size * uPixelRatio * (1.0 / -mv.z);
    vDepth = clamp(1.25 - (-mv.z - 3.0) * 0.25, 0.25, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vGlow;
  varying float vDepth;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.1, r);
    vec3 col = mix(vec3(0.80, 0.83, 0.88), uColor, vGlow);
    gl_FragColor = vec4(col, a * (0.4 + 0.6 * vDepth) * (0.68 + vGlow));
  }
`;

/**
 * Nube de partículas que se transforma entre cuatro formas (marca → terminal → tarjeta → red).
 * Un solo draw call; el morph y el barrido de escaneo se resuelven en el vertex shader.
 */
export class MorphScene {
  private readonly renderer: ThreeNS.WebGLRenderer;
  private readonly scene: ThreeNS.Scene;
  private readonly camera: ThreeNS.PerspectiveCamera;
  private readonly group: ThreeNS.Group;
  private readonly geometry: ThreeNS.BufferGeometry;
  private readonly material: ThreeNS.ShaderMaterial;

  private raf = 0;
  private visible = true;
  private disposed = false;
  private morph = 0;
  private spin = 0;
  private userYaw = 0;
  private yawVel = 0;
  private dragging = false;
  private lastTouch = 0;
  private lastFrame = 0;
  private readonly pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  private readonly cleanups: Array<() => void> = [];

  static async create(
    canvas: HTMLCanvasElement,
    opts: MorphSceneOptions,
  ): Promise<MorphScene | null> {
    const THREE = await import('three');
    const logo = await sampleLogoPoints('/assets/LogoConFondo.webp').catch(() => new Float32Array(0));
    let renderer: ThreeNS.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return null;
    }
    return new MorphScene(THREE, renderer, canvas, opts, logo);
  }

  private constructor(
    private readonly THREE: typeof ThreeNS,
    renderer: ThreeNS.WebGLRenderer,
    private readonly canvas: HTMLCanvasElement,
    private readonly opts: MorphSceneOptions,
    logo: Float32Array,
  ) {
    this.renderer = renderer;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    this.camera.position.set(0, 0, 5);
    this.group = new THREE.Group();
    this.scene.add(this.group);

    const rnd = mulberry32(20260610);
    const n = opts.count;
    const a = brandShape(n, rnd, logo);
    const b = terminalShape(n, rnd);
    const c = cardShape(n, rnd);
    const d = networkShape(n, rnd);
    const rand = new Float32Array(n * 3);
    const size = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      rand[i * 3] = rnd();
      rand[i * 3 + 1] = rnd();
      rand[i * 3 + 2] = rnd();
      size[i] = 0.7 + rnd() * 1.5;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(a, 3));
    this.geometry.setAttribute('positionB', new THREE.BufferAttribute(b, 3));
    this.geometry.setAttribute('positionC', new THREE.BufferAttribute(c, 3));
    this.geometry.setAttribute('positionD', new THREE.BufferAttribute(d, 3));
    this.geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uScan: { value: -2 },
        uPixelRatio: { value: 1 },
        uSize: { value: 6.5 },
        uColor: { value: new THREE.Color('#6ee7b7') },
      },
    });

    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);

    this.bind();
    this.layout();
    if (opts.animate) this.loop(performance.now());
    else this.renderOnce();
  }

  /**
   * Fija el estado de la escena de forma continua.
   * @param morph 0 = marca, 1 = terminal, 2 = tarjeta, 3 = red (valores intermedios interpolan)
   * @param spin  giro base en radianes
   */
  setProgress(morph: number, spin: number): void {
    if (this.disposed) return;
    this.morph = morph;
    this.spin = spin;
    if (!this.opts.animate) this.renderOnce();
  }

  /** Inicia una interacción manual (arrastre). */
  beginDrag(): void {
    this.dragging = true;
    this.yawVel = 0;
    this.lastTouch = performance.now();
  }

  /** Aplica un giro manual en radianes (arrastre o gesto horizontal del trackpad). */
  rotateBy(dYaw: number): void {
    if (this.disposed) return;
    this.userYaw += dYaw;
    this.yawVel = dYaw;
    this.lastTouch = performance.now();
    if (!this.opts.animate) this.renderOnce();
  }

  endDrag(): void {
    this.dragging = false;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.cleanups.forEach((fn) => fn());
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }

  private bind(): void {
    const parent = this.canvas.parentElement ?? this.canvas;
    const ro = new ResizeObserver(() => this.layout());
    ro.observe(parent);
    this.cleanups.push(() => ro.disconnect());

    const io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible && this.opts.animate) {
        cancelAnimationFrame(this.raf);
        this.loop(performance.now());
      }
    });
    io.observe(this.canvas);
    this.cleanups.push(() => io.disconnect());

    const onVis = (): void => {
      if (!document.hidden && this.opts.animate && this.visible) {
        cancelAnimationFrame(this.raf);
        this.loop(performance.now());
      }
    };
    document.addEventListener('visibilitychange', onVis);
    this.cleanups.push(() => document.removeEventListener('visibilitychange', onVis));

    if (this.opts.parallax) {
      const onMove = (e: PointerEvent): void => {
        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      this.cleanups.push(() => window.removeEventListener('pointermove', onMove));
    }
  }

  private layout(): void {
    const parent = this.canvas.parentElement ?? this.canvas;
    const w = Math.max(1, parent.clientWidth);
    const h = Math.max(1, parent.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.material.uniforms['uPixelRatio'].value = this.renderer.getPixelRatio();

    if (w > 900) {
      this.group.position.set(1.0, -0.05, 0);
      this.group.scale.setScalar(0.88);
    } else {
      // Retrato: el objeto debe caber en el ancho visible a la distancia de cámara.
      const visibleW = 2 * 5 * Math.tan((40 / 2) * (Math.PI / 180)) * this.camera.aspect;
      this.group.position.set(0, 0.8, 0);
      this.group.scale.setScalar(Math.min(0.9, visibleW / 2.9));
    }
    if (!this.opts.animate) this.renderOnce();
  }

  private frame(now: number): void {
    const u = this.material.uniforms;
    const t = now / 1000;

    this.pointer.cx += (this.pointer.x - this.pointer.cx) * 0.05;
    this.pointer.cy += (this.pointer.y - this.pointer.cy) * 0.05;

    u['uMorph'].value = this.morph;
    u['uTime'].value = t;
    u['uScan'].value = ((t % 6) / 6) * 3.4 - 1.7;
    const dt = Math.min(0.05, Math.max(0, (now - (this.lastFrame || now)) / 1000));
    this.lastFrame = now;
    if (!this.dragging) {
      this.userYaw += this.yawVel;
      this.yawVel *= 0.94;
      // Tras un momento sin tocar, vuelve al estado base por el camino más corto.
      if (now - this.lastTouch > 2200) {
        this.yawVel = 0;
        this.userYaw *= Math.exp(-dt * 1.7);
      }
    }
    // Girar 2π es visualmente idéntico: se normaliza a (-π, π] para no acumular vueltas.
    this.userYaw -= Math.PI * 2 * Math.round(this.userYaw / (Math.PI * 2));
    this.group.rotation.y = this.spin + this.userYaw + Math.sin(t * 0.3) * 0.22 + this.pointer.cx * 0.3;
    this.group.rotation.x = this.pointer.cy * 0.12;
    this.renderer.render(this.scene, this.camera);
  }

  private renderOnce(): void {
    const u = this.material.uniforms;
    u['uMorph'].value = this.morph;
    u['uScan'].value = -2;
    this.group.rotation.set(0, this.spin + this.userYaw + 0.25, 0);
    this.renderer.render(this.scene, this.camera);
  }

  private loop = (now: number): void => {
    if (this.disposed || !this.visible || document.hidden) return;
    this.frame(now);
    this.raf = requestAnimationFrame(this.loop);
  };
}

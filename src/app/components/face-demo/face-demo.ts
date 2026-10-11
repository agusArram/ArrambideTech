import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { RevealDirective } from '../../shared/reveal.directive';
import type { FaceLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

type DemoState = 'idle' | 'loading' | 'scanning' | 'ready' | 'error';
type Decision = 'granted' | 'denied_debt' | 'manual_override';

interface Profile {
  id: string;
  label: string;
  unit: string;
  decision: Decision;
  reason: string;
}

interface Stage {
  id: number;
  label: string;
  detail: string;
}

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
const WASM_BASE = '/mediapipe';
const STABLE_FRAMES = 28;
/** Puntos clave para la firma geométrica de ejemplo. */
const KEY_POINTS = [33, 263, 1, 61, 291, 199, 10, 152, 234, 454, 168, 6];

const hex = (bytes: Uint8Array, n: number): string =>
  Array.from(bytes.slice(0, n))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

@Component({
  selector: 'app-face-demo',
  standalone: true,
  imports: [DecimalPipe, RevealDirective],
  templateUrl: './face-demo.html',
  styleUrl: './face-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaceDemoComponent implements OnDestroy {
  @ViewChild('video', { static: true }) private videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay', { static: true }) private overlayRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly state = signal<DemoState>('idle');
  protected readonly errorMsg = signal('');
  protected readonly stageDone = signal(0);
  protected readonly hint = signal('');
  protected readonly signature = signal('');
  protected readonly cipher = signal<{ iv: string; bytes: number; head: string; plain: number } | null>(null);
  protected readonly pipelineMs = signal(0);
  protected readonly result = signal<{ profile: Profile; at: string } | null>(null);
  protected readonly landmarkCount = signal(0);
  protected readonly cameraOn = computed(() => this.state() === 'scanning' || this.state() === 'ready');

  protected readonly stages: Stage[] = [
    { id: 1, label: 'Ve a la persona', detail: 'La cámara de tu equipo' },
    { id: 2, label: 'Reconoce el rostro', detail: 'Mapa de 478 puntos' },
    { id: 3, label: 'Crea una huella única', detail: 'Un código que identifica el rostro' },
    { id: 4, label: 'La guarda protegida', detail: 'Cifrado de nivel bancario (AES-256)' },
    { id: 5, label: 'Decide si pasa', detail: 'Según las reglas de cada persona' },
  ];

  protected readonly profiles: Profile[] = [
    {
      id: 'owner',
      label: 'Cliente al día',
      unit: 'Unidad 14',
      decision: 'granted',
      reason: 'Cuenta al día y horario habilitado',
    },
    {
      id: 'debt',
      label: 'Cliente con deuda',
      unit: 'Unidad 27',
      decision: 'denied_debt',
      reason: 'Tiene saldo vencido',
    },
    {
      id: 'staff',
      label: 'Personal fuera de horario',
      unit: 'Personal',
      decision: 'manual_override',
      reason: 'Fuera de horario: requiere autorización',
    },
  ];

  private stream: MediaStream | null = null;
  private landmarker: FaceLandmarker | null = null;
  private vision: typeof import('@mediapipe/tasks-vision') | null = null;
  private raf = 0;
  private lastTime = -1;
  private stable = 0;
  private capturing = false;
  private captured = false;

  async start(): Promise<void> {
    if (!this.isBrowser || this.state() === 'loading') return;
    this.errorMsg.set('');
    this.state.set('loading');
    this.stageDone.set(0);
    this.result.set(null);
    this.cipher.set(null);
    this.signature.set('');
    this.captured = false;
    this.capturing = false;
    this.stable = 0;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Este navegador o contexto no permite acceder a la cámara.');
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } },
        audio: false,
      });
      const video = this.videoRef.nativeElement;
      video.srcObject = this.stream;
      await video.play();

      this.vision = await import('@mediapipe/tasks-vision');
      const fileset = await this.vision.FilesetResolver.forVisionTasks(WASM_BASE);
      const make = (delegate: 'GPU' | 'CPU'): Promise<FaceLandmarker> =>
        this.vision!.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate },
          runningMode: 'VIDEO',
          numFaces: 1,
        });
      try {
        this.landmarker = await make('GPU');
      } catch {
        this.landmarker = await make('CPU');
      }

      this.state.set('scanning');
      this.stageDone.set(1);
      this.hint.set('Mirá a la cámara y centrá tu rostro');
      this.zone.runOutsideAngular(() => (this.raf = requestAnimationFrame(this.loop)));
    } catch (e) {
      this.teardown();
      const err = e as { name?: string; message?: string };
      this.errorMsg.set(
        err.name === 'NotAllowedError'
          ? 'Permiso de cámara denegado. Podés volver a intentarlo cuando quieras; no se guarda nada.'
          : err.name === 'NotFoundError'
            ? 'No se encontró una cámara en este dispositivo.'
            : (err.message ?? 'No se pudo iniciar la demostración.'),
      );
      this.state.set('error');
    }
  }

  stop(): void {
    this.teardown();
    this.state.set('idle');
    this.stageDone.set(0);
    this.result.set(null);
  }

  retry(): void {
    this.captured = false;
    this.capturing = false;
    this.stable = 0;
    this.stageDone.set(1);
    this.result.set(null);
    this.cipher.set(null);
    this.signature.set('');
    this.state.set('scanning');
    this.hint.set('Mirá a la cámara y centrá tu rostro');
  }

  decide(profile: Profile): void {
    if (this.state() !== 'ready') return;
    const now = new Date();
    this.result.set({ profile, at: now.toLocaleTimeString('es-AR', { hour12: false }) });
    this.stageDone.set(5);
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  private teardown(): void {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    const video = this.videoRef?.nativeElement;
    if (video) video.srcObject = null;
    this.landmarker?.close();
    this.landmarker = null;
    const c = this.overlayRef?.nativeElement;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
  }

  private loop = (): void => {
    const video = this.videoRef.nativeElement;
    const canvas = this.overlayRef.nativeElement;
    const lm = this.landmarker;
    if (!lm || !this.vision) return;

    if (video.videoWidth && video.currentTime !== this.lastTime) {
      this.lastTime = video.currentTime;
      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const res = lm.detectForVideo(video, performance.now());
        const face = res.faceLandmarks[0];
        if (face) {
          const du = new this.vision.DrawingUtils(ctx);
          du.drawConnectors(face, this.vision.FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
            color: 'rgba(110,231,183,0.38)',
            lineWidth: 0.6,
          });
          du.drawConnectors(face, this.vision.FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, {
            color: 'rgba(110,231,183,0.9)',
            lineWidth: 1.4,
          });
          this.evaluate(face, video);
        } else {
          this.stable = 0;
          this.setHint('No veo un rostro. Mirá a la cámara.');
        }
      }
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private evaluate(face: NormalizedLandmark[], video: HTMLVideoElement): void {
    if (this.captured || this.capturing) return;

    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    for (const p of face) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const w = maxX - minX;
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    if (w < 0.24) return this.reject('Acercate un poco');
    if (w > 0.8) return this.reject('Alejate un poco');
    if (Math.abs(cx - 0.5) > 0.18 || Math.abs(cy - 0.5) > 0.22) return this.reject('Centrá tu rostro');

    this.setHint('Mantené la posición…');
    if (++this.stable >= STABLE_FRAMES) {
      this.capturing = true;
      void this.capture(face, video);
    }
  }

  private reject(msg: string): void {
    this.stable = 0;
    this.setHint(msg);
  }

  private setHint(msg: string): void {
    if (this.hint() !== msg) this.zone.run(() => this.hint.set(msg));
  }

  private async capture(face: NormalizedLandmark[], video: HTMLVideoElement): Promise<void> {
    const t0 = performance.now();
    try {
      this.zone.run(() => {
        this.landmarkCount.set(face.length);
        this.stageDone.set(2);
        this.hint.set('Creando la huella…');
      });

      const sig = await this.signatureOf(face);
      this.zone.run(() => {
        this.signature.set(sig);
        this.stageDone.set(3);
        this.hint.set('Protegiendo la imagen…');
      });

      const jpeg = await this.snapshot(video);
      const enc = await this.encrypt(jpeg);
      const ms = Math.round(performance.now() - t0);

      this.captured = true;
      this.zone.run(() => {
        this.cipher.set(enc);
        this.pipelineMs.set(ms);
        this.stageDone.set(4);
        this.state.set('ready');
        this.hint.set('Elegí un caso de ejemplo para ver la decisión');
      });
    } catch {
      this.capturing = false;
      this.stable = 0;
      this.zone.run(() => this.hint.set('No se pudo completar la captura. Reintentando…'));
    }
  }

  private async signatureOf(face: NormalizedLandmark[]): Promise<string> {
    const d = (a: number, b: number): number =>
      Math.hypot(face[a].x - face[b].x, face[a].y - face[b].y, (face[a].z - face[b].z) * 0.5);
    const iod = d(33, 263) || 1;
    const parts: string[] = [];
    for (let i = 0; i < KEY_POINTS.length; i++) {
      for (let j = i + 1; j < KEY_POINTS.length; j++) {
        parts.push((d(KEY_POINTS[i], KEY_POINTS[j]) / iod).toFixed(2));
      }
    }
    const data = new TextEncoder().encode(parts.join('|'));
    if (crypto?.subtle) {
      const h = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
      return hex(h, 6);
    }
    let a = 2166136261;
    for (const b of data) a = Math.imul(a ^ b, 16777619) >>> 0;
    return a.toString(16).padStart(8, '0');
  }

  /** Recorte centrado 640×640 (el mismo criterio que el enrolamiento real). */
  private snapshot(video: HTMLVideoElement): Promise<ArrayBuffer> {
    const size = Math.min(video.videoWidth, video.videoHeight);
    const c = document.createElement('canvas');
    c.width = 640;
    c.height = 640;
    const ctx = c.getContext('2d');
    if (!ctx) return Promise.reject(new Error('canvas'));
    ctx.drawImage(
      video,
      (video.videoWidth - size) / 2,
      (video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      640,
      640,
    );
    return new Promise((resolve, reject) =>
      c.toBlob(
        (blob) => (blob ? blob.arrayBuffer().then(resolve, reject) : reject(new Error('blob'))),
        'image/jpeg',
        0.85,
      ),
    );
  }

  private async encrypt(
    plain: ArrayBuffer,
  ): Promise<{ iv: string; bytes: number; head: string; plain: number }> {
    if (!crypto?.subtle) throw new Error('webcrypto');
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
    return { iv: hex(iv, 12), bytes: ct.byteLength, head: hex(ct, 12), plain: plain.byteLength };
  }
}

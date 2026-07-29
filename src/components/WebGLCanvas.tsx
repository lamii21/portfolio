"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient WebGL noise shader canvas.
 *
 * Fragment shader: 3-level FBM (Fractal Brownian Motion) over value noise.
 * Outputs a very subtle warm-rose animated noise field that breathes slowly.
 * Mouse position shifts the noise pattern for a live, reactive feel.
 *
 * Performance budget:
 *   - Half-resolution rendering (0.5× devicePixelRatio)
 *   - 30fps cap via timestamp comparison
 *   - Single TRIANGLES draw call (full-screen triangle trick)
 *   - Skip entirely on touch devices
 *
 * z-index: 9986 (below grain at 9998, below mouse light at 9985... wait)
 * Actually z-index 9983 — below mouse spotlight (9985) and grain (9998).
 * mix-blend-mode: overlay at 0.07 opacity adds warmth without obscuring text.
 */

const VERT = /* glsl */`
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = /* glsl */`
precision mediump float;

uniform float  u_time;
uniform vec2   u_res;
uniform vec2   u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p  = p * 2.05 + vec2(3.7, 1.9);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv    = gl_FragCoord.xy / u_res;
  vec2 mouse = u_mouse / u_res;
  float t    = u_time * 0.05;

  vec2 p = uv * 1.6 + vec2(t * 0.4, t * 0.25);
  p += (mouse - 0.5) * 0.10;

  float n = fbm(p + fbm(p + vec2(t * 0.15)));

  /* Warm rose: #B76E79 → 0.718, 0.431, 0.475 */
  vec3 col = vec3(0.718, 0.431, 0.475) * n * 0.07;
  gl_FragColor = vec4(col, n * 0.035);
}
`;

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function mkProgram(gl: WebGLRenderingContext) {
  const p = gl.createProgram()!;
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER,   VERT));
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  return p;
}

export function WebGLCanvas() {
  const ref       = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only on desktop pointer devices — skip mobile entirely
    setShow(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!show) return;
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    const prog = mkProgram(gl);
    gl.useProgram(prog);

    // Full-screen triangle (3 vertices, no index buffer needed)
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const SCALE = 0.45; // render at 45% res → huge GPU savings
    const resize = () => {
      canvas.width  = Math.round(window.innerWidth  * SCALE);
      canvas.height = Math.round(window.innerHeight * SCALE);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let raf = 0;
    let last = 0;
    const FPS_CAP = 1000 / 28; // ≈28fps cap

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (now - last < FPS_CAP) return;
      last = now;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime,  now * 0.001);
      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x * SCALE, mouse.y * SCALE);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [show]);

  if (!show) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="webgl-ambient"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9983,
        // CSS upscale from 45% render size — intentionally soft
        imageRendering: "auto",
      }}
    />
  );
}

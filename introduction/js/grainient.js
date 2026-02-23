// ============================================================
// Grainient - Animated gradient background
// Pure Vanilla WebGL2 — no React, no ogl, no dependencies.
// Sits at z-index:-1 as the actual page background.
// Colors swap automatically on light/dark theme change.
// ============================================================

(function () {

  // ── Theme color palettes ─────────────────────────────────
  // Light mode: soft lavender-to-purple that matches #f5f0ff
  const LIGHT = {
    color1: '#d4b8f0',  // soft lilac
    color2: '#9D65C9',  // accent purple (matches CSS --accent-color)
    color3: '#efe8fb',  // near-white lavender (matches --bg-color feel)
    contrast:   1.1,
    saturation: 0.85,
    grainAmount: 0.06
  };

  // Dark mode: deep dark purple that matches #0a0a0a
  const DARK = {
    color1: '#3b1a6e',  // deep purple
    color2: '#1a0535',  // near-black purple
    color3: '#080010',  // almost black with purple tint
    contrast:   1.4,
    saturation: 1.2,
    grainAmount: 0.08
  };

  // ── WebGL2 setup ─────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed',
    'top:0', 'left:0',
    'width:100vw', 'height:100vh',
    'pointer-events:none',
    'z-index:-1'
  ].join(';');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
  if (!gl) {
    console.warn('Grainient: WebGL2 not supported.');
    canvas.remove();
    return;
  }

  // ── Shaders ──────────────────────────────────────────────
  const vertSrc = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const fragSrc = `#version 300 es
precision highp float;
uniform vec2  iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2  uCenterOffset;
uniform float uZoom;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
out vec4 fragColor;

#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i+vec2(0,0)),f-vec2(0,0)),dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),
    u.y);
  return 0.5+0.5*n;
}

void main(){
  float t = iTime * uTimeSpeed;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  vec2 tuv = uv - 0.5 + uCenterOffset;
  tuv /= max(uZoom, 0.001);

  float degree = noise(vec2(t*0.1, tuv.x*tuv.y) * uNoiseScale);
  tuv.y *= 1.0/ratio;
  tuv *= Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y *= ratio;

  float ws = max(uWarpStrength, 0.001);
  float amplitude = uWarpAmplitude / ws;
  float warpTime = t * uWarpSpeed;
  tuv.x += sin(tuv.y * uWarpFrequency + warpTime) / amplitude;
  tuv.y += sin(tuv.x * (uWarpFrequency*1.5) + warpTime) / (amplitude*0.5);

  float b = uColorBalance;
  float s = max(uBlendSoftness, 0.0);
  mat2 blendRot = Rot(radians(uBlendAngle));
  float blendX = (tuv * blendRot).x;
  float edge0 = -0.3-b-s;
  float edge1 =  0.2-b+s;
  float v0    =  0.5-b+s;
  float v1    = -0.3-b-s;
  vec3 layer1 = mix(uColor3, uColor2, S(edge0,edge1,blendX));
  vec3 layer2 = mix(uColor2, uColor1, S(edge0,edge1,blendX));
  vec3 col    = mix(layer1, layer2, S(v0,v1,tuv.y));

  vec2 grainUv = uv * max(uGrainScale, 0.001);
  float grain  = fract(sin(dot(grainUv, vec2(12.9898,78.233))) * 43758.5453);
  col += (grain - 0.5) * uGrainAmount;

  col = (col - 0.5) * uContrast + 0.5;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, uSaturation);
  col = pow(max(col, 0.0), vec3(1.0/max(uGamma, 0.001)));
  col = clamp(col, 0.0, 1.0);

  fragColor = vec4(col, 1.0);
}`;

  // ── Compile shaders ──────────────────────────────────────
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Grainient shader error:', gl.getShaderInfoLog(s));
    }
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // ── Full-screen triangle ─────────────────────────────────
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(prog, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  // ── Uniform helpers ──────────────────────────────────────
  function u1f(name, v) { gl.uniform1f(gl.getUniformLocation(prog, name), v); }
  function u2f(name, x, y) { gl.uniform2f(gl.getUniformLocation(prog, name), x, y); }
  function u3f(name, r, g, b) { gl.uniform3f(gl.getUniformLocation(prog, name), r, g, b); }
  const iTimeLoc = gl.getUniformLocation(prog, 'iTime');

  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!r) return [1,1,1];
    return [parseInt(r[1],16)/255, parseInt(r[2],16)/255, parseInt(r[3],16)/255];
  }

  // ── Apply palette ────────────────────────────────────────
  function applyPalette(p) {
    const c1 = hexToRgb(p.color1);
    const c2 = hexToRgb(p.color2);
    const c3 = hexToRgb(p.color3);
    u3f('uColor1', c1[0], c1[1], c1[2]);
    u3f('uColor2', c2[0], c2[1], c2[2]);
    u3f('uColor3', c3[0], c3[1], c3[2]);
    u1f('uContrast',   p.contrast);
    u1f('uSaturation', p.saturation);
    u1f('uGrainAmount', p.grainAmount);
  }

  // ── Static uniforms (shared both themes) ─────────────────
  u1f('uTimeSpeed',      0.25);
  u1f('uColorBalance',   0.0);
  u1f('uWarpStrength',   1.0);
  u1f('uWarpFrequency',  5.0);
  u1f('uWarpSpeed',      2.0);
  u1f('uWarpAmplitude',  50.0);
  u1f('uBlendAngle',     0.0);
  u1f('uBlendSoftness',  0.05);
  u1f('uRotationAmount', 500.0);
  u1f('uNoiseScale',     2.0);
  u1f('uGrainScale',     2.0);
  u1f('uGamma',          1.0);
  u2f('uCenterOffset',   0.0, 0.0);
  u1f('uZoom',           0.9);

  // ── Theme sync ───────────────────────────────────────────
  function syncTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    gl.useProgram(prog);
    applyPalette(isDark ? DARK : LIGHT);
  }
  syncTheme();
  new MutationObserver(syncTheme).observe(
    document.documentElement,
    { attributes: true, attributeFilter: ['data-theme'] }
  );

  // ── Resize ───────────────────────────────────────────────
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(window.innerWidth  * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.width  = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.useProgram(prog);
    u2f('iResolution', w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Render loop ──────────────────────────────────────────
  const t0 = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    gl.useProgram(prog);
    gl.uniform1f(iTimeLoc, (now - t0) * 0.001);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  })(performance.now());

})();

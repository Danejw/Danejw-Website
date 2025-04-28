"use client";
import { useEffect, useRef } from "react";

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: number[];
}

// Re-introducing FBO interfaces
interface FBO {
  texture: WebGLTexture | null;
  fbo: WebGLFramebuffer | null;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

function SplashCursor({
  // Add whatever props you like for customization
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT,
    };

    const pointers: Pointer[] = [{
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: [0, 0, 0],
    }];

    const { gl, ext } = getWebGLContext(canvas);
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };
      let gl = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2)
        gl =
          canvas.getContext("webgl", params) ||
          canvas.getContext("experimental-webgl", params);

      if (!gl) {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
      }

      let halfFloat;
      let supportLinearFiltering;
      if (isWebGL2) {
        halfFloat = (gl as WebGL2RenderingContext).getExtension("OES_texture_half_float");
        supportLinearFiltering = (gl as WebGL2RenderingContext).getExtension("OES_texture_float_linear");
      } else {
        halfFloat = (gl as WebGLRenderingContext).getExtension("OES_texture_half_float");
        supportLinearFiltering = (gl as WebGLRenderingContext).getExtension(
          "OES_texture_half_float_linear"
        );
      }
      (gl as WebGLRenderingContext | WebGL2RenderingContext).clearColor(0.0, 0.0, 0.0, 1.0);
      const halfFloatTexType = isWebGL2
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : halfFloat && halfFloat.HALF_FLOAT_OES;
      let formatRGBA: { internalFormat: number; format: number; } | null;
      let formatRG: { internalFormat: number; format: number; } | null;
      let formatR: { internalFormat: number; format: number; } | null;

      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      // Provide a fallback type if halfFloatTexType is undefined, ensure it's number
      const texType = halfFloatTexType ?? glAsserted.UNSIGNED_BYTE;

      if (isWebGL2) {
        const gl2 = gl as WebGL2RenderingContext; // Assert specifically to WebGL2
        formatRGBA = getSupportedFormat(
          gl2,
          gl2.RGBA16F, // Use gl2
          gl2.RGBA,    // Use gl2
          texType      // Use defined texType
        );
        formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, texType); // Use gl2 and texType
        formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, texType); // Use gl2 and texType
      } else {
        // WebGL1 context uses RGBA for RG and R formats in this code
        const gl1 = gl as WebGLRenderingContext; // Assert specifically to WebGL1
        formatRGBA = getSupportedFormat(gl1, gl1.RGBA, gl1.RGBA, texType); // Use gl1 and texType
        formatRG = getSupportedFormat(gl1, gl1.RGBA, gl1.RGBA, texType); // Use gl1 and texType
        formatR = getSupportedFormat(gl1, gl1.RGBA, gl1.RGBA, texType); // Use gl1 and texType
      }

      return {
        gl: gl as WebGLRenderingContext | WebGL2RenderingContext,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(gl: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case (gl as WebGL2RenderingContext).R16F:
            return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RG16F, (gl as WebGL2RenderingContext).RG, type);
          case (gl as WebGL2RenderingContext).RG16F:
            return getSupportedFormat(gl, (gl as WebGL2RenderingContext).RGBA16F, gl.RGBA, type);
          default:
            return null;
        }
      }
      return {
        internalFormat,
        format,
      };
    }

    function supportRenderTextureFormat(gl: WebGLRenderingContext | WebGL2RenderingContext, internalFormat: number, format: number, type: number) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: { [key: string]: WebGLProgram };
      activeProgram: WebGLProgram | null;
      uniforms: { [key: string]: WebGLUniformLocation | null };

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program: WebGLProgram | undefined | null = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(
            (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
            this.fragmentShaderSource,
            keywords
          );
          program = createProgram(this.vertexShader, fragmentShader as WebGLShader);
          if (!program) {
            console.error("Failed to create program");
            return; 
          }
          this.programs[hash] = program; // Assign the non-null program here
        }
        if (program === this.activeProgram) return;
        // program is guaranteed non-null here due to the check above
        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() {
        (gl as WebGLRenderingContext | WebGL2RenderingContext).useProgram(this.activeProgram);
      }
    }

    class Program {
      uniforms: { [key: string]: WebGLUniformLocation | null };
      program: WebGLProgram | null;
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = {};
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program as WebGLProgram);
      }
      bind() {
        (gl as WebGLRenderingContext | WebGL2RenderingContext).useProgram(this.program);
      }
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
      const program = (gl as WebGLRenderingContext | WebGL2RenderingContext).createProgram();
      (gl as WebGLRenderingContext | WebGL2RenderingContext).attachShader(program, vertexShader);
      (gl as WebGLRenderingContext | WebGL2RenderingContext).attachShader(program, fragmentShader);
      (gl as WebGLRenderingContext | WebGL2RenderingContext).linkProgram(program);
      if (!(gl as WebGLRenderingContext | WebGL2RenderingContext).getProgramParameter(program, (gl as WebGLRenderingContext | WebGL2RenderingContext).LINK_STATUS))
        console.trace((gl as WebGLRenderingContext | WebGL2RenderingContext).getProgramInfoLog(program));
      return program;
    }

    function getUniforms(program: WebGLProgram): { [key: string]: WebGLUniformLocation | null } {
      const uniforms: { [key: string]: WebGLUniformLocation | null } = {};
      const uniformCount = (gl as WebGLRenderingContext | WebGL2RenderingContext).getProgramParameter(program, (gl as WebGLRenderingContext | WebGL2RenderingContext).ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformName = (gl as WebGLRenderingContext | WebGL2RenderingContext).getActiveUniform(program, i)?.name;
        if (uniformName) {
          uniforms[uniformName] = (gl as WebGLRenderingContext | WebGL2RenderingContext).getUniformLocation(program, uniformName);
        }
      }
      return uniforms;
    }

    function compileShader(type: number, source: string, keywords: string[]) {
      source = addKeywords(source, keywords);
      const shader = (gl as WebGLRenderingContext | WebGL2RenderingContext).createShader(type);
      (gl as WebGLRenderingContext | WebGL2RenderingContext).shaderSource(shader as WebGLShader, source);
      (gl as WebGLRenderingContext | WebGL2RenderingContext).compileShader(shader as WebGLShader);
      if (!(gl as WebGLRenderingContext | WebGL2RenderingContext).getShaderParameter(shader as WebGLShader, (gl as WebGLRenderingContext | WebGL2RenderingContext).COMPILE_STATUS))
        console.trace((gl as WebGLRenderingContext | WebGL2RenderingContext).getShaderInfoLog(shader as WebGLShader));
      return shader;
    }

    function addKeywords(source: string, keywords: string[]) {
      if (!keywords) return source;
      let keywordsString = "";
      keywords.forEach((keyword) => {
        keywordsString += "#define " + keyword + "\n";
      });
      return keywordsString + source;
    }

    const baseVertexShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `,
      [] 
    );

    const copyShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `,
      [] 
    );

    const clearShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
     `,
      [] 
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a * 0.5);
      }
    `;

    const splatShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `,
      [] 
    );

    const advectionShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? [] : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
      [] 
    );

    const curlShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `,
      [] 
    );

    const vorticityShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
      [] 
    );

    const pressureShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
      [] 
    );

    const gradientSubtractShader = compileShader(
      (gl as WebGLRenderingContext | WebGL2RenderingContext).FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
      [] 
    );

    const blit = (() => {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      glAsserted.bindBuffer(glAsserted.ARRAY_BUFFER, glAsserted.createBuffer());
      glAsserted.bufferData(
        glAsserted.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        glAsserted.STATIC_DRAW
      );
      glAsserted.bindBuffer(glAsserted.ELEMENT_ARRAY_BUFFER, glAsserted.createBuffer());
      glAsserted.bufferData(
        glAsserted.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        glAsserted.STATIC_DRAW
      );
      glAsserted.vertexAttribPointer(0, 2, glAsserted.FLOAT, false, 0, 0);
      glAsserted.enableVertexAttribArray(0);
      return (target: FBO | null, clear = false) => {
        if (target == null) {
          glAsserted.viewport(0, 0, glAsserted.drawingBufferWidth, glAsserted.drawingBufferHeight);
          glAsserted.bindFramebuffer(glAsserted.FRAMEBUFFER, null);
        } else {
          glAsserted.viewport(0, 0, target.width, target.height);
          glAsserted.bindFramebuffer(glAsserted.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          glAsserted.clearColor(0.0, 0.0, 0.0, 1.0);
          glAsserted.clear(glAsserted.COLOR_BUFFER_BIT);
        }
        glAsserted.drawElements(glAsserted.TRIANGLES, 6, glAsserted.UNSIGNED_SHORT, 0);
      };
    })();

    let dye: DoubleFBO | null = null;
    let velocity: DoubleFBO | null = null;
    let divergence: FBO | null = null;
    let curl: FBO | null = null;
    let pressure: DoubleFBO | null = null;

    const copyProgram = new Program(baseVertexShader as WebGLShader, copyShader as WebGLShader);
    const clearProgram = new Program(baseVertexShader as WebGLShader, clearShader as WebGLShader);
    const splatProgram = new Program(baseVertexShader as WebGLShader, splatShader as WebGLShader);
    const advectionProgram = new Program(baseVertexShader as WebGLShader, advectionShader as WebGLShader);
    const divergenceProgram = new Program(baseVertexShader as WebGLShader, divergenceShader as WebGLShader);
    const curlProgram = new Program(baseVertexShader as WebGLShader, curlShader as WebGLShader);
    const vorticityProgram = new Program(baseVertexShader as WebGLShader, vorticityShader as WebGLShader);
    const pressureProgram = new Program(baseVertexShader as WebGLShader, pressureShader as WebGLShader);
    const gradienSubtractProgram = new Program(
      baseVertexShader as WebGLShader,
      gradientSubtractShader as WebGLShader
    );
    const displayMaterial = new Material(baseVertexShader as WebGLShader, displayShaderSource);

    function initFramebuffers() {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType ?? glAsserted.UNSIGNED_BYTE;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? glAsserted.LINEAR : glAsserted.NEAREST;
      glAsserted.disable(glAsserted.BLEND);

      // Ensure formats are valid before creating FBOs
      const safeRgba = rgba ?? { internalFormat: glAsserted.RGBA, format: glAsserted.RGBA };
      const safeRg = rg ?? { internalFormat: (gl as WebGL2RenderingContext).RG ?? glAsserted.RGBA, format: (gl as WebGL2RenderingContext).RG ?? glAsserted.RGBA }; // Handle potential WebGL1 context for RG
      const safeR = r ?? { internalFormat: (gl as WebGL2RenderingContext).RED ?? glAsserted.RGBA, format: (gl as WebGL2RenderingContext).RED ?? glAsserted.RGBA }; // Handle potential WebGL1 context for R

      if (!dye)
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          safeRgba.internalFormat, 
          safeRgba.format,         
          texType as number, // Explicit assertion
          filtering
        );
      else
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          safeRgba.internalFormat, 
          safeRgba.format,         
          texType as number, // Explicit assertion
          filtering
        );

      if (!velocity)
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          safeRg.internalFormat, 
          safeRg.format,         
          texType as number, // Explicit assertion
          filtering
        );
      else
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          safeRg.internalFormat, 
          safeRg.format,         
          texType as number, // Explicit assertion
          filtering
        );

      divergence = createFBO(
        simRes.width,
        simRes.height,
        safeR.internalFormat, 
        safeR.format,       
        texType as number, // Explicit assertion
        glAsserted.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        safeR.internalFormat, 
        safeR.format,       
        texType as number, // Explicit assertion
        glAsserted.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        safeR.internalFormat, 
        safeR.format,       
        texType as number, // Explicit assertion
        glAsserted.NEAREST
      );
    }

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      glAsserted.activeTexture(glAsserted.TEXTURE0);
      const texture = glAsserted.createTexture();
      glAsserted.bindTexture(glAsserted.TEXTURE_2D, texture);
      glAsserted.texParameteri(glAsserted.TEXTURE_2D, glAsserted.TEXTURE_MIN_FILTER, param);
      glAsserted.texParameteri(glAsserted.TEXTURE_2D, glAsserted.TEXTURE_MAG_FILTER, param);
      glAsserted.texParameteri(glAsserted.TEXTURE_2D, glAsserted.TEXTURE_WRAP_S, glAsserted.CLAMP_TO_EDGE);
      glAsserted.texParameteri(glAsserted.TEXTURE_2D, glAsserted.TEXTURE_WRAP_T, glAsserted.CLAMP_TO_EDGE);
      glAsserted.texImage2D(
        glAsserted.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );

      const fbo = glAsserted.createFramebuffer();
      glAsserted.bindFramebuffer(glAsserted.FRAMEBUFFER, fbo);
      glAsserted.framebufferTexture2D(
        glAsserted.FRAMEBUFFER,
        glAsserted.COLOR_ATTACHMENT0,
        glAsserted.TEXTURE_2D,
        texture,
        0
      );
      glAsserted.viewport(0, 0, w, h);
      glAsserted.clear(glAsserted.COLOR_BUFFER_BIT);

      const texelSizeX = 1.0 / w;
      const texelSizeY = 1.0 / h;
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number) {
          (gl as WebGLRenderingContext | WebGL2RenderingContext).activeTexture((gl as WebGLRenderingContext | WebGL2RenderingContext).TEXTURE0 + id); // Inner scope assertion
          (gl as WebGLRenderingContext | WebGL2RenderingContext).bindTexture((gl as WebGLRenderingContext | WebGL2RenderingContext).TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value: FBO) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value: FBO) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(target: FBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      (gl as WebGLRenderingContext | WebGL2RenderingContext).uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    function updateKeywords() {
      const displayKeywords = [];
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }

    updateKeywords();
    initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function updateFrame() {
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
      requestAnimationFrame(updateFrame);
    }

    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    function updateColors(dt: number) {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
        pointers.forEach((p) => {
          const c = generateColor();
          p.color = [c.r ?? 0, c.g ?? 0, c.b ?? 0];
        });
      }
    }

    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
    }

    function step(dt: number) {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      glAsserted.disable(glAsserted.BLEND);
      // Curl
      curlProgram.bind();
      glAsserted.uniform2f(
        curlProgram.uniforms.texelSize,
        velocity!.texelSizeX,
        velocity!.texelSizeY
      );
      glAsserted.uniform1i(curlProgram.uniforms.uVelocity, velocity!.read.attach(0));
      blit(curl);

      // Vorticity
      vorticityProgram.bind();
      glAsserted.uniform2f(
        vorticityProgram.uniforms.texelSize,
        velocity!.texelSizeX,
        velocity!.texelSizeY
      );
      glAsserted.uniform1i(
        vorticityProgram.uniforms.uVelocity,
        velocity!.read.attach(0)
      );
      glAsserted.uniform1i(vorticityProgram.uniforms.uCurl, curl!.attach(1));
      glAsserted.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      glAsserted.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity!.write);
      velocity!.swap();

      // Divergence
      divergenceProgram.bind();
      glAsserted.uniform2f(
        divergenceProgram.uniforms.texelSize,
        velocity!.texelSizeX,
        velocity!.texelSizeY
      );
      glAsserted.uniform1i(
        divergenceProgram.uniforms.uVelocity,
        velocity!.read.attach(0)
      );
      blit(divergence);

      // Clear pressure
      clearProgram.bind();
      glAsserted.uniform1i(clearProgram.uniforms.uTexture, pressure!.read.attach(0));
      glAsserted.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure!.write);
      pressure!.swap();

      // Pressure
      pressureProgram.bind();
      glAsserted.uniform2f(
        pressureProgram.uniforms.texelSize,
        velocity!.texelSizeX,
        velocity!.texelSizeY
      );
      glAsserted.uniform1i(pressureProgram.uniforms.uDivergence, divergence!.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        glAsserted.uniform1i(
          pressureProgram.uniforms.uPressure,
          pressure!.read.attach(1)
        );
        blit(pressure!.write);
        pressure!.swap();
      }

      // Gradient Subtract
      gradienSubtractProgram.bind();
      glAsserted.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,
        velocity!.texelSizeX,
        velocity!.texelSizeY
      );
      glAsserted.uniform1i(
        gradienSubtractProgram.uniforms.uPressure,
        pressure!.read.attach(0)
      );
      glAsserted.uniform1i(
        gradienSubtractProgram.uniforms.uVelocity,
        velocity!.read.attach(1)
      );
      blit(velocity!.write);
      velocity!.swap();

      // Advection
      advectionProgram.bind();
      glAsserted.uniform2f(
        advectionProgram.uniforms.texelSize,
        velocity!.texelSizeX,
        velocity!.texelSizeY
      );
      if (!ext.supportLinearFiltering)
        glAsserted.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity!.texelSizeX,
          velocity!.texelSizeY
        );
      const velocityId = velocity!.read.attach(0);
      glAsserted.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      glAsserted.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      glAsserted.uniform1f(advectionProgram.uniforms.dt, dt);
      glAsserted.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      );
      blit(velocity!.write);
      velocity!.swap();

      if (!ext.supportLinearFiltering)
        glAsserted.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye!.texelSizeX,
          dye!.texelSizeY
        );
      glAsserted.uniform1i(
        advectionProgram.uniforms.uVelocity,
        velocity!.read.attach(0)
      );
      glAsserted.uniform1i(advectionProgram.uniforms.uSource, dye!.read.attach(1));
      glAsserted.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      );
      blit(dye!.write);
      dye!.swap();
    }

    function render(target: FBO | null) {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      glAsserted.blendFunc(glAsserted.ONE, glAsserted.ONE_MINUS_SRC_ALPHA);
      glAsserted.enable(glAsserted.BLEND);
      drawDisplay(target);
    }

    function drawDisplay(target: FBO | null) {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      const width = target == null ? glAsserted.drawingBufferWidth : target.width;
      const height = target == null ? glAsserted.drawingBufferHeight : target.height;
      displayMaterial.bind();
      if (config.SHADING)
        glAsserted.uniform2f(
          displayMaterial.uniforms.texelSize,
          1.0 / width,
          1.0 / height
        );
      glAsserted.uniform1i(displayMaterial.uniforms.uTexture, dye!.read.attach(0));
      blit(target);
    }

    function splatPointer(pointer: Pointer) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer: Pointer) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const dx = 10 * (Math.random() - 0.5);
      const dy = 30 * (Math.random() - 0.5);
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: number[] | { r: number, g: number, b: number }) {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      splatProgram.bind();
      glAsserted.uniform1i(splatProgram.uniforms.uTarget, velocity!.read.attach(0));
      glAsserted.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas!.width / canvas!.height
      );
      glAsserted.uniform2f(splatProgram.uniforms.point, x, y);
      glAsserted.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      glAsserted.uniform1f(
        splatProgram.uniforms.radius,
        correctRadius(config.SPLAT_RADIUS / 100.0)
      );
      blit(velocity!.write);
      velocity!.swap();

      glAsserted.uniform1i(splatProgram.uniforms.uTarget, dye!.read.attach(0));
      const splatColor = Array.isArray(color) 
        ? { r: color[0] ?? 0, g: color[1] ?? 0, b: color[2] ?? 0 } 
        : { r: color.r ?? 0, g: color.g ?? 0, b: color.b ?? 0 }; 
      glAsserted.uniform3f(splatProgram.uniforms.color, splatColor.r, splatColor.g, splatColor.b);
      blit(dye!.write);
      dye!.swap();
    }

    function correctRadius(radius: number): number {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
      pointer.id = id;
      pointer.down = true;
      pointer.moved = false;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      const c = generateColor();
      pointer.color = [c.r ?? 0, c.g ?? 0, c.b ?? 0];
    }

    function updatePointerMoveData(pointer: Pointer, posX: number, posY: number, color: number[]) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas!.width;
      pointer.texcoordY = 1.0 - posY / canvas!.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved =
        Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
      pointer.color = color;
    }

    function updatePointerUpData(pointer: Pointer) {
      pointer.down = false;
    }

    function correctDeltaX(delta: number): number {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number): number {
      const aspectRatio = canvas!.width / canvas!.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function generateColor(): { r: number, g: number, b: number } {
      const c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r = (c.r ?? 0) * 0.15;
      c.g = (c.g ?? 0) * 0.15;
      c.b = (c.b ?? 0) * 0.15;
      return c as { r: number, g: number, b: number };
    }

    function HSVtoRGB(h: number, s: number, v: number): { r: number, g: number, b: number } {
      let r = 0, g = 0, b = 0;
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
          break;
      }
      return { r, g, b };
    }

    function wrap(value: number, min: number, max: number): number {
      const range = max - min;
      if (range === 0) return min;
      return ((value - min) % range) + min;
    }

    function getResolution(resolution: number): { width: number, height: number } {
      const glAsserted = gl as WebGLRenderingContext | WebGL2RenderingContext;
      let aspectRatio = glAsserted.drawingBufferWidth / glAsserted.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (glAsserted.drawingBufferWidth > glAsserted.drawingBufferHeight)
        return { width: max, height: min };
      else return { width: min, height: max };
    }

    function scaleByPixelRatio(input: number): number {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    function hashCode(s: string): number {
      if (s.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    window.addEventListener("mousedown", (e) => {
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      updatePointerDownData(pointer, -1, posX, posY);
      clickSplat(pointer);
    });

    document.body.addEventListener(
      "mousemove",
      function handleFirstMouseMove(e) {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX);
        const posY = scaleByPixelRatio(e.clientY);
        const color = generateColor();
        updateFrame(); // start animation loop
        updatePointerMoveData(pointer, posX, posY, [color.r, color.g, color.b]);
        document.body.removeEventListener("mousemove", handleFirstMouseMove);
      }
    );

    window.addEventListener("mousemove", (e) => {
      const pointer = pointers[0];
      const posX = scaleByPixelRatio(e.clientX);
      const posY = scaleByPixelRatio(e.clientY);
      const color = pointer.color;
      updatePointerMoveData(pointer, posX, posY, color);
    });

    document.body.addEventListener(
      "touchstart",
      function handleFirstTouchStart(e) {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
          const posX = scaleByPixelRatio(touches[i].clientX);
          const posY = scaleByPixelRatio(touches[i].clientY);
          updateFrame(); // start animation loop
          updatePointerDownData(pointer, touches[i].identifier, posX, posY);
        }
        document.body.removeEventListener("touchstart", handleFirstTouchStart);
      }
    );

    window.addEventListener("touchstart", (e) => {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
    });

    window.addEventListener(
      "touchmove",
      (e) => {
        const touches = e.targetTouches;
        const pointer = pointers[0];
        for (let i = 0; i < touches.length; i++) {
          const posX = scaleByPixelRatio(touches[i].clientX);
          const posY = scaleByPixelRatio(touches[i].clientY);
          updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
      },
      false
    );

    window.addEventListener("touchend", (e) => {
      const touches = e.changedTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer);
      }
    });

    updateFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
  ]);

  return (
    <div className="fixed top-0 left-0 pointer-events-none -z-10">
      <canvas ref={canvasRef} id="fluid" className="w-screen h-screen" />
    </div>
  );
}

export { SplashCursor };

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Coffee,
  Database,
  Download,
  ServerCog,
  Workflow,
} from "lucide-react";

const slides = [
  {
    theme: "foundation",
    dustShape: "foundation",
    headline: ["Build the AI foundation.", "Run it in production."],
    subcopy:
      "We engineer the data foundation, build the AI on top, and run it in production. Most enterprise AI stalls before it gets there.",
    eyebrow: "Service foundation",
    supportTitle: "Data Engineering Services",
    support:
      "Lakehouse architecture, real-time pipelines, data quality, migration, governance, and the operating layer AI depends on.",
    chips: ["Pipelines", "Governance", "AI-ready data"],
    ctaText: "Explore data engineering",
    ctaUrl: "https://aciinfotech.com/services/data-engineering",
  },
  {
    theme: "databricks",
    dustShape: "lakehouse",
    logo: "/assets/logos/partners/databricks.svg",
    logoAlt: "Databricks",
    headline: ["Databricks depth.", "Production AI."],
    subcopy:
      "Lakehouse modernization, Delta pipelines, MLflow, governance, and real-time analytics for teams that need Databricks to run in production.",
    eyebrow: "Case study",
    supportTitle: "Databricks modernization for a leading C-store chain",
    support: "Modernized the retail data estate so analytics could move from delayed processing to operational speed.",
    metric: "87%",
    metricLabel: "reduction in data processing time",
    chips: ["Delta Lake", "MLflow", "Workflows"],
    ctaText: "Read Databricks case study",
    ctaUrl: "https://aciinfotech.com/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain",
  },
  {
    theme: "microsoft",
    dustShape: "cloud-system",
    logo: "/assets/logos/partners/microsoft-azure.svg",
    logoAlt: "Microsoft Azure",
    headline: ["Microsoft cloud.", "AI-led operations."],
    subcopy:
      "Azure is strongest when it connects to the business stack. We bring Azure, Dynamics 365, Power Platform, and data engineering together around measurable operations.",
    eyebrow: "Platform expertise",
    supportTitle: "Microsoft Azure Cloud Solutions",
    support:
      "Azure, Microsoft 365, Dynamics 365, Power Platform, data engineering, and AI connected around business workflows.",
    chips: ["Azure", "Dynamics 365", "Power Platform"],
    ctaText: "Explore Microsoft expertise",
    ctaUrl: "https://aciinfotech.com/platforms/azure",
  },
  {
    theme: "people",
    dustShape: "collective-bloom",
    headline: ["People thrive here.", "Teams move as one."],
    subcopy:
      "ACI is a place where people feel valued, supported, and happy to do their best work. Across teams and regions, we collaborate openly, celebrate one another, and move forward together.",
    eyebrow: "Life at ACI",
    supportTitle: "A culture built on belonging.",
    support: "A cohesive, welcoming environment where people enjoy the work, grow with one another, and share in every success.",
    chips: ["Belonging", "Team spirit", "Shared success"],
    ctaText: "Explore careers",
    ctaUrl: "https://aciinfotech.com/careers",
    badge: "/assets/logos/certifications/great-place-to-work.webp",
  },
];

const navItems = ["Capabilities", "Solutions", "Industries", "ArqAI Labs", "Work", "Insights", "About"];

const partners = [
  ["Amazon Web Services", "/assets/logos/partners/amazon-web-services.svg"],
  ["Microsoft Azure", "/assets/logos/partners/microsoft-azure.svg"],
  ["Databricks", "/assets/logos/partners/databricks.svg"],
  ["Snowflake", "/assets/logos/partners/snowflake.svg"],
  ["Google Cloud", "/assets/logos/partners/google-cloud.svg"],
  ["SAP", "/assets/logos/partners/sap.svg"],
  ["Salesforce", "/assets/logos/partners/salesforce.svg"],
  ["Dynatrace", "/assets/logos/partners/dynatrace.svg"],
];

const clients = [
  { name: "IAPMO", src: "/assets/logos/clients/iapmo.svg", group: "Consumer and retail", opticalScale: 0.72 },
  { name: "Kellogg's", src: "/assets/logos/clients/kelloggs.svg", group: "Consumer and retail", opticalScale: 0.9 },
  { name: "Nestle", src: "/assets/logos/clients/nestle.svg", group: "Consumer and retail", opticalScale: 0.94 },
  { name: "RaceTrac", src: "/assets/logos/clients/racetrac.svg", group: "Consumer and retail", opticalScale: 1.12 },
  { name: "Jio", src: "/assets/logos/clients/jio.svg", group: "Consumer and retail", opticalScale: 0.5 },
  { name: "Croma", src: "/assets/logos/clients/croma.png", group: "Consumer and retail", opticalScale: 0.86 },
  { name: "MSCI", src: "/assets/logos/clients/msci.svg", group: "Financial services", opticalScale: 0.72 },
  { name: "Bank of America", src: "/assets/logos/clients/bank-of-america.svg", group: "Financial services", opticalScale: 1.14 },
  { name: "Gen II", src: "/assets/logos/clients/gen-ii.png", group: "Financial services", opticalScale: 0.84 },
  { name: "Credit Suisse", src: "/assets/logos/clients/credit-suisse.svg", group: "Financial services", opticalScale: 0.86 },
  { name: "Wells Fargo", src: "/assets/logos/clients/wells-fargo.svg", group: "Financial services", opticalScale: 0.56 },
  { name: "Bloomberg", src: "/assets/logos/clients/bloomberg.svg", group: "Financial services", opticalScale: 0.84 },
  { name: "ADP", src: "/assets/logos/clients/adp.svg", group: "Financial services", opticalScale: 0.82 },
  { name: "Sun Life", src: "/assets/logos/clients/sun-life.svg", group: "Financial services", opticalScale: 0.82 },
  { name: "Morgan Stanley", src: "/assets/logos/clients/morgan-stanley.svg", group: "Financial services", opticalScale: 1.02 },
  { name: "T-Mobile", src: "/assets/logos/clients/t-mobile.svg", group: "Telecom", opticalScale: 0.92 },
  { name: "Verizon", src: "/assets/logos/clients/verizon.svg", group: "Telecom", opticalScale: 0.84 },
  { name: "Charter Communications", src: "/assets/logos/clients/charter.svg", group: "Telecom", opticalScale: 0.9 },
  { name: "Apple", src: "/assets/logos/clients/apple.svg", group: "Healthcare and technology", opticalScale: 0.48 },
  { name: "Sun Pharma", src: "/assets/logos/clients/sun-pharma.png", group: "Healthcare", opticalScale: 0.7 },
  { name: "Merck", src: "/assets/logos/clients/merck.svg", group: "Healthcare", opticalScale: 0.78 },
  { name: "UnitedHealthcare", src: "/assets/logos/clients/united-healthcare.svg", group: "Healthcare", opticalScale: 0.86 },
  { name: "Johnson & Johnson", src: "/assets/logos/clients/johnson-johnson.svg", group: "Healthcare", opticalScale: 1.04 },
  { name: "Flipt", src: "/assets/logos/clients/flipt.png", group: "Healthcare", opticalScale: 0.58 },
  { name: "Sodexo", src: "/assets/logos/clients/sodexo.svg", group: "Hospitality", opticalScale: 0.86 },
  { name: "Marriott", src: "/assets/logos/clients/marriott.svg", group: "Hospitality", opticalScale: 0.56 },
  { name: "CT.gov", src: "/assets/logos/clients/ct-gov.svg", group: "Public sector", opticalScale: 0.82 },
  { name: "NC.gov", src: "/assets/logos/clients/nc-gov.png", group: "Public sector", opticalScale: 0.8 },
  { name: "GSA", src: "/assets/logos/clients/gsa.svg", group: "Public sector", opticalScale: 0.54 },
  { name: "MTA", src: "/assets/logos/clients/mta.svg", group: "Public sector", opticalScale: 0.52 },
];

const playbooks = [
  {
    category: "Integration",
    title: "Post-Acquisition ERP Unification",
    description: "Forty finance systems and a week-long close become one operating model, one governed system, and one trusted number.",
    metric: "78%",
    metricLabel: "less reconciliation effort",
  },
  {
    category: "Data",
    title: "Real-Time Inventory Platform",
    description: "Move store decisions from yesterday's batch to a governed, real-time view of inventory across the network.",
    metric: "64%",
    metricLabel: "lower latency",
  },
  {
    category: "Data",
    title: "Global Data Unification",
    description: "Bring regions, systems, and definitions into one source of truth that finance, procurement, and operations can share.",
    metric: "65%",
    metricLabel: "duplicate records removed",
  },
  {
    category: "Analytics",
    title: "Enterprise Self-Service Analytics",
    description: "Replace ticket queues and delayed answers with governed data products that put trusted analysis in the hands of the business.",
    metric: "75%",
    metricLabel: "fewer analytics requests",
  },
  {
    category: "AI",
    title: "Enterprise Agentic AI",
    description: "Move repetitive work into auditable agent workflows connected to enterprise systems, controls, and human oversight.",
    metric: "40%",
    metricLabel: "faster operations",
  },
  {
    category: "Cloud",
    title: "Legacy-to-Cloud Migration",
    description: "Modernize the platforms nobody wants to interrupt, with migration waves designed around continuity, security, and measurable value.",
    metric: "68%",
    metricLabel: "lower run cost",
  },
];

function randomSphere(count, radius) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = Math.cbrt(Math.random()) * radius;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
}

function signalStreamPositions(count, width) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const x = (Math.random() - 0.5) * width;
    const lane = (i % 5) - 2;
    pos[i * 3] = x;
    pos[i * 3 + 1] = lane * 0.045 + Math.sin(x * 1.32 + i * 0.014) * 0.06 + (Math.random() - 0.5) * 0.06;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
  }
  return pos;
}

function setPoint(pos, index, x, y, z, scale) {
  pos[index] = x * scale;
  pos[index + 1] = y * scale;
  pos[index + 2] = z * scale;
}

function pointOnSegment(start, end) {
  const t = Math.random();
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
    start[2] + (end[2] - start[2]) * t,
  ];
}

function pointInTriangle(a, b, c) {
  let u = Math.random();
  let v = Math.random();
  if (u + v > 1) {
    u = 1 - u;
    v = 1 - v;
  }
  return [
    a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v,
    a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v,
    a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * v,
  ];
}

function pointOnPolygonEdge(vertices) {
  const edge = Math.floor(Math.random() * vertices.length);
  return pointOnSegment(vertices[edge], vertices[(edge + 1) % vertices.length]);
}

function placePoint(pos, index, point, scale, jitter = 0.012) {
  setPoint(
    pos,
    index,
    point[0] + (Math.random() - 0.5) * jitter,
    point[1] + (Math.random() - 0.5) * jitter,
    point[2] + (Math.random() - 0.5) * jitter,
    scale,
  );
}

function abstractShapePositions(shape, count, size) {
  const pos = new Float32Array(count * 3);
  const scale = size / 10;

  for (let i = 0; i < count; i += 1) {
    const index = i * 3;
    const random = Math.random();

    if (shape === "foundation") {
      const layer = Math.floor(Math.random() * 4);
      const y = -1.95 + layer * 1.28;
      const diamond = [[-4.35, y, 0], [0, y + 0.9, -0.52], [4.35, y, 0], [0, y - 0.9, 0.62]];
      if (random < 0.82) {
        placePoint(pos, index, pointOnPolygonEdge(diamond), scale, 0.012);
      } else if (random < 0.92) {
        const face = Math.random() < 0.5
          ? pointInTriangle(diamond[0], diamond[1], diamond[2])
          : pointInTriangle(diamond[0], diamond[2], diamond[3]);
        placePoint(pos, index, face, scale, 0.018);
      } else {
        const corner = Math.floor(Math.random() * 4);
        const bottom = [[-4.35, -1.95, 0], [0, -1.05, -0.52], [4.35, -1.95, 0], [0, -2.85, 0.62]][corner];
        const top = [[-4.35, 1.89, 0], [0, 2.79, -0.52], [4.35, 1.89, 0], [0, 0.99, 0.62]][corner];
        placePoint(pos, index, pointOnSegment(bottom, top), scale, 0.012);
      }
      continue;
    }

    if (shape === "lakehouse") {
      const apex = [0, 3.55, -0.45];
      const left = [-4.25, -2.05, -0.15];
      const right = [4.25, -2.05, -0.15];
      const front = [0, -0.85, 2.35];
      if (random < 0.72) {
        const edges = [[apex, left], [apex, right], [apex, front], [left, right], [left, front], [right, front]];
        const edge = edges[Math.floor(Math.random() * edges.length)];
        placePoint(pos, index, pointOnSegment(edge[0], edge[1]), scale, 0.012);
      } else if (random < 0.9) {
        const faces = [[apex, left, front], [apex, front, right], [left, right, front]];
        const face = faces[Math.floor(Math.random() * faces.length)];
        placePoint(pos, index, pointInTriangle(face[0], face[1], face[2]), scale, 0.018);
      } else {
        const ringScale = [0.62, 0.82, 1][Math.floor(Math.random() * 3)];
        const lake = [[-4.5, -2.55, 0.1], [0, -1.78, -0.25], [4.5, -2.55, 0.1], [0, -3.18, 0.55]]
          .map((point) => [point[0] * ringScale, -2.48 + (point[1] + 2.48) * ringScale, point[2] * ringScale]);
        placePoint(pos, index, pointOnPolygonEdge(lake), scale, 0.01);
      }
      continue;
    }

    if (shape === "cloud-system") {
      const centers = [[-2.3, 1.35, 0.3], [2.3, 1.35, -0.3], [-2.3, -1.35, -0.3], [2.3, -1.35, 0.3]];
      const center = centers[Math.floor(Math.random() * centers.length)];
      const panel = [
        [center[0] - 1.58, center[1] - 0.08, center[2] + 0.16],
        [center[0] - 0.34, center[1] + 1.02, center[2] - 0.2],
        [center[0] + 1.58, center[1] + 0.08, center[2] - 0.16],
        [center[0] + 0.34, center[1] - 1.02, center[2] + 0.2],
      ];
      if (random < 0.78) {
        placePoint(pos, index, pointOnPolygonEdge(panel), scale, 0.012);
      } else if (random < 0.9) {
        const face = Math.random() < 0.5
          ? pointInTriangle(panel[0], panel[1], panel[2])
          : pointInTriangle(panel[0], panel[2], panel[3]);
        placePoint(pos, index, face, scale, 0.018);
      } else {
        const t = Math.random();
        const arc = Math.sin(t * Math.PI) * 0.42;
        placePoint(pos, index, [center[0] * (1 - t), center[1] * (1 - t) + arc, center[2] * (1 - t)], scale, 0.012);
      }
      continue;
    }

    const node = Math.floor(Math.random() * 7);
    const angle = node === 0 ? 0 : ((node - 1) / 6) * Math.PI * 2 - Math.PI / 2;
    const center = node === 0 ? [0, 0, 0.55] : [Math.cos(angle) * 3.8, Math.sin(angle) * 2.65, -0.2];
    const radius = node === 0 ? 1.22 : 0.78;
    const hexagon = Array.from({ length: 6 }, (_, vertex) => {
      const theta = (vertex / 6) * Math.PI * 2 + Math.PI / 6;
      return [center[0] + Math.cos(theta) * radius, center[1] + Math.sin(theta) * radius, center[2] + (vertex % 2 ? 0.22 : -0.22)];
    });
    if (random < 0.72) {
      placePoint(pos, index, pointOnPolygonEdge(hexagon), scale, 0.012);
    } else if (random < 0.82) {
      const edge = Math.floor(Math.random() * 6);
      placePoint(pos, index, pointInTriangle(center, hexagon[edge], hexagon[(edge + 1) % 6]), scale, 0.018);
    } else {
      const t = Math.random();
      const bow = Math.sin(t * Math.PI) * 0.38;
      placePoint(pos, index, [center[0] * t - Math.sin(angle) * bow, center[1] * t + Math.cos(angle) * bow, center[2] * t], scale, 0.01);
    }
  }
  return pos;
}

function orderedDelays(targets, count) {
  const delays = new Float32Array(count);
  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < count; i += 1) {
    minX = Math.min(minX, targets[i * 3]);
    maxX = Math.max(maxX, targets[i * 3]);
  }
  const range = maxX - minX || 1;
  for (let i = 0; i < count; i += 1) {
    const x = targets[i * 3];
    const y = targets[i * 3 + 1];
    const radial = Math.sqrt(x * x + y * y);
    delays[i] = clamp01(radial / (range * 0.72)) * 0.9 + Math.random() * 0.1;
  }
  return delays;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2;
}

function smootherStep(value) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function createBrandColors(count) {
  const softWhite = new THREE.Color("#f4f8ff");
  const royalBlue = new THREE.Color("#003d99");
  const limeGreen = new THREE.Color("#c6ff3d");
  const softWhiteCount = Math.round(count * 0.5);
  const royalBlueCount = Math.round(count * 0.3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const color = i < softWhiteCount
      ? softWhite
      : i < softWhiteCount + royalBlueCount
        ? royalBlue
        : limeGreen;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  return colors;
}

function createDustTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.34, "rgba(255,255,255,0.96)");
  gradient.addColorStop(0.62, "rgba(255,255,255,0.46)");
  gradient.addColorStop(0.78, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 96, 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function MagicDustStage({ slide, activeIndex, reducedMotion }) {
  const hostRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const geometryRef = useRef(null);
  const pointsRef = useRef(null);
  const frameRef = useRef(0);
  const fromRef = useRef(null);
  const targetRef = useRef(null);
  const scatterRef = useRef(null);
  const delayRef = useRef(null);
  const progressRef = useRef(1);
  const transitionStartRef = useRef(0);
  const particleCountRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 14);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    host.appendChild(renderer.domElement);

    const isSmall = window.innerWidth < 720;
    const count = reducedMotion ? 1400 : isSmall ? 2800 : 5600;
    particleCountRef.current = count;

    const origin = randomSphere(count, isSmall ? 4.4 : 6.2);
    const firstTarget = abstractShapePositions(slide.dustShape, count, isSmall ? 9.2 : 12.4);
    const firstScatter = signalStreamPositions(count, isSmall ? 9.5 : 13.5);
    targetRef.current = firstTarget;
    fromRef.current = origin;
    scatterRef.current = firstScatter;
    delayRef.current = orderedDelays(firstTarget, count);
    progressRef.current = reducedMotion ? 1 : 0;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(origin.slice(), 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(createBrandColors(count), 3));
    const dustTexture = createDustTexture();

    const material = new THREE.PointsMaterial({
      map: dustTexture,
      size: isSmall ? 0.058 : 0.072,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.98,
      alphaTest: 0.06,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: true,
    });

    const group = new THREE.Group();
    const points = new THREE.Points(geometry, material);
    group.add(points);
    scene.add(group);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    materialRef.current = material;
    geometryRef.current = geometry;
    pointsRef.current = group;

    function resize() {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const small = window.innerWidth < 720;
      material.size = small ? 0.058 : 0.072;
      group.scale.setScalar(small ? 0.92 : 1);
    }

    function animate(now) {
      const time = now * 0.001;
      const progress = reducedMotion ? 1 : smootherStep((now - transitionStartRef.current) / 1900);
      progressRef.current = progress;

      const positions = geometry.attributes.position.array;
      const from = fromRef.current;
      const target = targetRef.current;
      const scatter = scatterRef.current;
      const delays = delayRef.current;

      if (from && target && scatter && delays) {
        for (let i = 0; i < count; i += 1) {
          const index = i * 3;
          const local = clamp01((progress - delays[i] * 0.08) * 1.1);
          const eased = easeInOutCubic(local);
          const stream = Math.pow(Math.sin(local * Math.PI), 1.8) * 0.28;
          const transitionDrift = reducedMotion ? 0 : Math.sin(local * Math.PI);
          const driftX = Math.sin(time * 0.24 + i * 0.018) * 0.018 * transitionDrift;
          const driftY = Math.cos(time * 0.2 + i * 0.015) * 0.015 * transitionDrift;
          const driftZ = Math.sin(time * 0.18 + i * 0.012) * 0.02 * transitionDrift;

          const x = from[index] + (target[index] - from[index]) * eased;
          const y = from[index + 1] + (target[index + 1] - from[index + 1]) * eased;
          const z = from[index + 2] + (target[index + 2] - from[index + 2]) * eased;

          positions[index] = x + (scatter[index] - x) * stream + driftX * local;
          positions[index + 1] = y + (scatter[index + 1] - y) * stream + driftY * local;
          positions[index + 2] = z + (scatter[index + 2] - z) * stream + driftZ * local;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      const hover = reducedMotion ? 0 : Math.sin(time * 0.52) * 0.13;
      group.position.x += (mouseRef.current.x * 0.2 - group.position.x) * 0.025;
      group.position.y += (hover - mouseRef.current.y * 0.12 - group.position.y) * 0.025;
      group.position.z += (mouseRef.current.x * 0.05 - group.position.z) * 0.02;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    transitionStartRef.current = performance.now();
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      geometry.dispose();
      material.dispose();
      dustTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useLayoutEffect(() => {
    const material = materialRef.current;
    const geometry = geometryRef.current;
    if (!material || !geometry) return;

    const count = particleCountRef.current;
    const nextTarget = abstractShapePositions(slide.dustShape, count, window.innerWidth < 720 ? 9.2 : 12.4);
    targetRef.current = nextTarget;

    fromRef.current = new Float32Array(geometry.getAttribute("position").array);
    scatterRef.current = signalStreamPositions(count, window.innerWidth < 720 ? 9.5 : 13.5);
    delayRef.current = orderedDelays(nextTarget, count);

    progressRef.current = 0;
    transitionStartRef.current = performance.now();
  }, [activeIndex, slide.dustShape, reducedMotion]);

  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  return (
    <div className="dust-stage" ref={hostRef} onPointerMove={handlePointerMove} aria-hidden="true" />
  );
}

function SceneSupport({ slide }) {
  return (
    <div className="scene-support">
      {slide.badge ? (
        <span className="support-badge">
          <img src={slide.badge} alt="Great Place to Work Certified" />
        </span>
      ) : slide.logo ? (
        <span className="support-logo">
          <img src={slide.logo} alt={slide.logoAlt} />
        </span>
      ) : (
        <span className="support-token">Data engineering</span>
      )}
      <div className="support-copy">
        <p className="support-eyebrow">{slide.eyebrow}</p>
        <h2>{slide.supportTitle}</h2>
        <div className="support-body">
          {slide.metric ? (
            <span className="metric">
              <strong>{slide.metric}</strong>
              <span>{slide.metricLabel}</span>
            </span>
          ) : null}
          <p>{slide.support}</p>
        </div>
        <div className="chip-row">
          {slide.chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerRail() {
  const track = [...partners, ...partners];
  return (
    <div className="partner-rail" aria-label="Platform partners">
      <p>Platform ecosystem</p>
      <div className="partner-window">
        <div className="partner-track">
          {track.map(([name, src], index) => (
            <img key={`${name}-${index}`} src={src} alt={index < partners.length ? name : ""} aria-hidden={index >= partners.length ? "true" : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientField({ reducedMotion }) {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [isVisible, setIsVisible] = useState(reducedMotion);
  const [hoveredClient, setHoveredClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const activeClient = hoveredClient || selectedClient;

  useEffect(() => {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    function clearOutside(event) {
      if (!sectionRef.current?.contains(event.target)) {
        setHoveredClient(null);
        setSelectedClient(null);
        return;
      }

      if (!event.target.closest(".client-logo")) {
        setHoveredClient(null);
        setSelectedClient(null);
      }
    }

    document.addEventListener("pointerdown", clearOutside);
    return () => document.removeEventListener("pointerdown", clearOutside);
  }, []);

  function clearGridFocus(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHoveredClient(null);
    }
  }

  return (
    <section
      id="clients"
      className={`client-field ${isVisible ? "is-visible" : ""} ${activeClient ? "is-interacting" : ""}`}
      ref={sectionRef}
      aria-labelledby="client-field-title"
    >
      <div className="client-field-inner">
        <header className="client-field-header">
          <div className="client-heading-block">
            <p className="client-eyebrow">Selected client relationships</p>
            <h2 id="client-field-title">Trusted where the work keeps moving.</h2>
          </div>
          <div className="client-assurance-copy">
            <p className="client-intro">
              Selected relationships across financial services, telecom, healthcare, consumer, hospitality, and the public sector.
            </p>
            <a className="client-field-cta" href="https://aciinfotech.com/case-studies">
              <span>Explore client outcomes</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </header>

        <ul className="client-grid" ref={gridRef} onBlur={clearGridFocus}>
          {clients.map((client, index) => {
            const isActive = activeClient === client.name;
            const isReceded = Boolean(activeClient) && !isActive;
            const isSelected = selectedClient === client.name;
            return (
              <li
                className="client-cell"
                key={client.name}
                style={{
                  "--client-column": index % 10,
                  "--client-row": Math.floor(index / 10),
                }}
              >
                <button
                  className={`client-logo ${isActive ? "is-active" : ""} ${isReceded ? "is-receded" : ""}`}
                  type="button"
                  aria-label={`${client.name}, ${client.group}`}
                  aria-pressed={isSelected}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      setSelectedClient(null);
                      setHoveredClient(client.name);
                    }
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") setHoveredClient(null);
                  }}
                  onFocus={() => setHoveredClient(client.name)}
                  onClick={() => setSelectedClient((current) => (current === client.name ? null : client.name))}
                >
                  <img
                    src={client.src}
                    alt=""
                    aria-hidden="true"
                    style={{ "--logo-scale": client.opticalScale }}
                  />
                </button>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}

function PlaybooksSection({ reducedMotion }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      className={`playbooks-section ${isVisible ? "is-visible" : ""}`}
      id="playbooks"
      ref={sectionRef}
      aria-labelledby="playbooks-heading"
    >
      <div className="playbooks-inner">
        <header className="playbooks-header">
          <div className="playbooks-heading-block">
            <p className="playbooks-eyebrow"><span aria-hidden="true" />Playbooks</p>
            <h2 id="playbooks-heading">
              <span>Hard problems.</span>
              <span>Already solved.</span>
            </h2>
          </div>

          <div className="playbooks-intro-block">
            <p>
              The same hard problems repeat across complex enterprises. Our playbooks bring the architecture, delivery sequence, and operating controls together, so teams can see the route to value before the work begins.
            </p>
            <a href="https://aciinfotech.com/playbooks">
              <span>Explore all playbooks</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </header>

        <ol className="playbooks-grid">
          {playbooks.map((playbook, index) => (
            <li className="playbook-item" style={{ "--playbook-index": index }} key={playbook.title}>
              <a className="playbook-link" href="https://aciinfotech.com/playbooks" aria-label={`Explore the ${playbook.title} playbook`}>
                <span className="playbook-rule" aria-hidden="true" />
                <span className="playbook-meta">
                  <span className="playbook-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="playbook-category"><i aria-hidden="true" />{playbook.category}</span>
                  <ArrowUpRight className="playbook-arrow" aria-hidden="true" />
                </span>
                <h3>{playbook.title}</h3>
                <p>{playbook.description}</p>
                <span className="playbook-outcome">
                  <strong>{playbook.metric}</strong>
                  <span>{playbook.metricLabel}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const successStories = [
  {
    id: "data-velocity",
    tabLabel: "Data velocity",
    icon: Database,
    eyebrow: "Retail / Data engineering",
    title: "Retail data, rebuilt for operational speed.",
    metric: "87%",
    metricLabel: "reduction in data-processing time",
    summary: "ACI replaced fragmented pipelines with a governed Databricks lakehouse, moving critical analytics from days to hours.",
    tags: ["Azure", "Databricks", "Delta Lake"],
    cta: "Read the Databricks story",
    href: "https://aciinfotech.com/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain",
    video: "/assets/success-stories/data-velocity.mp4",
  },
  {
    id: "ai-production",
    tabLabel: "AI in production",
    icon: BrainCircuit,
    eyebrow: "Financial services / Applied AI",
    title: "A lakehouse that moves models into production faster.",
    metric: "83%",
    metricLabel: "reduction in model-deployment time",
    summary: "ACI connected Azure Data Lake, Databricks, AKS, and Synapse into a governed foundation for analytics and machine learning.",
    tags: ["Azure", "MLOps", "Databricks"],
    cta: "Read the Azure Lakehouse story",
    href: "https://aciinfotech.com/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse",
    video: "/assets/success-stories/decision-intelligence.mp4",
  },
  {
    id: "reliable-scale",
    tabLabel: "Reliable scale",
    icon: ServerCog,
    eyebrow: "Technology / DevOps and platform",
    title: "A complex digital estate, engineered to stay available.",
    metric: "99.7%",
    metricLabel: "system uptime across 72+ servers",
    summary: "Automated CI/CD, monitoring, load balancing, and centralized logs helped releases move faster without disrupting operations.",
    tags: ["CI/CD", "Monitoring", "Platform ops"],
    cta: "Read the DevOps story",
    href: "https://aciinfotech.com/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring",
    video: "/assets/success-stories/reliable-scale.mp4",
  },
  {
    id: "intelligent-operations",
    tabLabel: "Intelligent operations",
    icon: Workflow,
    eyebrow: "Technology / Workflow automation",
    title: "Contract operations that move at business speed.",
    metric: "67%",
    metricLabel: "reduction in contract cycle time",
    summary: "ACI automated creation, review, approval, compliance, and renewal in a governed Conga CLM environment.",
    tags: ["Conga CLM", "Automation", "Governance"],
    cta: "Read the automation story",
    href: "https://aciinfotech.com/case-studies/accelerating-contract-performance-through-intelligent-automation",
    video: "/assets/success-stories/intelligent-operations.mp4",
  },
];

const servicePillars = [
  {
    id: "data-engineering",
    label: "Data Engineering",
    title: "Data that is ready for production AI.",
    description: "Modernize fragmented data estates into governed, real-time foundations that analytics, AI, and daily operations can trust.",
    items: ["Lakehouse architecture", "Real-time pipelines", "Data governance", "Migration and modernization"],
    platformLabel: "Data technology ecosystem",
    platforms: [
      { name: "Databricks", src: "/assets/logos/partners/databricks.svg", scale: 1.02 },
      { name: "Snowflake", src: "/assets/logos/partners/snowflake.svg", scale: 1 },
      { name: "Microsoft Azure", src: "/assets/logos/partners/microsoft-azure.svg", scale: 1.08 },
      { name: "Power BI", src: "/assets/logos/partners/power-bi.svg", scale: 1, showName: true },
      { name: "dbt", src: "/assets/logos/partners/dbt.png", scale: 0.94 },
    ],
    video: "/assets/success-stories/data-velocity.mp4",
    cta: "Explore data engineering",
    href: "https://aciinfotech.com/services/data-engineering",
  },
  {
    id: "applied-ai",
    label: "Applied AI & ML",
    title: "Intelligence that moves into production.",
    description: "Design, deploy, and govern AI systems around real decisions, measurable workflows, and the operating realities of the enterprise.",
    items: ["Predictive analytics", "GenAI systems", "MLOps and deployment", "AI governance with ArqAI"],
    platformLabel: "AI technology ecosystem",
    platforms: [
      { name: "OpenAI", src: "/assets/logos/partners/openai.svg", scale: 1.08 },
      { name: "Anthropic", src: "/assets/logos/partners/anthropic.svg", scale: 0.92, showName: true },
      { name: "Google Cloud", src: "/assets/logos/partners/google-cloud.svg", scale: 1.08 },
      { name: "LangChain", src: "/assets/logos/partners/langchain.svg", scale: 0.96, showName: true },
    ],
    video: "/assets/success-stories/decision-intelligence.mp4",
    cta: "Explore AI and ML",
    href: "https://aciinfotech.com/services/applied-ai-ml",
  },
  {
    id: "cloud-digital",
    label: "Cloud & Digital",
    title: "Cloud platforms built to keep changing.",
    description: "Connect cloud modernization, application engineering, and automation so digital products can evolve without destabilizing the core.",
    items: ["Cloud modernization", "Containers and platforms", "Application engineering", "Process automation"],
    platformLabel: "Certified cloud platforms",
    platforms: [
      { name: "Amazon Web Services", src: "/assets/logos/partners/amazon-web-services.svg", scale: 0.94 },
      { name: "Microsoft Azure", src: "/assets/logos/partners/microsoft-azure.svg", scale: 1.08 },
      { name: "Google Cloud", src: "/assets/logos/partners/google-cloud.svg", scale: 1.08 },
    ],
    video: "/assets/success-stories/reliable-scale.mp4",
    cta: "Explore cloud and digital",
    href: "https://aciinfotech.com/services/cloud-modernization",
  },
  {
    id: "managed-operations",
    label: "Managed Operations",
    title: "Two centers. One escalation path.",
    description: "NOC keeps the estate up. SOC keeps it safe. Both run on the platforms you already trust, with follow-the-sun coverage across three time zones.",
    items: ["24/7 monitoring", "Incident response", "SLA management", "Runbook automation"],
    platformLabel: "Platforms we operate",
    platforms: [
      { name: "Dynatrace", src: "/assets/logos/partners/dynatrace.svg", scale: 1.08 },
      { name: "ServiceNow", src: "/assets/logos/partners/servicenow.png", scale: 1.04 },
      { name: "Datadog", src: "/assets/logos/partners/datadog.svg", scale: 1, showName: true },
      { name: "Splunk", src: "/assets/logos/partners/splunk.svg", scale: 1.04 },
    ],
    video: "/assets/success-stories/intelligent-operations.mp4",
    cta: "Explore managed operations",
    href: "https://aciinfotech.com/services/managed-operations",
  },
];

const resourceItems = [
  {
    id: "eu-ai-act",
    type: "Industry insight",
    meta: "July 5, 2026 / 6 min read",
    title: "EU AI Act Compliance 2026: Governance Architecture for Enterprise AI",
    summary: "Build compliant AI systems, reduce regulatory risk, and move secure enterprise AI into production.",
    image: "/assets/resources/eu-ai-act.webp",
    href: "https://aciinfotech.com/blogs/eu-ai-act-compliance-2026-governance-architecture-for-enterprise-ai",
    featured: true,
  },
  {
    id: "erp-ai-apac",
    type: "Engineering perspective",
    meta: "July 8, 2026 / 7 min read",
    title: "ERP AI Integration APAC: How Manufacturers Win Without Big SIs",
    summary: "A modular path to governed ERP and AI integration, built around regional operations and measurable outcomes.",
    image: "/assets/resources/erp-ai-apac.webp",
    href: "https://aciinfotech.com/blogs/erp-ai-integration-apac-how-manufacturers-win-without-big-sis",
  },
  {
    id: "retail-benchmark",
    type: "Download / 47-page report",
    meta: "Benchmark report 2026",
    title: "Retail Technology Benchmark Report 2026",
    summary: "Performance benchmarks, implementation frameworks, ROI tools, and technology comparisons for retail leaders.",
    image: "/assets/resources/retail-benchmark-2026.webp",
    href: "https://aciinfotech.com/whitepapers/retail-technology-benchmark-report-2026",
    download: true,
  },
  {
    id: "forbes-india",
    type: "News & press",
    meta: "Forbes India / May 2026",
    title: "ACI Infotech named among the brands shaping the future of business",
    summary: "Forbes India profiles ACI's engineering-led growth and enterprise AI direction.",
    href: "https://www.forbesindia.com/article/upfront/brand-connect/valuable-brands-shaping-the-future-of-business/2993680/1",
  },
];

function SuccessStoryCard({ story, state }) {
  const Icon = story.icon;

  return (
    <div className="success-story-card-shell pointer-events-none absolute top-1/2 -translate-y-1/2 text-left">
      <article className={`success-story-card pointer-events-auto ${state === "leaving" ? "is-leaving" : "is-entering"}`} aria-label={story.title}>
        <div className="success-story-card-topline">
          <p className="success-story-eyebrow">{story.eyebrow}</p>
          <span className="success-story-icon" aria-hidden="true">
            <Icon />
          </span>
        </div>

        <h3>{story.title}</h3>

        <div className="success-story-metric">
          <strong>{story.metric}</strong>
          <span>{story.metricLabel}</span>
        </div>

        <p className="success-story-summary">{story.summary}</p>

        <div className="success-story-tags" aria-label="Technologies used">
          {story.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <a className="success-story-link" href={story.href}>
          {story.cta}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </article>
    </div>
  );
}

function StellarSection({ reducedMotion }) {
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const transitionTimerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(reducedMotion);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [previousStoryIndex, setPreviousStoryIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progressCycle, setProgressCycle] = useState(0);

  const activeStory = successStories[activeStoryIndex];
  const previousStory = previousStoryIndex === null ? null : successStories[previousStoryIndex];

  useEffect(() => {
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  function showStory(nextIndex) {
    if (nextIndex === activeStoryIndex) {
      setProgressCycle((value) => value + 1);
      return;
    }

    window.clearTimeout(transitionTimerRef.current);
    setPreviousStoryIndex(activeStoryIndex);
    setActiveStoryIndex(nextIndex);
    setProgressCycle((value) => value + 1);
    transitionTimerRef.current = window.setTimeout(() => setPreviousStoryIndex(null), reducedMotion ? 20 : 760);
  }

  useEffect(() => {
    if (!isVisible || reducedMotion || isPaused) return undefined;
    const timer = window.setTimeout(() => showStory((activeStoryIndex + 1) % successStories.length), 8000);
    return () => window.clearTimeout(timer);
  }, [activeStoryIndex, isPaused, isVisible, reducedMotion]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeStoryIndex || index === previousStoryIndex) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
        if (video.readyState > 1) video.currentTime = 0;
      }
    });
  }, [activeStoryIndex, previousStoryIndex]);

  useEffect(() => () => window.clearTimeout(transitionTimerRef.current), []);

  const revealClass = isVisible ? "animate-fade-in-up" : "";

  return (
    <section className="stellar-section border-t border-gray-200 bg-white text-black" id="success-stories" ref={sectionRef} aria-labelledby="success-stories-heading">
      <div className="mx-auto max-w-[1500px] px-6 pb-20 pt-16 text-center sm:px-10 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className={`mb-5 inline-flex items-center gap-2 ${revealClass}`} style={{ opacity: 0, animationDelay: "0.1s" }}>
          <span className="h-px w-6 bg-blue-600" aria-hidden="true" />
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-blue-700">Selected success stories</span>
          <span className="h-px w-6 bg-blue-600" aria-hidden="true" />
        </div>

        <h2 className={`success-section-heading mb-4 text-4xl leading-[1.04] tracking-tight sm:text-5xl lg:text-[56px] ${revealClass}`} id="success-stories-heading" style={{ opacity: 0, animationDelay: "0.2s" }}>
          <span className="block">Proof that runs</span>
          <span className="block">in production.</span>
        </h2>

        <p className={`mx-auto mb-5 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl ${revealClass}`} style={{ opacity: 0, animationDelay: "0.3s" }}>
          From lakehouse modernization and production AI to resilient platforms and automated operations, see what changes when engineering is tied to the outcome.
        </p>

        <a className={`mb-10 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${revealClass}`} href="https://aciinfotech.com/case-studies" style={{ opacity: 0, animationDelay: "0.4s" }}>
          Explore all success stories
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <div className={`success-story-tabs-shell ${revealClass}`} style={{ opacity: 0, animationDelay: "0.5s" }}>
          <div className="success-story-tabs" role="tablist" aria-label="Featured success stories">
            {successStories.map(({ id, tabLabel, icon: Icon }, index) => (
              <button
                className={`success-story-tab ${activeStoryIndex === index ? "is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeStoryIndex === index}
                aria-controls={`success-story-${id}`}
                onClick={() => showStory(index)}
                key={id}
              >
                <Icon aria-hidden="true" />
                <span>{tabLabel}</span>
                {activeStoryIndex === index && !reducedMotion && (
                  <span className="story-tab-progress" key={`${id}-${progressCycle}`} style={{ animationPlayState: isPaused ? "paused" : "running" }} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`success-story-stage relative mx-auto w-full overflow-hidden bg-gray-950 ${revealClass}`}
          style={{ opacity: 0, animationDelay: "0.6s" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setProgressCycle((value) => value + 1);
          }}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
              setProgressCycle((value) => value + 1);
            }
          }}
          aria-live="polite"
        >
          {successStories.map((story, index) => (
            <video
              className={`success-story-video ${index === activeStoryIndex ? "is-active" : ""} ${index === previousStoryIndex ? "is-previous" : ""}`}
              ref={(element) => { videoRefs.current[index] = element; }}
              autoPlay={index === 0}
              loop
              muted
              playsInline
              preload={index === 0 ? "auto" : "metadata"}
              aria-hidden="true"
              key={story.id}
            >
              <source src={story.video} type="video/mp4" />
            </video>
          ))}

          <div className="success-story-scrim absolute inset-0" aria-hidden="true" />

          {previousStory && <SuccessStoryCard story={previousStory} state="leaving" key={`previous-${previousStory.id}`} />}
          <div id={`success-story-${activeStory.id}`} role="tabpanel">
            <SuccessStoryCard story={activeStory} state="entering" key={`active-${activeStory.id}`} />
          </div>

          <span className="success-story-counter" aria-hidden="true">
            {String(activeStoryIndex + 1).padStart(2, "0")} / {String(successStories.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ reducedMotion }) {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isServicePaused, setIsServicePaused] = useState(false);
  const [serviceCycle, setServiceCycle] = useState(0);
  const activeService = servicePillars[activeServiceIndex];

  useEffect(() => {
    if (reducedMotion || isServicePaused) return undefined;
    const timer = window.setTimeout(() => {
      setActiveServiceIndex((index) => (index + 1) % servicePillars.length);
      setServiceCycle((cycle) => cycle + 1);
    }, 7200);
    return () => window.clearTimeout(timer);
  }, [activeServiceIndex, isServicePaused, reducedMotion]);

  function chooseService(index) {
    setActiveServiceIndex(index);
    setServiceCycle((cycle) => cycle + 1);
  }

  return (
    <section
      className="service-modes-section"
      id="services"
      aria-labelledby="services-heading"
      onMouseEnter={() => setIsServicePaused(true)}
      onMouseLeave={() => setIsServicePaused(false)}
      onFocusCapture={() => setIsServicePaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsServicePaused(false);
      }}
    >
      <div className="service-modes-inner">
        <div className="service-modes-copy">
          <p className="service-modes-eyebrow">How ACI builds</p>
          <h2 id="services-heading">Services</h2>
          <p className="service-modes-intro">
            Four connected disciplines take enterprise systems from foundation to intelligence, modernization, and dependable operation.
          </p>

          <div className="service-mode-tabs" role="tablist" aria-label="ACI service areas">
            {servicePillars.map((service, index) => (
              <button
                className={`service-mode-tab ${activeServiceIndex === index ? "is-active" : ""}`}
                id={`service-tab-${service.id}`}
                type="button"
                role="tab"
                aria-selected={activeServiceIndex === index}
                aria-controls={`service-panel-${service.id}`}
                onClick={() => chooseService(index)}
                onMouseEnter={() => chooseService(index)}
                key={service.id}
              >
                <span className="service-mode-number">0{index + 1}</span>
                <span>{service.label}</span>
                {activeServiceIndex === index && !reducedMotion && (
                  <span
                    className="service-mode-progress"
                    style={{ animationPlayState: isServicePaused ? "paused" : "running" }}
                    key={`${service.id}-${serviceCycle}`}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <article
          className="service-mode-stage"
          id={`service-panel-${activeService.id}`}
          role="tabpanel"
          aria-labelledby={`service-tab-${activeService.id}`}
          key={activeService.id}
        >
          <video className="service-mode-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
            <source src={activeService.video} type="video/mp4" />
          </video>
          <div className="service-mode-wash" aria-hidden="true" />

          <div className="service-mode-stage-content">
            <div className={`service-mode-ecosystem ${activeService.id === "managed-operations" ? "is-managed" : ""} ${activeService.id === "data-engineering" ? "is-data" : ""}`}>
              <span>{activeService.platformLabel}</span>
              <div className="service-platform-logos">
                {activeService.platforms.map((platform) => (
                  <div className={`service-platform-logo ${platform.showName ? "has-name" : ""}`} data-platform={platform.name} style={{ "--platform-scale": platform.scale }} title={platform.name} key={platform.name}>
                    <img src={platform.src} alt={platform.name} />
                    {platform.showName && <span>{platform.name}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="service-mode-message">
              <p>{activeService.label}</p>
              <h3>{activeService.title}</h3>
              <p className="service-mode-description">{activeService.description}</p>

              <ul className="service-mode-capabilities" aria-label={`${activeService.label} capabilities`}>
                {activeService.items.map((item) => (
                  <li key={item}><span aria-hidden="true" />{item}</li>
                ))}
              </ul>

              <a className="service-mode-cta" href={activeService.href}>
                <span><ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                {activeService.cta}
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function EditorialResources() {
  const featured = resourceItems[0];
  const supporting = resourceItems.slice(1);

  return (
    <section className="editorial-resources" id="insights" aria-labelledby="resources-heading">
      <div className="editorial-resources-inner">
        <header className="editorial-resources-header">
          <div>
            <p>News / Insights / Downloads</p>
            <h2 id="resources-heading">What we are learning.<br />What we are shipping.</h2>
          </div>
          <div className="editorial-resources-intro">
            <p>Field notes, architecture perspectives, benchmark research, and company news from the teams doing the work.</p>
            <a href="https://aciinfotech.com/blogs">
              Browse all insights
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </header>

        <div className="editorial-resource-grid">
          <a className="editorial-resource-feature" href={featured.href}>
            <img src={featured.image} alt="A conceptual visualization of governed enterprise AI" />
            <span className="editorial-resource-scrim" aria-hidden="true" />
            <div className="editorial-resource-feature-content">
              <div className="editorial-resource-meta">
                <span>{featured.type}</span>
                <span>{featured.meta}</span>
              </div>
              <h3>{featured.title}</h3>
              <p>{featured.summary}</p>
              <span className="editorial-resource-action">
                Read the insight
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </a>

          <div className="editorial-resource-stack">
            {supporting.map((resource) => (
              <a className={`editorial-resource-item resource-${resource.id}`} href={resource.href} key={resource.id}>
                {resource.image && (
                  <div className="editorial-resource-thumb">
                    <img src={resource.image} alt="" />
                  </div>
                )}
                <div className="editorial-resource-item-content">
                  <div className="editorial-resource-meta">
                    <span>{resource.type}</span>
                    <span>{resource.meta}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <span className="editorial-resource-action">
                    {resource.download ? "View the report" : resource.id === "forbes-india" ? "Read the news" : "Read the insight"}
                    {resource.download ? <Download className="h-5 w-5" aria-hidden="true" /> : <ArrowUpRight className="h-5 w-5" aria-hidden="true" />}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const ACI_MONOGRAM_PATHS = [
  [[-0.78, 0.55], [-0.14, -0.68], [0.5, 0.55]],
  [[-0.78, 0.55], [0.72, 0.08]],
  [[0.72, 0.08], [0.5, 0.55]],
];

const CLOSING_DELTA_PATHS = [
  [[0, -0.68], [-0.72, 0.58], [0.72, 0.58], [0, -0.68]],
  [[0, -0.34], [-0.29, 0.2], [0.29, 0.2], [0, -0.34]],
];

function sampleMonogramPath(points, progress) {
  const segments = [];
  let totalLength = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    segments.push({ start, end, length });
    totalLength += length;
  }

  let distance = clamp01(progress) * totalLength;
  const segment = segments.find((candidate) => {
    if (distance <= candidate.length) return true;
    distance -= candidate.length;
    return false;
  }) ?? segments[segments.length - 1];
  const local = segment.length ? clamp01(distance / segment.length) : 0;

  return {
    x: segment.start[0] + (segment.end[0] - segment.start[0]) * local,
    y: segment.start[1] + (segment.end[1] - segment.start[1]) * local,
    tangentX: segment.end[0] - segment.start[0],
    tangentY: segment.end[1] - segment.start[1],
  };
}

function closingParticleNoise(index, salt = 0) {
  const value = Math.sin((index + 1) * (12.9898 + salt * 37.719)) * 43758.5453;
  return value - Math.floor(value);
}

function createMonogramTarget(index, count) {
  const mainCount = Math.round(count * 0.58);
  const sweepCount = Math.round(count * 0.31);
  const pathIndex = index < mainCount ? 0 : index < mainCount + sweepCount ? 1 : 2;
  const pathStart = pathIndex === 0 ? 0 : pathIndex === 1 ? mainCount : mainCount + sweepCount;
  const pathCount = pathIndex === 0 ? mainCount : pathIndex === 1 ? sweepCount : count - mainCount - sweepCount;
  const pathProgress = (index - pathStart + 0.5) / Math.max(1, pathCount);
  const sample = sampleMonogramPath(ACI_MONOGRAM_PATHS[pathIndex], pathProgress);
  const tangentLength = Math.hypot(sample.tangentX, sample.tangentY) || 1;
  const normalX = -sample.tangentY / tangentLength;
  const normalY = sample.tangentX / tangentLength;
  const spread = closingParticleNoise(index, 1) < 0.9 ? 0.0025 : 0.0065;
  const offset = (closingParticleNoise(index, 2) - 0.5) * spread * 2;

  return [sample.x + normalX * offset, sample.y + normalY * offset, 0.5];
}

function createSphereTarget(index, count) {
  const y = 1 - ((index + 0.5) / count) * 2;
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(angle) * ring, y, Math.sin(angle) * ring];
}

function createDeltaTarget(index, count) {
  const outerCount = Math.round(count * 0.74);
  const pathIndex = index < outerCount ? 0 : 1;
  const pathStart = pathIndex === 0 ? 0 : outerCount;
  const pathCount = pathIndex === 0 ? outerCount : count - outerCount;
  const progress = (index - pathStart + 0.5) / Math.max(1, pathCount);
  const sample = sampleMonogramPath(CLOSING_DELTA_PATHS[pathIndex], progress);
  const tangentLength = Math.hypot(sample.tangentX, sample.tangentY) || 1;
  const normalX = -sample.tangentY / tangentLength;
  const normalY = sample.tangentX / tangentLength;
  const spread = closingParticleNoise(index, 3) < 0.9 ? 0.0028 : 0.007;
  const offset = (closingParticleNoise(index, 4) - 0.5) * spread * 2;
  return [sample.x + normalX * offset, sample.y + normalY * offset, 0.5];
}

function closingParticleCycle(time) {
  const cycle = time % 19;
  if (cycle < 2.8) return { from: "monogram", to: "monogram", mix: 0 };
  if (cycle < 4.8) return { from: "monogram", to: "sphere", mix: (cycle - 2.8) / 2 };
  if (cycle < 6.8) return { from: "sphere", to: "sphere", mix: 0 };
  if (cycle < 8.8) return { from: "sphere", to: "monogram", mix: (cycle - 6.8) / 2 };
  if (cycle < 11) return { from: "monogram", to: "monogram", mix: 0 };
  if (cycle < 13) return { from: "monogram", to: "delta", mix: (cycle - 11) / 2 };
  if (cycle < 14.8) return { from: "delta", to: "delta", mix: 0 };
  if (cycle < 16.8) return { from: "delta", to: "monogram", mix: (cycle - 14.8) / 2 };
  return { from: "monogram", to: "monogram", mix: 0 };
}

function resolveClosingParticle(particle, shape, time, output) {
  if (shape === "sphere") {
    const [baseX, baseY, baseZ] = particle.sphere;
    const yaw = time * 0.48;
    const tilt = 0.22 + Math.sin(time * 0.19) * 0.08;
    const yawX = baseX * Math.cos(yaw) - baseZ * Math.sin(yaw);
    const yawZ = baseX * Math.sin(yaw) + baseZ * Math.cos(yaw);
    const tiltedY = baseY * Math.cos(tilt) - yawZ * Math.sin(tilt);
    const tiltedZ = baseY * Math.sin(tilt) + yawZ * Math.cos(tilt);
    const perspective = 1 / (1 + tiltedZ * 0.2);
    output[0] = yawX * perspective * 0.66;
    output[1] = tiltedY * perspective * 0.66;
    output[2] = clamp01((tiltedZ + 1) * 0.5);
    return;
  }

  const target = shape === "delta" ? particle.delta : particle.monogram;
  const pulse = shape === "delta" ? 1 + Math.sin(time * 0.62) * 0.01 : 1;
  output[0] = target[0] * pulse;
  output[1] = target[1] * pulse;
  output[2] = target[2];
}

function MonogramParticleField({ reducedMotion }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return undefined;

    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = false;
    let particles = [];
    let observer;
    let resizeObserver;
    let cycleStart = performance.now();
    let hasEntered = false;

    function seedParticles() {
      const small = width < 720;
      const count = reducedMotion ? (small ? 400 : 600) : (small ? 800 : 1200);
      particles = Array.from({ length: count }, (_, index) => ({
        monogram: createMonogramTarget(index, count),
        sphere: createSphereTarget(index, count),
        delta: createDeltaTarget(index, count),
        phase: closingParticleNoise(index, 7) * Math.PI * 2,
        flow: closingParticleNoise(index, 8),
        radius: 0.76 + closingParticleNoise(index, 9) * (small ? 1.08 : 1.42),
        alpha: 0.34 + closingParticleNoise(index, 10) * 0.56,
        color: closingParticleNoise(index, 11) < 0.5 ? "#f4f8ff" : closingParticleNoise(index, 11) < 0.8 ? "#003d99" : "#c6ff3d",
      }));
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seedParticles();
      render(performance.now());
    }

    function render(now) {
      const time = reducedMotion ? 0 : Math.max(0, now - cycleStart) * 0.001;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scaleX = width < 620 ? width * 0.52 : Math.min(width * 0.27, 340);
      const scaleY = Math.min(height * 0.72, scaleX);
      const breathe = reducedMotion ? 1 : 1 + Math.sin(time * 0.46) * 0.005;
      const cycle = closingParticleCycle(time);
      const mix = smootherStep(cycle.mix);
      const morphEnergy = cycle.from === cycle.to ? 0 : Math.sin(mix * Math.PI);
      const fromPoint = [0, 0, 0.5];
      const toPoint = [0, 0, 0.5];

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      particles.forEach((particle, index) => {
        resolveClosingParticle(particle, cycle.from, time, fromPoint);
        resolveClosingParticle(particle, cycle.to, time, toPoint);
        const orbit = particle.phase + time * 0.72 + particle.flow * Math.PI * 2;
        const normalizedX = fromPoint[0] + (toPoint[0] - fromPoint[0]) * mix + Math.cos(orbit) * morphEnergy * 0.018;
        const normalizedY = fromPoint[1] + (toPoint[1] - fromPoint[1]) * mix + Math.sin(orbit) * morphEnergy * 0.024;
        const depth = fromPoint[2] + (toPoint[2] - fromPoint[2]) * mix;
        const x = centerX + normalizedX * scaleX * breathe;
        const y = centerY + normalizedY * scaleY * breathe;
        const travelingLight = (Math.sin(time * 1.05 - particle.flow * Math.PI * 2) + 1) * 0.5;
        const pulse = reducedMotion ? 1 : 0.76 + travelingLight * 0.24;
        const depthScale = 0.76 + depth * 0.38;

        context.globalAlpha = particle.alpha * pulse * (0.78 + depth * 0.22);
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(x, y, particle.radius * depthScale, 0, Math.PI * 2);
        context.fill();

        if (index % 31 === 0) {
          context.globalAlpha = particle.alpha * 0.14;
          context.beginPath();
          context.arc(x, y, particle.radius * depthScale * 4, 0, Math.PI * 2);
          context.fill();
        }
      });

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    }

    function animate(now) {
      frame = 0;
      if (!visible || document.hidden || reducedMotion) return;
      render(now);
      frame = window.requestAnimationFrame(animate);
    }

    function updateVisibility(entries) {
      const nextVisible = entries[0]?.isIntersecting ?? false;
      if (nextVisible && !hasEntered) {
        cycleStart = performance.now();
        hasEntered = true;
        render(cycleStart);
      }
      visible = nextVisible;
      if (visible && !frame && !reducedMotion && !document.hidden) frame = window.requestAnimationFrame(animate);
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    function handleDocumentVisibility() {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else if (!document.hidden && visible && !frame && !reducedMotion) {
        frame = window.requestAnimationFrame(animate);
      }
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
    } else {
      window.addEventListener("resize", resize, { passive: true });
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(updateVisibility, { rootMargin: "160px 0px", threshold: 0.05 });
      observer.observe(host);
    } else {
      visible = true;
    }

    document.addEventListener("visibilitychange", handleDocumentVisibility);
    resize();
    if (reducedMotion) render(performance.now());
    else if (visible && !frame) frame = window.requestAnimationFrame(animate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
    };
  }, [reducedMotion]);

  return (
    <div className="monogram-particle-field" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

function ClosingCta({ reducedMotion }) {
  return (
    <section className="monogram-cta" aria-labelledby="monogram-cta-heading">
      <h2 className="sr-only" id="monogram-cta-heading">Start a conversation with ACI Infotech</h2>
      <MonogramParticleField reducedMotion={reducedMotion} />
      <a className="monogram-cta-button" href="https://aciinfotech.com/contact">
        <Coffee className="h-5 w-5" aria-hidden="true" />
        Let's Talk Over a Coffee
      </a>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <a href="#" aria-label="ACI Infotech home">
              <img src="/assets/aci-infotech-logo-white.png" alt="ACI Infotech" />
            </a>
            <p>We design, build, and run production data platforms, cloud infrastructure, AI systems, and managed operations.</p>
            <span>We build them. We ship them. We run them.</span>
          </div>

          <nav className="site-footer-nav" aria-label="Footer navigation">
            <div>
              <h3>Services</h3>
              <a href="https://aciinfotech.com/services/data-engineering">Data Engineering</a>
              <a href="https://aciinfotech.com/services/applied-ai-ml">Applied AI & ML</a>
              <a href="https://aciinfotech.com/services/cloud-modernization">Cloud Modernization</a>
              <a href="https://aciinfotech.com/services/managed-operations">Managed Operations</a>
            </div>
            <div>
              <h3>Work</h3>
              <a href="https://aciinfotech.com/case-studies">Case Studies</a>
              <a href="https://aciinfotech.com/playbooks">Playbooks</a>
              <a href="https://aciinfotech.com/whitepapers">Whitepapers</a>
              <a href="https://aciinfotech.com/blogs">Insights</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="https://aciinfotech.com/about">About ACI</a>
              <a href="https://aciinfotech.com/careers">Careers</a>
              <a href="https://aciinfotech.com/news">News & Press</a>
              <a href="https://aciinfotech.com/contact">Contact</a>
            </div>
          </nav>
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 ACI Infotech, Inc.</p>
          <div className="site-footer-assurance" aria-label="Compliance frameworks">
            <span>SOC 2</span>
            <span>ISO 27001</span>
            <span>HIPAA</span>
            <span>GDPR</span>
          </div>
          <div className="site-footer-legal">
            <a href="https://aciinfotech.com/privacy">Privacy</a>
            <a href="https://aciinfotech.com/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = slides[active];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return undefined;
    const restoreHash = () => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    };
    const frame = window.requestAnimationFrame(restoreHash);
    const timer = window.setTimeout(restoreHash, 500);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActive((value) => (value + 1) % slides.length);
    }, 10500);
    return () => window.clearTimeout(timer);
  }, [active, reducedMotion]);

  const keyedSlide = useMemo(() => `${slide.theme}-${active}`, [active, slide.theme]);

  function go(delta) {
    setDirection(delta);
    setActive((value) => (value + delta + slides.length) % slides.length);
  }

  return (
    <main className={`page scene-${slide.theme}`}>
      <section className="hero" aria-label="ACI Infotech hero">
        <video className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/assets/pexels-waving-blue-particles-12920671.mp4" type="video/mp4" />
        </video>
        <div className="glass-wash" aria-hidden="true" />
        <div className="scene-signal" key={`signal-${active}`} aria-hidden="true" />

        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#" aria-label="ACI Infotech home">
            <img src="/assets/aci-infotech-logo-white.png" alt="ACI Infotech" />
          </a>
          <div className="nav-links" aria-label="Sections">
            {navItems.map((item) => (
              <a href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
                {item}
              </a>
            ))}
          </div>
          <a className="nav-cta" href="#contact">Get in touch</a>
        </nav>

        <button className="scene-arrow prev" type="button" onClick={() => go(-1)} aria-label="Previous hero scene">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5.5 8 12l6.5 6.5M8.7 12H19" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="scene-arrow next" type="button" onClick={() => go(1)} aria-label="Next hero scene">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9.5 5.5 16 12l-6.5 6.5M15.3 12H5" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="hero-grid">
          <div className={`copy-panel ${direction < 0 ? "from-left" : "from-right"}`} key={keyedSlide}>
            <h1 aria-label={slide.headline.join(" ")}>
              {slide.headline.map((line, index) => (
                <span className={`glass-line ${index === 1 ? "is-refractive" : ""}`} aria-hidden="true" key={line}>
                  <span className="glass-line-text">{line}</span>
                  <span className="glass-line-flare" aria-hidden="true">{line}</span>
                </span>
              ))}
            </h1>
            <p className="subcopy">{slide.subcopy}</p>
            <SceneSupport slide={slide} />
            <a className="primary-cta" href={slide.ctaUrl}>
              <span>{slide.ctaText}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="visual-field">
            <MagicDustStage slide={slide} activeIndex={active} reducedMotion={reducedMotion} />
          </div>
        </div>

        <PartnerRail />

        <div className="slide-dots" aria-label="Hero scenes">
          {slides.map((item, index) => (
            <button
              key={item.theme}
              className={index === active ? "is-active" : ""}
              type="button"
              onClick={() => {
                setDirection(index > active ? 1 : -1);
                setActive(index);
              }}
              aria-label={`Show ${item.theme} scene`}
            />
          ))}
        </div>
      </section>
      <ClientField reducedMotion={reducedMotion} />
      <PlaybooksSection reducedMotion={reducedMotion} />
      <StellarSection reducedMotion={reducedMotion} />
      <ServicesSection reducedMotion={reducedMotion} />
      <EditorialResources />
      <ClosingCta reducedMotion={reducedMotion} />
      <SiteFooter />
    </main>
  );
}

export default App;

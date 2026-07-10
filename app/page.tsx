"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  BadgeInfo,
  CirclePause,
  Crosshair,
  Eye,
  EyeOff,
  Gauge,
  Grid3X3,
  Minus,
  MousePointer2,
  Orbit,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Tag,
  Telescope,
} from "lucide-react";

type BodyId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

type ViewMode = "system" | "inner" | "outer" | "earth";

type PlanetData = {
  id: Exclude<BodyId, "sun">;
  name: string;
  color: string;
  accent: string;
  radius: number;
  distance: number;
  periodDays: number;
  rotationHours: number;
  axialTilt: number;
  inclination: number;
  eccentricity: number;
  phase: number;
  diameter: string;
  distanceLabel: string;
  temperature: string;
  moons: string;
  year: string;
  note: string;
};

const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: "Merkür",
    color: "#887d73",
    accent: "#d7c7b9",
    radius: 0.25,
    distance: 7,
    periodDays: 87.97,
    rotationHours: 1407.6,
    axialTilt: 0.03,
    inclination: 7,
    eccentricity: 0.2056,
    phase: 0.3,
    diameter: "4,879 km",
    distanceLabel: "0.39 AU",
    temperature: "167 °C",
    moons: "0",
    year: "88 gün",
    note: "Güneş çevresindeki turunu yalnızca 88 Dünya gününde tamamlayan en hızlı gezegen.",
  },
  {
    id: "venus",
    name: "Venüs",
    color: "#b98245",
    accent: "#f4d08a",
    radius: 0.42,
    distance: 9.7,
    periodDays: 224.7,
    rotationHours: -5832.5,
    axialTilt: 177.4,
    inclination: 3.39,
    eccentricity: 0.0068,
    phase: 1.45,
    diameter: "12,104 km",
    distanceLabel: "0.72 AU",
    temperature: "464 °C",
    moons: "0",
    year: "225 gün",
    note: "Yoğun bulutlarla sarılı, yavaş ve ters yönde dönen parlak bir dünya.",
  },
  {
    id: "earth",
    name: "Dünya",
    color: "#2e6fa7",
    accent: "#68c7b6",
    radius: 0.46,
    distance: 13,
    periodDays: 365.256,
    rotationHours: 23.934,
    axialTilt: 23.44,
    inclination: 0,
    eccentricity: 0.0167,
    phase: 2.42,
    diameter: "12,742 km",
    distanceLabel: "1.00 AU",
    temperature: "15 °C",
    moons: "1",
    year: "365,26 gün",
    note: "Gerçek yörünge süresi ve eksen eğikliğiyle gösterilen mavi gezegenimiz.",
  },
  {
    id: "mars",
    name: "Mars",
    color: "#a8442f",
    accent: "#e9825a",
    radius: 0.32,
    distance: 16.9,
    periodDays: 686.98,
    rotationHours: 24.623,
    axialTilt: 25.19,
    inclination: 1.85,
    eccentricity: 0.0934,
    phase: 4.1,
    diameter: "6,779 km",
    distanceLabel: "1.52 AU",
    temperature: "−65 °C",
    moons: "2",
    year: "687 gün",
    note: "İç gezegenlerin daha eliptik yörüngelerinden birini izleyen soğuk bir çöl dünyası.",
  },
  {
    id: "jupiter",
    name: "Jüpiter",
    color: "#b89172",
    accent: "#efd2a8",
    radius: 1.3,
    distance: 23.5,
    periodDays: 4332.59,
    rotationHours: 9.925,
    axialTilt: 3.13,
    inclination: 1.3,
    eccentricity: 0.0489,
    phase: 5.05,
    diameter: "139,820 km",
    distanceLabel: "5.20 AU",
    temperature: "−110 °C",
    moons: "95",
    year: "11,86 yıl",
    note: "On saatten kısa sürede kendi çevresinde dönen, sistemin en büyük gezegeni.",
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "#c6ad72",
    accent: "#f4e2a9",
    radius: 1.08,
    distance: 30.5,
    periodDays: 10759.22,
    rotationHours: 10.7,
    axialTilt: 26.73,
    inclination: 2.49,
    eccentricity: 0.0565,
    phase: 0.92,
    diameter: "116,460 km",
    distanceLabel: "9.58 AU",
    temperature: "−140 °C",
    moons: "146",
    year: "29,45 yıl",
    note: "Milyarlarca buz ve kaya parçasından oluşan halkalarla çevrili soluk bir gaz devi.",
  },
  {
    id: "uranus",
    name: "Uranus",
    color: "#70b9c2",
    accent: "#b9eef0",
    radius: 0.74,
    distance: 37,
    periodDays: 30688.5,
    rotationHours: -17.24,
    axialTilt: 97.77,
    inclination: 0.77,
    eccentricity: 0.0457,
    phase: 2.82,
    diameter: "50,724 km",
    distanceLabel: "19.2 AU",
    temperature: "−195 °C",
    moons: "28",
    year: "84 yıl",
    note: "Muhtemelen kadim bir çarpışmanın ardından yan yatmış halde dönen bir buz devi.",
  },
  {
    id: "neptune",
    name: "Neptün",
    color: "#3159bd",
    accent: "#6f97ff",
    radius: 0.71,
    distance: 43.5,
    periodDays: 60182,
    rotationHours: 16.11,
    axialTilt: 28.32,
    inclination: 1.77,
    eccentricity: 0.0113,
    phase: 4.72,
    diameter: "49,244 km",
    distanceLabel: "30.05 AU",
    temperature: "−200 °C",
    moons: "16",
    year: "164,8 yıl",
    note: "Rüzgârların saatte 2.000 kilometreyi aşabildiği uzak, mavi bir dünya.",
  },
];

const BODY_INFO: Record<BodyId, {
  name: string;
  eyebrow: string;
  diameter: string;
  distanceLabel: string;
  temperature: string;
  moons: string;
  year: string;
  note: string;
}> = {
  sun: {
    name: "Güneş",
    eyebrow: "G2V ana kol yıldızı",
    diameter: "1.39M km",
    distanceLabel: "Sistem merkezi",
    temperature: "5.500 °C",
    moons: "8 gezegen",
    year: "25,4 günlük dönüş",
    note: "Güneş Sistemi kütlesinin %99,86’sını taşıyan yıldızımız, buradaki her yörüngeyi yönetir.",
  },
  ...Object.fromEntries(
    PLANETS.map((planet) => [
      planet.id,
      {
        name: planet.name,
        eyebrow: `Güneş’ten ${planet.distanceLabel} uzaklıkta`,
        diameter: planet.diameter,
        distanceLabel: planet.distanceLabel,
        temperature: planet.temperature,
        moons: planet.moons,
        year: planet.year,
        note: planet.note,
      },
    ]),
  ) as Record<Exclude<BodyId, "sun">, {
    name: string;
    eyebrow: string;
    diameter: string;
    distanceLabel: string;
    temperature: string;
    moons: string;
    year: string;
    note: string;
  }>,
};

const EPOCH = Date.UTC(2026, 6, 10, 12, 0, 0);
const COMMEMORATION_DATE = Date.UTC(2081, 4, 19, 0, 0, 0);
const COMMEMORATION_DAY = (COMMEMORATION_DATE - EPOCH) / 86_400_000;
const TAU = Math.PI * 2;
const ORBIT_AXIS = new THREE.Vector3(1, 0, 0);

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function solveEccentricAnomaly(mean: number, eccentricity: number) {
  let eccentric = mean;
  for (let i = 0; i < 5; i += 1) {
    eccentric -=
      (eccentric - eccentricity * Math.sin(eccentric) - mean) /
      (1 - eccentricity * Math.cos(eccentric));
  }
  return eccentric;
}

function orbitPosition(planet: PlanetData, elapsedDays: number) {
  const mean = (planet.phase + (elapsedDays / planet.periodDays) * TAU) % TAU;
  const eccentric = solveEccentricAnomaly(mean, planet.eccentricity);
  const x = planet.distance * (Math.cos(eccentric) - planet.eccentricity);
  const z =
    planet.distance *
    Math.sqrt(1 - planet.eccentricity * planet.eccentricity) *
    Math.sin(eccentric);
  return new THREE.Vector3(x, 0, z).applyAxisAngle(
    ORBIT_AXIS,
    THREE.MathUtils.degToRad(planet.inclination),
  );
}

function createSurfaceTexture(planet: PlanetData) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const random = seeded(planet.name.length * 9187);

  context.fillStyle = planet.color;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (["jupiter", "saturn", "uranus", "neptune", "venus"].includes(planet.id)) {
    for (let y = 0; y < canvas.height; y += 9 + Math.floor(random() * 12)) {
      context.globalAlpha = 0.08 + random() * 0.22;
      context.fillStyle = random() > 0.45 ? planet.accent : "#3b2b2d";
      context.fillRect(0, y, canvas.width, 3 + random() * 12);
    }
    if (planet.id === "jupiter") {
      context.globalAlpha = 0.48;
      context.fillStyle = "#a04f3c";
      context.beginPath();
      context.ellipse(370, 158, 34, 15, -0.14, 0, TAU);
      context.fill();
    }
  } else {
    for (let i = 0; i < (planet.id === "earth" ? 65 : 130); i += 1) {
      const x = random() * canvas.width;
      const y = random() * canvas.height;
      const width = 4 + random() * (planet.id === "earth" ? 42 : 16);
      const height = 2 + random() * (planet.id === "earth" ? 19 : 12);
      context.globalAlpha = 0.12 + random() * 0.34;
      context.fillStyle = planet.id === "earth" ? planet.accent : planet.accent;
      context.beginPath();
      context.ellipse(x, y, width, height, random() * Math.PI, 0, TAU);
      context.fill();
    }
  }

  context.globalAlpha = 0.12;
  for (let y = 0; y < canvas.height; y += 2) {
    context.fillStyle = y % 4 === 0 ? "#ffffff" : "#000000";
    context.fillRect(0, y, canvas.width, 1);
  }
  context.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createSunTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const random = seeded(404);
  context.fillStyle = "#ffb34c";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 1600; i += 1) {
    context.globalAlpha = 0.05 + random() * 0.13;
    context.fillStyle = random() > 0.45 ? "#fff4bd" : "#e85d25";
    context.beginPath();
    context.arc(random() * 512, random() * 256, 1 + random() * 8, 0, TAU);
    context.fill();
  }
  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(128, 128, 5, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,244,200,1)");
  gradient.addColorStop(0.2, "rgba(255,181,76,.72)");
  gradient.addColorStop(0.48, "rgba(255,112,38,.2)");
  gradient.addColorStop(1, "rgba(255,85,20,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function createLabelTexture(name: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.beginPath();
  context.arc(24, 46, 5, 0, TAU);
  context.fill();
  context.font = "600 32px Arial";
  context.letterSpacing = "5px";
  context.fillStyle = "rgba(231,240,255,.92)";
  context.fillText(name.toUpperCase(), 47, 57);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function formatSpeed(speed: number) {
  if (speed < 1) return `${speed.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}×`;
  if (speed < 10) return `${speed.toFixed(1).replace(".0", "")}×`;
  return `${Math.round(speed).toLocaleString("tr-TR")}×`;
}

function formatDate(elapsedDays: number) {
  const date = new Date(EPOCH + elapsedDays * 86_400_000);
  const year = date.getUTCFullYear();
  const month = date.toLocaleString("tr-TR", { month: "short", timeZone: "UTC" });
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} · ${hour}:${minute} UTC`;
}

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(8);
  const playingRef = useRef(true);
  const focusBodyRef = useRef<(body: BodyId) => void>(() => undefined);
  const viewRef = useRef<(view: ViewMode) => void>(() => undefined);
  const orbitVisibilityRef = useRef<(visible: boolean) => void>(() => undefined);
  const labelVisibilityRef = useRef<(visible: boolean) => void>(() => undefined);
  const gridVisibilityRef = useRef<(visible: boolean) => void>(() => undefined);
  const resetTimeRef = useRef<() => void>(() => undefined);
  const jumpToCommemorationRef = useRef<() => void>(() => undefined);

  const [selected, setSelected] = useState<BodyId>("earth");
  const [playing, setPlaying] = useState(true);
  const [speedExponent, setSpeedExponent] = useState(3);
  const [simDate, setSimDate] = useState(formatDate(0));
  const [viewMode, setViewMode] = useState<ViewMode>("system");
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [commemorationVisible, setCommemorationVisible] = useState(false);

  const speed = useMemo(() => 2 ** speedExponent, [speedExponent]);
  const selectedInfo = BODY_INFO[selected];

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const applyView = useCallback((view: ViewMode) => {
    setViewMode(view);
    viewRef.current(view);
  }, []);

  const focusBody = useCallback((body: BodyId) => {
    setSelected(body);
    focusBodyRef.current(body);
  }, []);

  const changeSpeed = useCallback((delta: number) => {
    setSpeedExponent((current) => Math.max(-2, Math.min(12, current + delta)));
  }, []);

  const resetSimulation = useCallback(() => {
    resetTimeRef.current();
    setSimDate(formatDate(0));
    setSpeedExponent(3);
    setPlaying(true);
    setCommemorationVisible(false);
    applyView("system");
  }, [applyView]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying((current) => !current);
      }
      if (event.key === "ArrowRight") changeSpeed(1);
      if (event.key === "ArrowLeft") changeSpeed(-1);
      if (event.key.toLowerCase() === "r") resetSimulation();
      if (event.key.toLowerCase() === "f") focusBody(selected);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeSpeed, focusBody, resetSimulation, selected]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03050a);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.08, 420);
    camera.position.set(0, 24, 45);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = "space-canvas";
    renderer.domElement.setAttribute("aria-label", "Güneş Sistemi’nin etkileşimli üç boyutlu modeli");
    renderer.domElement.setAttribute("role", "img");
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.rotateSpeed = 0.42;
    controls.zoomSpeed = 0.72;
    controls.minDistance = 4.5;
    controls.maxDistance = 110;
    controls.target.set(0, 0, 0);

    const world = new THREE.Group();
    world.rotation.z = -0.035;
    scene.add(world);

    scene.add(new THREE.AmbientLight(0x263853, 0.22));
    const solarLight = new THREE.PointLight(0xffd5a0, 230, 160, 1.4);
    world.add(solarLight);

    const sunTexture = createSunTexture();
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(2.25, 56, 36), sunMaterial);
    sun.userData.bodyId = "sun" satisfies BodyId;
    world.add(sun);

    const glowTexture = createGlowTexture();
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xffa24b,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.82,
      }),
    );
    glow.scale.set(12.5, 12.5, 1);
    world.add(glow);

    const orbitGroup = new THREE.Group();
    world.add(orbitGroup);
    const labelSprites: THREE.Sprite[] = [];

    const polarGrid = new THREE.PolarGridHelper(50, 16, 12, 96, 0x172c3f, 0x10202e);
    const polarMaterial = polarGrid.material as THREE.LineBasicMaterial;
    polarMaterial.transparent = true;
    polarMaterial.opacity = 0.27;
    polarGrid.visible = false;
    world.add(polarGrid);

    const planetGroups = new Map<BodyId, THREE.Group>();
    const planetMeshes: THREE.Object3D[] = [sun];
    const rotatingMeshes: Array<{ mesh: THREE.Mesh; speed: number }> = [];

    PLANETS.forEach((planet) => {
      const orbitPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 220; i += 1) {
        const eccentric = (i / 220) * TAU;
        const point = new THREE.Vector3(
          planet.distance * (Math.cos(eccentric) - planet.eccentricity),
          0,
          planet.distance * Math.sqrt(1 - planet.eccentricity ** 2) * Math.sin(eccentric),
        ).applyAxisAngle(ORBIT_AXIS, THREE.MathUtils.degToRad(planet.inclination));
        orbitPoints.push(point);
      }
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: planet.id === "earth" ? 0x3ba3ca : 0x405260,
        transparent: true,
        opacity: planet.id === "earth" ? 0.42 : 0.22,
      });
      orbitGroup.add(new THREE.Line(orbitGeometry, orbitMaterial));

      const group = new THREE.Group();
      const texture = createSurfaceTexture(planet);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: planet.id === "earth" ? 0.7 : 0.88,
        metalness: 0,
      });
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius, 42, 28),
        material,
      );
      mesh.rotation.z = THREE.MathUtils.degToRad(planet.axialTilt);
      mesh.userData.bodyId = planet.id;
      group.add(mesh);
      planetMeshes.push(mesh);
      rotatingMeshes.push({
        mesh,
        speed: planet.rotationHours === 0 ? 0 : 0.6 / planet.rotationHours,
      });

      if (planet.id === "earth") {
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(planet.radius * 1.055, 32, 24),
          new THREE.MeshBasicMaterial({
            color: 0x72c7ff,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide,
          }),
        );
        group.add(atmosphere);
      }

      if (planet.id === "saturn") {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(planet.radius * 1.28, planet.radius * 2.15, 96),
          new THREE.MeshBasicMaterial({
            color: 0xd9c18b,
            transparent: true,
            opacity: 0.65,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.rotation.z = THREE.MathUtils.degToRad(planet.axialTilt);
        ring.userData.bodyId = planet.id;
        group.add(ring);
        planetMeshes.push(ring);
      }

      const labelTexture = createLabelTexture(planet.name, planet.accent);
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: labelTexture,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          opacity: 0.88,
        }),
      );
      label.scale.set(3.9, 0.73, 1);
      label.position.set(1.7, planet.radius + 0.88, 0);
      group.add(label);
      labelSprites.push(label);
      world.add(group);
      planetGroups.set(planet.id, group);
    });

    const sunLabel = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: createLabelTexture("Güneş", "#ffb45f"),
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    );
    sunLabel.scale.set(3.2, 0.6, 1);
    sunLabel.position.set(2.6, 2.95, 0);
    world.add(sunLabel);
    labelSprites.push(sunLabel);

    const starRandom = seeded(1997);
    const starPositions = new Float32Array(11_000 * 3);
    const starColors = new Float32Array(11_000 * 3);
    const warm = new THREE.Color();
    for (let i = 0; i < 11_000; i += 1) {
      const radius = 90 + starRandom() * 220;
      const theta = starRandom() * TAU;
      const phi = Math.acos(2 * starRandom() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      warm.setHSL(0.52 + (starRandom() - 0.5) * 0.15, 0.25 + starRandom() * 0.35, 0.62 + starRandom() * 0.32);
      starColors[i * 3] = warm.r;
      starColors[i * 3 + 1] = warm.g;
      starColors[i * 3 + 2] = warm.b;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.28,
        transparent: true,
        opacity: 0.88,
        vertexColors: true,
        sizeAttenuation: true,
        depthWrite: false,
      }),
    );
    scene.add(stars);

    const dustPositions = new Float32Array(2600 * 3);
    for (let i = 0; i < 2600; i += 1) {
      const angle = starRandom() * TAU;
      const radius = 75 + starRandom() * 170;
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = (starRandom() - 0.5) * 16;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0x6d83ac,
        size: 0.33,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    );
    dust.rotation.z = 0.42;
    scene.add(dust);

    const cameraGoal = {
      position: new THREE.Vector3(0, 24, 45),
      target: new THREE.Vector3(0, 0, 0),
      active: false,
    };

    const setCameraGoal = (position: THREE.Vector3, target: THREE.Vector3) => {
      cameraGoal.position.copy(position);
      cameraGoal.target.copy(target);
      cameraGoal.active = true;
    };

    focusBodyRef.current = (body) => {
      if (body === "sun") {
        setCameraGoal(new THREE.Vector3(6.8, 5.1, 7.8), new THREE.Vector3());
        return;
      }
      const group = planetGroups.get(body);
      const data = PLANETS.find((planet) => planet.id === body);
      if (!group || !data) return;
      const bodyPosition = group.position.clone();
      const distance = Math.max(3.2, data.radius * 5.3);
      const cameraOffset = new THREE.Vector3(distance, distance * 0.58, distance * 0.92);
      setCameraGoal(bodyPosition.clone().add(cameraOffset), bodyPosition);
    };

    viewRef.current = (view) => {
      if (view === "system") {
        setCameraGoal(new THREE.Vector3(0, 25, 46), new THREE.Vector3());
      } else if (view === "inner") {
        setCameraGoal(new THREE.Vector3(1, 13, 23), new THREE.Vector3());
      } else if (view === "outer") {
        setCameraGoal(new THREE.Vector3(-5, 35, 63), new THREE.Vector3());
      } else {
        focusBodyRef.current("earth");
      }
    };
    orbitVisibilityRef.current = (visible) => { orbitGroup.visible = visible; };
    labelVisibilityRef.current = (visible) => { labelSprites.forEach((label) => { label.visible = visible; }); };
    gridVisibilityRef.current = (visible) => { polarGrid.visible = visible; };

    let simulatedDays = 0;
    let commemorationTriggered = false;
    resetTimeRef.current = () => {
      simulatedDays = 0;
      commemorationTriggered = false;
      setCommemorationVisible(false);
    };
    jumpToCommemorationRef.current = () => {
      simulatedDays = COMMEMORATION_DAY;
      commemorationTriggered = true;
      setCommemorationVisible(true);
    };
    let lastFrame = performance.now();
    let lastUiUpdate = 0;
    let frame = 0;
    let animationFrame = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPoint: { x: number; y: number } | null = null;

    const onPointerDown = (event: PointerEvent) => {
      downPoint = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!downPoint || Math.hypot(event.clientX - downPoint.x, event.clientY - downPoint.y) > 6) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(planetMeshes, false)[0];
      const body = hit?.object.userData.bodyId as BodyId | undefined;
      if (body) {
        setSelected(body);
        focusBodyRef.current(body);
      }
      downPoint = null;
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", resize);
    resize();

    const animate = (now: number) => {
      const deltaSeconds = Math.min((now - lastFrame) / 1000, 0.08);
      lastFrame = now;
      if (playingRef.current) simulatedDays += deltaSeconds * speedRef.current;
      if (!commemorationTriggered && simulatedDays >= COMMEMORATION_DAY) {
        commemorationTriggered = true;
        setCommemorationVisible(true);
      }

      PLANETS.forEach((planet) => {
        const group = planetGroups.get(planet.id);
        if (group) group.position.copy(orbitPosition(planet, simulatedDays));
      });
      rotatingMeshes.forEach(({ mesh, speed: rotationSpeed }) => {
        mesh.rotation.y += deltaSeconds * rotationSpeed * speedRef.current;
      });
      sun.rotation.y += deltaSeconds * 0.025;
      glow.material.rotation += deltaSeconds * 0.008;
      stars.rotation.y += deltaSeconds * 0.00035;
      dust.rotation.y -= deltaSeconds * 0.00018;

      if (cameraGoal.active) {
        camera.position.lerp(cameraGoal.position, 0.045);
        controls.target.lerp(cameraGoal.target, 0.055);
        if (
          camera.position.distanceTo(cameraGoal.position) < 0.08 &&
          controls.target.distanceTo(cameraGoal.target) < 0.05
        ) cameraGoal.active = false;
      }

      controls.update();
      renderer.render(scene, camera);

      if (now - lastUiUpdate > 180) {
        setSimDate(formatDate(simulatedDays));
        lastUiUpdate = now;
      }
      frame += 1;
      if (frame === 2) setIsReady(true);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose();
            material.dispose();
          });
        }
      });
      glowTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <main className="observatory-shell">
      <div ref={mountRef} className="universe-stage" />
      <div className="nebula-wash" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <section
        className={`commemoration ${commemorationVisible ? "is-visible" : ""}`}
        aria-hidden={!commemorationVisible}
        aria-live="polite"
      >
        <div className="commemoration-aura" aria-hidden="true" />
        <img
          className="ataturk-portrait"
          src="/ataturk-kocatepe.jpg"
          alt="Kocatepe’de Büyük Taarruz’u yöneten Mustafa Kemal Atatürk"
        />
        <div className="commemoration-copy">
          <span className="commemoration-kicker">162 yıl sonra · yıldızların arasında</span>
          <p className="commemoration-date"><strong>19 MAYIS</strong><span>2081</span></p>
          <h2>Bağımsızlık meşalesi<br />gökyüzünü aydınlatıyor.</h2>
          <p className="commemoration-subtitle">Atatürk’ü Anma, Gençlik ve Spor Bayramı</p>
          <small>Fotoğraf: Etem Tem · Genelkurmay Arşivi · Kamu malı</small>
        </div>
      </section>

      <header className="topbar glass-panel">
        <div className="brand-lockup">
          <span className="brand-mark"><Orbit size={21} strokeWidth={1.7} /></span>
          <div>
            <span className="brand-name">HELIOS</span>
            <span className="brand-subtitle">Güneş gözlemevi</span>
          </div>
        </div>

        <nav className="view-switcher" aria-label="Kamera görünümleri">
          {([
            ["system", "Sistem"],
            ["inner", "İç"],
            ["outer", "Dış"],
            ["earth", "Dünya"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={viewMode === id ? "active" : ""}
              onClick={() => applyView(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="telemetry-status">
          <span className="live-dot" />
          <span>Model canlı</span>
          <span className="telemetry-divider" />
          <span>9 gök cismi</span>
        </div>
      </header>

      <aside className="body-inspector glass-panel" aria-label="Seçili gök cismi">
        <div className="panel-kicker">
          <span>İzlenen hedef</span>
          <Crosshair size={14} />
        </div>
        <div className="body-heading">
          <span className={`body-orb body-orb--${selected}`} />
          <div>
            <h1>{selectedInfo.name}</h1>
            <p>{selectedInfo.eyebrow}</p>
          </div>
        </div>
        <p className="body-description">{selectedInfo.note}</p>
        <div className="stat-grid">
          <div><span>Çap</span><strong>{selectedInfo.diameter}</strong></div>
          <div><span>Ort. uzaklık</span><strong>{selectedInfo.distanceLabel}</strong></div>
          <div><span>Ort. sıcaklık</span><strong>{selectedInfo.temperature}</strong></div>
          <div><span>Uydular</span><strong>{selectedInfo.moons}</strong></div>
        </div>
        <div className="year-row">
          <span>Yörünge süresi</span>
          <strong>{selectedInfo.year}</strong>
        </div>
        <div className="body-strip" aria-label="Gök cismi seç">
          {(["sun", ...PLANETS.map((planet) => planet.id)] as BodyId[]).map((body) => (
            <button
              key={body}
              type="button"
              className={body === selected ? "selected" : ""}
              aria-label={`${BODY_INFO[body].name} üzerine odaklan`}
              title={BODY_INFO[body].name}
              onClick={() => focusBody(body)}
            >
              <span className={`mini-orb mini-orb--${body}`} />
            </button>
          ))}
        </div>
      </aside>

      <aside className="layers-panel glass-panel" aria-label="Görselleştirme kontrolleri">
        <div className="panel-kicker">
          <span>Görsel alan</span>
          <Telescope size={14} />
        </div>
        <button
          type="button"
          className={`layer-row ${showOrbits ? "enabled" : ""}`}
          onClick={() => {
            const next = !showOrbits;
            setShowOrbits(next);
            orbitVisibilityRef.current(next);
          }}
        >
          <span><Orbit size={16} /> Yörünge yolları</span>
          {showOrbits ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          type="button"
          className={`layer-row ${showLabels ? "enabled" : ""}`}
          onClick={() => {
            const next = !showLabels;
            setShowLabels(next);
            labelVisibilityRef.current(next);
          }}
        >
          <span><Tag size={16} /> Gök cismi etiketleri</span>
          {showLabels ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          type="button"
          className={`layer-row ${showGrid ? "enabled" : ""}`}
          onClick={() => {
            const next = !showGrid;
            setShowGrid(next);
            gridVisibilityRef.current(next);
          }}
        >
          <span><Grid3X3 size={16} /> Referans ızgarası</span>
          {showGrid ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <div className="accuracy-note">
          <BadgeInfo size={15} />
          <p>Yörünge süreleri, dışmerkezlik ve eğimler modellenmiştir. Boyut ve uzaklıklar görsel olarak sıkıştırılmıştır.</p>
        </div>
      </aside>

      <section className="time-console glass-panel" aria-label="Zaman kontrolleri">
        <button
          type="button"
          className="play-button"
          aria-label={playing ? "Simülasyonu duraklat" : "Simülasyonu oynat"}
          onClick={() => setPlaying((current) => !current)}
        >
          {playing ? <CirclePause size={22} /> : <Play size={22} fill="currentColor" />}
        </button>

        <div className="date-readout">
          <span>Simülasyon zamanı</span>
          <strong>{simDate}</strong>
        </div>

        <div className="speed-control">
          <div className="speed-meta">
            <span><Gauge size={14} /> Zaman hızı</span>
            <strong>{formatSpeed(speed)}</strong>
          </div>
          <div className="slider-row">
            <button type="button" onClick={() => changeSpeed(-1)} aria-label="Zamanı yavaşlat"><Minus size={15} /></button>
            <input
              aria-label="Simülasyon hızı"
              type="range"
              min="-2"
              max="12"
              step="0.25"
              value={speedExponent}
              onChange={(event) => setSpeedExponent(Number(event.target.value))}
              style={{ "--range-progress": `${((speedExponent + 2) / 14) * 100}%` } as React.CSSProperties}
            />
            <button type="button" onClick={() => changeSpeed(1)} aria-label="Zamanı hızlandır"><Plus size={15} /></button>
          </div>
        </div>

        <button type="button" className="reset-button" onClick={resetSimulation} aria-label="Simülasyonu sıfırla">
          <RotateCcw size={17} />
          <span>Sıfırla</span>
        </button>
      </section>

      <button
        type="button"
        className={`event-jump glass-chip ${commemorationVisible ? "is-active" : ""}`}
        onClick={() => {
          jumpToCommemorationRef.current();
          setPlaying(false);
          setSimDate(formatDate(COMMEMORATION_DAY));
          applyView("system");
        }}
        aria-label="19 Mayıs 2081 anma anına git"
      >
        <span className="event-star">✦</span>
        <span>{commemorationVisible ? "19 MAYIS 2081 · ANMA MODU" : "19 MAYIS 2081’E GİT"}</span>
      </button>

      <div className="interaction-hint glass-chip">
        <MousePointer2 size={14} />
        <span>Döndürmek için sürükle · yakınlaşmak için kaydır · bir gezegen seç</span>
      </div>

      <div className="model-badge glass-chip">
        <Sparkles size={14} />
        <span>Kepler hareketi</span>
      </div>

      <div className={`loading-veil ${isReady ? "is-ready" : ""}`} aria-hidden="true">
        <Orbit size={30} />
        <span>Gök günlüğü kalibre ediliyor</span>
      </div>
    </main>
  );
}

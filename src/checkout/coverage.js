import geometry from "./morocco-boundary.json";
import cities from "./delivery-cities.json";

export const coverageWarning = "Delivery is currently available only in Morocco. Please select a location within Morocco.";
export const uncertainLocation = "This location cannot be verified. Choose a more precise point within Morocco.";

const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

export function parseCoordinate(value) {
  const number = value.trim().replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) & 15))
    .replace(/[٫,]/g, ".").replace("−", "-");
  return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(number) ? Number(number) : NaN;
}

// Natural Earth 1:10m is generalized. Reject points within 50 m of any edge,
// increasing the margin when the GPS accuracy radius is larger.
function ringResult(ring, { lat, lng }, margin) {
  let inside = false;
  let nearEdge = false;
  const horizontalScale = 111195 * Math.cos(lat * Math.PI / 180);
  for (let i = 1; i < ring.length; i++) {
    const [ax, ay] = ring[i - 1];
    const [bx, by] = ring[i];
    if ((ay > lat) !== (by > lat) && lng < (bx - ax) * (lat - ay) / (by - ay) + ax) {
      inside = !inside;
    }
    const x = (ax - lng) * horizontalScale;
    const y = (ay - lat) * 111195;
    const dx = (bx - ax) * horizontalScale;
    const dy = (by - ay) * 111195;
    const squaredLength = dx * dx + dy * dy;
    const fraction = squaredLength ? Math.max(0, Math.min(1, -(x * dx + y * dy) / squaredLength)) : 0;
    if (Math.hypot(x + fraction * dx, y + fraction * dy) <= margin) nearEdge = true;
  }
  return { inside, nearEdge };
}

export function deliveryProblem(point) {
  const { lat, lng, accuracy = 0 } = point ?? {};
  if (![lat, lng, accuracy].every(Number.isFinite) || Math.abs(lat) > 90 || Math.abs(lng) > 180 ||
      accuracy < 0 || accuracy > 1000 || !polygons?.length) return uncertainLocation;

  const margin = 50 + accuracy;
  let inside = false;
  for (const polygon of polygons) {
    const [outer, ...holes] = polygon.map((ring) => ringResult(ring, point, margin));
    if (outer.nearEdge || holes.some((hole) => hole.nearEdge)) return uncertainLocation;
    if (outer.inside && !holes.some((hole) => hole.inside)) inside = true;
  }
  return inside ? null : coverageWarning;
}

const normalize = (value) => value.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();
let placeIndex;

function getPlaceIndex() {
  if (!placeIndex) {
    const places = cities.map(([en, fr, ar, lat, lng, name, ascii]) => ({
      en, fr, ar, lat, lng, problem: deliveryProblem({ lat, lng }),
      names: [...new Set([en, fr, ar, name, ascii].filter(Boolean).map(normalize))],
    }));
    placeIndex = { places, domestic: places.filter(({ problem }) => !problem) };
  }
  return placeIndex;
}
const distance = (a, b) => 111.195 * Math.hypot(a.lat - b.lat,
  (a.lng - b.lng) * Math.cos((a.lat + b.lat) * Math.PI / 360));

export function searchCities(query) {
  const name = normalize(query);
  const { places } = getPlaceIndex();
  const matching = places.filter((city) => city.names.some((alias) => alias.startsWith(name)));
  return matching.sort((a, b) => Number(b.names.includes(name)) - Number(a.names.includes(name)) ||
    Number(!b.problem) - Number(!a.problem)).slice(0, 8);
}

export function locationCity(point) {
  const { domestic } = getPlaceIndex();
  const city = domestic.reduce((closest, item) => distance(point, item) < distance(point, closest) ? item : closest);
  return distance(point, city) <= 15 ? city : null;
}

export function addressLocationProblem(city, point) {
  const { places } = getPlaceIndex();
  const name = normalize(city);
  const matches = places.filter(({ names }) => names.includes(name));
  if (!matches.length) return null;
  const domesticMatches = matches.filter(({ problem }) => !problem);
  if (!domesticMatches.length) {
    return matches.some(({ problem }) => problem === uncertainLocation) ? uncertainLocation : coverageWarning;
  }
  if (!domesticMatches.some((match) => distance(match, point) <= 35)) {
    return "The city does not match your map pin. Check the address or change the location.";
  }
  return null;
}

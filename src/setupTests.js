import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Leaflet detects SVG support through this legacy method, which jsdom omits.
SVGSVGElement.prototype.createSVGRect = () => ({});

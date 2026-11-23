import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import geometry from "./morocco-boundary.json";
import { useI18n } from "../i18n/LanguageProvider";

const tiles = process.env.REACT_APP_CHECKOUT_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function DeliveryMap({ point, view, onPick, onTileError, preview = false }) {
  const { t } = useI18n();
  const container = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const handlers = useRef({ onPick, onTileError });

  useEffect(() => { handlers.current = { onPick, onTileError }; }, [onPick, onTileError]);

  useEffect(() => {
    const instance = L.map(container.current, {
      zoomControl: false, scrollWheelZoom: false, minZoom: 3, maxZoom: 19,
      maxBounds: [[-5, -65], [65, 40]], maxBoundsViscosity: 0.75,
    });
    map.current = instance;
    instance.attributionControl.setPrefix(false);
    L.tileLayer(tiles, {
      attribution: process.env.REACT_APP_CHECKOUT_TILE_ATTRIBUTION ||
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      referrerPolicy: "strict-origin-when-cross-origin",
      noWrap: true,
    }).on("tileerror", () => handlers.current.onTileError?.()).addTo(instance);

    const outline = L.geoJSON(geometry, {
      interactive: false,
      style: { color: "#087653", weight: 2, fillOpacity: 0.045 },
    }).addTo(instance);
    marker.current = L.layerGroup().addTo(instance);
    instance.fitBounds(outline.getBounds(), { padding: [16, 16], maxZoom: 6 });
    if (!preview) instance.on("click", ({ latlng }) => handlers.current.onPick(latlng));

    const resize = typeof ResizeObserver === "undefined" ? null :
      new ResizeObserver(() => instance.invalidateSize({ pan: false }));
    resize?.observe(container.current);
    return () => {
      resize?.disconnect();
      instance.remove();
      map.current = null;
    };
  }, [preview]);

  useEffect(() => {
    marker.current.clearLayers();
    if (point) L.circleMarker([point.lat, point.lng], {
      radius: 8, weight: 3, color: "white", fillColor: "#087653", fillOpacity: 1, interactive: false,
    }).addTo(marker.current);
  }, [point, preview]);

  useEffect(() => {
    const target = view || (preview && point);
    if (target) map.current.setView([target.lat, target.lng], target.zoom || 16);
  }, [view, preview, point]);

  return (
    <div className="checkout-map-shell" dir="ltr">
      <div ref={container} className={preview ? "checkout-map checkout-map-preview" : "checkout-map"}
        role="region" aria-label={t("Delivery map")} />
      <div className="checkout-map-zoom">
        <button type="button" aria-label={t("Zoom in")} onClick={() => map.current?.zoomIn()}>+</button>
        <button type="button" aria-label={t("Zoom out")} onClick={() => map.current?.zoomOut()}>−</button>
      </div>
    </div>
  );
}

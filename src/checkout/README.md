# Demo checkout

The delivery point is authoritative. Every map pick, coordinate entry, GPS result and city search result passes the same polygon check. A city result centers the map, and the customer still needs to choose a precise pin. Known city names are also checked against the pin at address confirmation and order save. The written street address and any municipality absent from the gazetteer are customer-confirmed against the pin. No address or exact GPS coordinates are sent to a geocoding service.

## Geographic policy

The bundled files are extracts from [Natural Earth v5.1.2](https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson). The boundary is the `ADM0_A3=MAR` geometry from the default 1:10m admin-0 countries layer. Demo coverage follows Natural Earth's de facto treatment of disputed areas. The geometry includes Laayoune and excludes Bir Lehlou. The city gazetteer uses the 1:10m populated places layer and includes Moroccan places and a selection of major international cities. Natural Earth is public-domain cartography and uses generalized boundaries.

Points within 50 metres of the polygon edge are treated as uncertain. A GPS fix adds its reported accuracy radius to that margin, and fixes with more than 1 km of uncertainty are rejected. This policy also affects some locations near the coast. The check runs again when saving the order, independently of the map and checkout step state.

## Hosting and storage

Netlify serves the existing SPA fallback for checkout routes, and HTTPS is required for browser geolocation. Leaflet assets are built with the application. The default raster tiles are best-effort OpenStreetMap tiles for light demo use, with [visible attribution and the public tile usage policy](https://operations.osmfoundation.org/policies/tiles/). If using a different provider, set `REACT_APP_CHECKOUT_TILE_URL` and `REACT_APP_CHECKOUT_TILE_ATTRIBUTION` at build time. Build-time browser variables are public.

Order history stays in this browser and is scoped to the active demo account or the separate guest history. An account order and the emptied persisted cart are written together. Saved invoices retain the customer name, street and city, and the order stores rounded coordinates. The history action removes these details from saved invoices. Phone and delivery instructions stay in checkout memory. The print dialog supports A4 and can save to PDF on supported platforms.

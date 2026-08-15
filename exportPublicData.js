import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  QHC_GEOJSON,
  QHPK_GEOJSON,
  METRO_ACTIVE_GEOJSON,
  METRO_PLANNED_GEOJSON,
  METRO_STATIONS_GEOJSON,
} from "./src/data/hanoiZoningData.js";
import { LAND_PRICES } from "./src/data/landPriceData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDataDir = path.join(__dirname, "public", "data");
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(publicDataDir, "qhc.geojson"),
  JSON.stringify(QHC_GEOJSON, null, 2)
);
fs.writeFileSync(
  path.join(publicDataDir, "qhpk.geojson"),
  JSON.stringify(QHPK_GEOJSON, null, 2)
);
fs.writeFileSync(
  path.join(publicDataDir, "metro_active.geojson"),
  JSON.stringify(METRO_ACTIVE_GEOJSON, null, 2)
);
fs.writeFileSync(
  path.join(publicDataDir, "metro_planned.geojson"),
  JSON.stringify(METRO_PLANNED_GEOJSON, null, 2)
);
fs.writeFileSync(
  path.join(publicDataDir, "metro_stations.geojson"),
  JSON.stringify(METRO_STATIONS_GEOJSON, null, 2)
);
fs.writeFileSync(
  path.join(publicDataDir, "land_price.json"),
  JSON.stringify(LAND_PRICES, null, 2)
);

console.log("Successfully generated all public GeoJSON and JSON data files!");

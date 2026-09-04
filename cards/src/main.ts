/**
 * Точка входа плагина. Все карточки в одном бандле — один ресурс в дашборде,
 * одна запись в HACS.
 */
import "./cards/climate-tile";
import "./cards/plug-tile";
import "./cards/plant-tile";
import "./cards/buttons-tile";
import "./cards/printer-tile";
import "./cards/vacuum-tile";
import "./cards/batteries-tile";
import "./cards/safety-tile";
import "./cards/server-tile";
import "./cards/person-tile";
import "./cards/computer-tile";
import "./cards/air-tile";
import "./cards/cover-tile";
import "./cards/energy-tile";
import "./cards/presence-tile";

// eslint-disable-next-line no-console
console.info(
  "%c HOROS-CARDS %c 0.1.0 ",
  "background:#03a9f4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px",
  "background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px"
);

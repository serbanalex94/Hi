import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import {Icon, Style} from 'ol/style.js';
import {StadiaMaps, Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';

const iconFeature = new Feature({
  geometry: new Point([0, 0]),
});

const vectorSource = new VectorSource({
  features: [iconFeature],
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

const rasterLayer = new TileLayer({
  source: new StadiaMaps({
    layer: 'stamen_toner',
  }),
});

const map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

const gifUrl = 'data/globe.gif';
const gif = gifler(gifUrl);
gif.frames(
  document.createElement('canvas'),
  function (ctx, frame) {
    if (!iconFeature.getStyle()) {
      iconFeature.setStyle(
        new Style({
          image: new Icon({
            img: ctx.canvas,
            opacity: 0.8,
          }),
        }),
      );
    }
    ctx.clearRect(0, 0, frame.width, frame.height);
    ctx.drawImage(frame.buffer, frame.x, frame.y);
    map.render();
  },
  true,
);

// change mouse cursor when over icon
map.on('pointermove', function (e) {
  const pixel = map.getEventPixel(e.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});

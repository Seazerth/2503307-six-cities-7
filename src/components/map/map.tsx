import {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import type {Offer} from '../../mocks/offers';

const AMSTERDAM_CENTER: [number, number] = [52.37403, 4.88969];
const INITIAL_ZOOM = 12;
const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_LAYER_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DEFAULT_MARKER_ICON = L.icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});
const ACTIVE_MARKER_ICON = L.icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

type CityMapProps = {
  offers: Offer[];
  activeOfferId: string | null;
};

function CityMap({offers, activeOfferId}: CityMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const mapElement = mapElementRef.current;
    if (!mapElement) {
      return;
    }

    const map = L.map(mapElement).setView(AMSTERDAM_CENTER, INITIAL_ZOOM);
    L.tileLayer(TILE_LAYER_URL, {attribution: TILE_LAYER_ATTRIBUTION}).addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      markerLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const markerLayer = markerLayerRef.current;
    if (!markerLayer) {
      return;
    }

    markerLayer.clearLayers();
    offers.forEach((offer) => {
      const {latitude, longitude} = offer.location;
      L.marker([latitude, longitude], {
        icon: offer.id === activeOfferId ? ACTIVE_MARKER_ICON : DEFAULT_MARKER_ICON,
      }).addTo(markerLayer);
    });
  }, [activeOfferId, offers]);

  return (
    <section className="cities__map map">
      <div className="leaflet-map" ref={mapElementRef} />
    </section>
  );
}

export default CityMap;

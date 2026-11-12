import {memo, useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM} from '../../constants';
import type {Offer} from '../../types/offer';

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
  center?: [number, number];
  zoom?: number;
  mapClassName?: string;
};

const CityMap = memo(({offers, activeOfferId, center = DEFAULT_MAP_CENTER, zoom = DEFAULT_MAP_ZOOM, mapClassName = 'cities__map map'}: CityMapProps) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const initialCenterRef = useRef(center);
  const initialZoomRef = useRef(zoom);

  useEffect(() => {
    const mapElement = mapElementRef.current;
    const markers = markersRef.current;
    if (!mapElement) {
      return;
    }

    const map = L.map(mapElement).setView(initialCenterRef.current, initialZoomRef.current);
    L.tileLayer(TILE_LAYER_URL, {attribution: TILE_LAYER_ATTRIBUTION}).addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      markers.clear();
    };
  }, []);

  useEffect(() => {
    mapRef.current?.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    const markerLayer = markerLayerRef.current;
    if (!markerLayer) {
      return;
    }

    markerLayer.clearLayers();
    markersRef.current.clear();
    offers.forEach((offer) => {
      const {latitude, longitude} = offer.location;
      const marker = L.marker([latitude, longitude], {icon: DEFAULT_MARKER_ICON}).addTo(markerLayer);
      markersRef.current.set(offer.id, marker);
    });
  }, [offers]);

  useEffect(() => {
    markersRef.current.forEach((marker, offerId) => {
      marker.setIcon(offerId === activeOfferId ? ACTIVE_MARKER_ICON : DEFAULT_MARKER_ICON);
    });
  }, [activeOfferId, offers]);

  return (
    <section className={mapClassName}>
      <div className="leaflet-map" ref={mapElementRef} />
    </section>
  );
});

CityMap.displayName = 'CityMap';
export default CityMap;

import {render, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {testOffer} from '../../test-utils';

const leafletMocks = vi.hoisted(() => {
  const markerInstances: Array<{setIcon: ReturnType<typeof vi.fn>}> = [];
  const markerArguments: Array<{coordinates: [number, number]; options: {icon: unknown}}> = [];
  const mapInstance = {setView: vi.fn(), remove: vi.fn()};
  mapInstance.setView.mockReturnValue(mapInstance);
  const tileLayer = {
    addTo: vi.fn(),
  };
  const layerGroup = {
    addTo: vi.fn(),
    clearLayers: vi.fn(),
  };
  layerGroup.addTo.mockReturnValue(layerGroup);

  return {
    markerInstances,
    markerArguments,
    icon: vi.fn((options: unknown) => options),
    map: vi.fn(() => mapInstance),
    tileLayer: vi.fn(() => tileLayer),
    layerGroup: vi.fn(() => layerGroup),
    marker: vi.fn((coordinates: [number, number], options: {icon: unknown}) => {
      markerArguments.push({coordinates, options});
      const marker = {
        addTo: vi.fn(),
        setIcon: vi.fn(),
      };
      marker.addTo.mockReturnValue(marker);
      markerInstances.push(marker);
      return marker;
    }),
  };
});

vi.mock('leaflet', () => ({
  default: {
    icon: leafletMocks.icon,
    map: leafletMocks.map,
    tileLayer: leafletMocks.tileLayer,
    layerGroup: leafletMocks.layerGroup,
    marker: leafletMocks.marker,
  },
}));

import CityMap from './map';

describe('CityMap', () => {
  beforeEach(() => {
    leafletMocks.icon.mockClear();
    leafletMocks.map.mockClear();
    leafletMocks.tileLayer.mockClear();
    leafletMocks.layerGroup.mockClear();
    leafletMocks.marker.mockClear();
    leafletMocks.markerInstances.splice(0);
    leafletMocks.markerArguments.splice(0);
  });

  it('creates a map with offer markers and highlights the active marker', async () => {
    const offers = [testOffer, {...testOffer, id: 'offer-2'}];
    const updatedOffers = [...offers];
    const {container, rerender} = render(
      <CityMap offers={offers} activeOfferId={testOffer.id} center={[48.85, 2.35]} zoom={12} />
    );

    expect(container.querySelector('.cities__map')).toBeInTheDocument();
    await waitFor(() => expect(leafletMocks.marker).toHaveBeenCalledTimes(2));
    expect(leafletMocks.map).toHaveBeenCalledTimes(1);
    expect(leafletMocks.tileLayer).toHaveBeenCalledTimes(1);
    expect(leafletMocks.markerArguments[0]?.coordinates).toEqual([testOffer.location.latitude, testOffer.location.longitude]);
    expect(leafletMocks.markerInstances[0].setIcon).toHaveBeenLastCalledWith(expect.not.objectContaining({iconUrl: '/img/pin.svg'}));
    expect(leafletMocks.markerInstances[1].setIcon).toHaveBeenLastCalledWith(leafletMocks.markerArguments[1]?.options.icon);

    rerender(<CityMap offers={updatedOffers} activeOfferId={testOffer.id} center={[48.85, 2.35]} zoom={12} />);
    await waitFor(() => expect(leafletMocks.marker).toHaveBeenCalledTimes(4));
    expect(leafletMocks.markerInstances[2].setIcon).toHaveBeenLastCalledWith(expect.not.objectContaining({iconUrl: '/img/pin.svg'}));
    expect(leafletMocks.markerInstances[3].setIcon).toHaveBeenLastCalledWith(leafletMocks.markerArguments[3]?.options.icon);

    rerender(<CityMap offers={updatedOffers} activeOfferId="offer-2" center={[48.85, 2.35]} zoom={12} />);
    await waitFor(() => expect(leafletMocks.markerInstances[1].setIcon).toHaveBeenCalled());
    expect(leafletMocks.layerGroup).toHaveBeenCalledTimes(1);
    expect(leafletMocks.marker).toHaveBeenCalledTimes(4);
    expect(leafletMocks.markerInstances[3].setIcon).toHaveBeenLastCalledWith(expect.not.objectContaining({iconUrl: '/img/pin.svg'}));
  });
});

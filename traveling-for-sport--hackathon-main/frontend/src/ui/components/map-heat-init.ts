/**
 * Leaflet.heat expects L on window. Set it before the plugin loads so the heat layer is attached.
 */
import L from 'leaflet';
if (typeof window !== 'undefined') {
  (window as unknown as { L: typeof L }).L = L;
}

import { FC } from 'react';
import { Card } from 'react-bootstrap';

export interface ChinaMapProps {
  style?: React.CSSProperties;
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    tooltip: string;
    position: [number, number];
  }>;
  onMarkerClick?: (event: { latlng: { lat: number; lng: number } }) => void;
}

const ChinaMap: FC<ChinaMapProps> = ({ 
  style = { height: '70vh' }, 
  center = [34.32, 108.55], 
  zoom = 4, 
  markers = []
}) => (
  <Card style={style}>
    <Card.Body className="d-flex align-items-center justify-content-center">
      <div className="text-center text-muted">
        <h5>Interactive China Map Coming Soon</h5>
        <p>Center: {center.join(', ')}, Zoom: {zoom}</p>
        <p>{markers.length} markers to display</p>
        <small>Map will integrate with open-react-map for geographic visualization</small>
      </div>
    </Card.Body>
  </Card>
);

export default ChinaMap;
import { FC, useEffect, useRef } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';

export interface MapProps {
  data?: { name: string; city?: string; province?: string; latitude?: number; longitude?: number }[];
  loading?: boolean;
}

export const Map: FC<MapProps> = ({ data = [], loading = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Placeholder for actual map implementation
    // This would integrate with a mapping library like Leaflet, AMap, or MapBox
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div
                ref={mapRef}
                style={{
                  width: '100%',
                  height: '500px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div className="text-center text-muted">
                  <h5>Interactive Map Coming Soon</h5>
                  <p>Geographic visualization of {data.length} organizations</p>
                  {data.length > 0 && (
                    <small>
                      Data includes organizations from{' '}
                      {[...new Set(data.map(item => item.province || item.city).filter(Boolean))].length}{' '}
                      locations
                    </small>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Map;
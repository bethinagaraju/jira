import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Form } from 'react-bootstrap';
import { Search, ArrowUp, Plus } from 'react-bootstrap-icons';

const Home = () => {
  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <Row className="align-items-center mb-4">
        <Col>
          <h3>Home</h3>
          <p className="text-muted">Monitor all of your projects and tasks here</p>
        </Col>
        <Col xs="auto">
          <Form.Control type="text" placeholder="Search..." />
        </Col>
      </Row>

      <Row className="mb-4">
        {[
          { title: 'Total Projects', value: 14, info: 2 },
          { title: 'Total Tasks', value: 14, info: 14 },
          { title: 'Assigned Tasks', value: 14, info: 7 },
          { title: 'Completed Tasks', value: 2, info: 2 },
          { title: 'Overdue Tasks', value: 0, info: 0 },
        ].map((stat, index) => (
          <Col key={index} md={2}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>{stat.title}</Card.Title>
                <h4>{stat.value} <ArrowUp className="text-success ms-2" size={16} /></h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              Assigned Tasks (14)
            </Card.Header>
            <ListGroup variant="flush">
              {[
                { task: 'Conduct usability testing', project: 'Mobile App Development', date: 'October 15th, 2024' },
                { task: 'Implement offline mode', project: 'Mobile App Development', date: 'October 14th, 2024' },
                { task: 'Integrate push notifications', project: 'Mobile App Development', date: 'October 13th, 2024' },
              ].map((item, index) => (
                <ListGroup.Item key={index}>
                  <div className="fw-semibold">{item.task}</div>
                  <div className="text-muted small">
                    {item.project} <span className="text-warning">{item.date}</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Footer className="text-center bg-light">
              <Button variant="light">Show All</Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Projects (2)</h5>
            <Button size="sm"><Plus size={18} /></Button>
          </div>
          <Row>
            <Col md={6}>
              <Card className="text-center bg-primary text-white">
                <Card.Body>
                  <div className="rounded-circle bg-white text-primary d-inline-block p-2 mb-2 fw-bold">M</div>
                  <div>Mobile App Development</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="text-center bg-purple text-white">
                <Card.Body>
                  <div className="rounded-circle bg-white text-purple d-inline-block p-2 mb-2 fw-bold">W</div>
                  <div>Website Redesign</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <h5 className="mb-3">People (2)</h5>
      <Row>
        {[
          { name: 'Antonio', email: 'antonio@mail.com' },
          { name: 'John', email: 'john@mail.com' },
        ].map((person, index) => (
          <Col key={index} md={3}>
            <Card className="text-center">
              <Card.Body>
                <div className="rounded-circle bg-secondary text-white d-inline-block p-3 fw-bold mb-2">
                  {person.name[0]}
                </div>
                <Card.Title>{person.name}</Card.Title>
                <Card.Text className="text-muted">{person.email}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;

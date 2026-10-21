import { Container, Button, Row, Col, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  FaLandmark,
  FaBullhorn,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaRegClock,
  FaMapMarkerAlt,
  FaHandsHelping
} from 'react-icons/fa'
import { getLoggedUser } from '../utils/auth'



function Landing() {
  const navigate = useNavigate()
  const loggedUser = getLoggedUser()

  const features = [
    {
      icon: <FaBullhorn />,
      title: 'Report Local Issues',
      description:
        'Bring potholes, waste management, and other neighbourhood problems to everyone’s attention.'
    },
    {
      icon: <FaUsers />,
      title: 'Build Community Support',
      description:
        'Support issues raised by your neighbours and help highlight what matters most.'
    },
    {
      icon: <FaCheckCircle />,
      title: 'Follow the Progress',
      description:
        'Keep track of reported issues and stay informed as the community takes action.'
    }
  ]

  return (
    <main style={{ color: '#24352e', overflow: 'hidden' }}>
      {/* Hero Section */}
       

      <section
        style={{
          background:
            'radial-gradient(circle at 85% 20%, #dcece2 0%, transparent 35%), linear-gradient(180deg, #eef6f1 0%, #faf8f3 100%)',
          padding: '90px 0 100px'
        }}
      >
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <div
                className="d-inline-flex align-items-center gap-2 mb-4"
                style={{
                  background: '#dcece2',
                  color: '#176B52',
                  borderRadius: '30px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                <FaMapMarkerAlt />
                YOUR COMMUNITY, YOUR VOICE
              </div>

              <h1
                style={{
                  fontSize: 'clamp(42px, 6vw, 68px)',
                  fontWeight: '750',
                  lineHeight: '1.08',
                  letterSpacing: '-2px',
                  maxWidth: '680px'
                }}
              >
                Better neighbourhoods start{' '}
                <span style={{ color: '#176B52' }}>with us.</span>
              </h1>

              <p
                className="text-secondary mt-4 mb-4"
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                  maxWidth: '550px'
                }}
              >
                Spot a problem? Speak up. Civic-Tracker helps communities report
                local issues, support shared concerns, and follow progress
                towards a better place to live.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: '#176B52',
                    border: '1px solid #176B52',
                    borderRadius: '10px',
                    padding: '14px 25px',
                    fontWeight: '600'
                  }}
                >
                  Explore Community <FaArrowRight className="ms-2" />
                </Button>

                {!loggedUser && (
                  <Button
                    size="lg"
                    onClick={() => navigate('/register')}
                    style={{
                      background: '#fff',
                      color: '#176B52',
                      border: '1px solid #d5e2d9',
                      borderRadius: '10px',
                      padding: '14px 25px',
                      fontWeight: '600'
                    }}
                  >
                    Join Civic-Tracker
                  </Button>
                )}
              </div>

              <div
                className="d-flex flex-wrap gap-4 mt-5"
                style={{ color: '#53665b', fontSize: '14px' }}
              >
                <span>
                  <FaCheckCircle style={{ color: '#176B52' }} className="me-2" />
                  Community driven
                </span>
                <span>
                  <FaCheckCircle style={{ color: '#176B52' }} className="me-2" />
                  Transparent updates
                </span>
              </div>
            </Col>

            <Col lg={5}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e2ebe4',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 24px 70px rgba(23, 107, 82, 0.10)'
                }}
              >
                <div
                  className="d-flex align-items-center gap-3 mb-4"
                  style={{
                    paddingBottom: '22px',
                    borderBottom: '1px solid #edf1ed'
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '15px',
                      background: '#176B52',
                      color: '#fff',
                      flexShrink: 0
                    }}
                  >
                    <FaLandmark size={25} />
                  </div>

                  <div>
                    <h5 className="mb-1" style={{ fontWeight: '700' }}>
                      Civic-Tracker
                    </h5>
                    <p className="text-secondary mb-0" style={{ fontSize: '13px' }}>
                      Your community dashboard
                    </p>
                  </div>
                </div>

                <p
                  className="mb-3"
                  style={{
                    color: '#718078',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '1px'
                  }}
                >
                  HOW IT WORKS
                </p>

                {[
                  {
                    icon: <FaBullhorn />,
                    title: 'Report a problem',
                    description: 'Make local issues visible',
                    color: '#e5f1e8'
                  },
                  {
                    icon: <FaHandsHelping />,
                    title: 'Get community support',
                    description: 'Bring people together',
                    color: '#f6eddb'
                  },
                  {
                    icon: <FaCheckCircle />,
                    title: 'Track the progress',
                    description: 'Stay informed about updates',
                    color: '#e3edf6'
                  }
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="d-flex align-items-center gap-3 mb-3"
                    style={{
                      background: '#fafbf9',
                      border: '1px solid #edf1ed',
                      borderRadius: '14px',
                      padding: '15px'
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: item.color,
                        color: '#176B52',
                        fontSize: '18px',
                        flexShrink: 0
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h6 className="mb-1" style={{ fontWeight: '650' }}>
                        {index + 1}. {item.title}
                      </h6>
                      <p
                        className="text-secondary mb-0"
                        style={{ fontSize: '13px' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}

                <div
                  className="mt-4 d-flex align-items-center gap-2"
                  style={{
                    background: '#eef6f1',
                    color: '#176B52',
                    padding: '13px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  <FaRegClock />
                  Every voice can make a difference.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{ background: '#fff', padding: '85px 0' }}
      >
        <Container>
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '620px' }}>
            <p
              className="mb-2"
              style={{
                color: '#176B52',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '2px'
              }}
            >
              BUILT FOR COMMUNITIES
            </p>

            <h2
              style={{
                fontSize: 'clamp(30px, 4vw, 42px)',
                fontWeight: '750',
                letterSpacing: '-1px'
              }}
            >
              Small actions. Real change.
            </h2>

            <p
              className="text-secondary mt-3 mb-0"
              style={{ fontSize: '16px', lineHeight: '1.8' }}
            >
              A better way to bring local problems to light and help your
              community move forward together.
            </p>
          </div>

          <Row className="g-4">
            {features.map((feature) => (
              <Col md={4} key={feature.title}>
                <Card
                  className="h-100"
                  style={{
                    border: '1px solid #e8eee9',
                    borderRadius: '18px',
                    padding: '12px',
                    boxShadow: '0 8px 30px rgba(27, 61, 44, 0.035)'
                  }}
                >
                  <Card.Body className="p-4">
                    <div
                      className="d-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '15px',
                        background: '#eaf4ed',
                        color: '#176B52',
                        fontSize: '22px'
                      }}
                    >
                      {feature.icon}
                    </div>

                    <h5 style={{ fontWeight: '700' }}>
                      {feature.title}
                    </h5>

                    <p
                      className="text-secondary mb-0 mt-3"
                      style={{ lineHeight: '1.8', fontSize: '15px' }}
                    >
                      {feature.description}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{
          background: '#f3f7f3',
          padding: '75px 0'
        }}
      >
        <Container style={{ maxWidth: '850px' }}>
          <div className="text-center">
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-4"
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '17px',
                background: '#176B52',
                color: '#fff'
              }}
            >
              <FaLandmark size={26} />
            </div>

            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 38px)',
                fontWeight: '750',
                letterSpacing: '-1px'
              }}
            >
              About Civic-Tracker
            </h2>

            <p
              className="text-secondary mt-3 mb-0 mx-auto"
              style={{
                fontSize: '16px',
                lineHeight: '1.9',
                maxWidth: '690px'
              }}
            >
              Civic-Tracker is a community-focused platform that gives people a
              shared space to report neighbourhood issues and show support for
              the problems that matter most. By making local concerns easier
              to discover and follow, we aim to encourage participation,
              accountability, and positive change.
            </p>
          </div>
        </Container>
      </section>

      {/* Final Call to Action */}
      <section
        style={{
          background: '#176B52',
          color: '#fff',
          padding: '65px 0'
        }}
      >
        <Container className="text-center">
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: '750'
            }}
          >
            Your neighbourhood deserves better.
          </h2>

          <p
            style={{
              color: '#d9e9df',
              fontSize: '16px',
              lineHeight: '1.8',
              maxWidth: '550px',
              margin: '15px auto 28px'
            }}
          >
            Be part of the conversation. Start by exploring the issues in your
            community.
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#fff',
              color: '#176B52',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontWeight: '700'
            }}
          >
            Explore Community <FaArrowRight className="ms-2" />
          </Button>
        </Container>
      </section>
    </main>
  )
}

export default Landing
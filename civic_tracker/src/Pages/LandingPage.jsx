
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaMapMarkerAlt,
    FaUsers,
    FaBullhorn,
    FaArrowRight
} from 'react-icons/fa'
import './LandingPage.css'

function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="civic-landing-page">

            {/* Hero Section */}
            <section className="civic-landing-hero">

                <div className="civic-landing-overlay"></div>

                <div className="civic-landing-content">

                    <div className="civic-landing-brand">
                        Civic<span>-Tracker</span>
                    </div>

                    <div className="civic-landing-badge">
                        <FaMapMarkerAlt />
                        COMMUNITY • REPORT • RESOLVE
                    </div>

                    <h1>
                        Make Your Community
                        <span> Better Together</span>
                    </h1>

                    <p>
                        CivicTracker helps citizens report local problems, support
                        community issues, and track their progress from report to
                        resolution.
                    </p>

                    <div className="civic-landing-actions">

                        <button
                            type="button"
                            className="civic-landing-primary"
                            onClick={() => navigate('/home')}
                        >
                            Explore CivicPulse
                            <FaArrowRight />
                        </button>

                        <button
                            type="button"
                            className="civic-landing-secondary"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>

                    </div>

                    <div className="civic-landing-stats">

                        <div>
                            <FaBullhorn />
                            <span>Report Issues</span>
                        </div>

                        <div>
                            <FaUsers />
                            <span>Support Your Community</span>
                        </div>

                        <div>
                            <FaMapMarkerAlt />
                            <span>Track Progress</span>
                        </div>

                    </div>

                </div>

            </section>

        </div>
    )
}

export default LandingPage
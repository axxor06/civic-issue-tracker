import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchIssues } from '../Redux/slice/issueSlice'
import { getLoggedUser } from '../utils/auth'


function Landing() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { hash } = useLocation()
  const { allIssues } = useSelector((state) => state.issueReducer)

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  // header links like /#about scroll to the section
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
  }, [hash])

  const resolved = allIssues.filter((i) => i.status === 'Resolved').length

  return (
    <>
      <section className="page hero">
        <p className="eyebrow">Community issue tracker</p>
        <h1>Report what's broken in your neighbourhood.</h1>
        <p className="lead-text">
          CivicTrack is a simple place to report potholes, dead streetlights,
          blocked drains and other local problems, see what your neighbours have
          raised, and follow what happens next.
        </p>

        <div className="hero-actions">
          <button
            className="btn-main"
            onClick={() => navigate(getLoggedUser() ? '/report-issue' : '/login')}
          >
            Report an issue
          </button>
          <Link to="/#how" className="link-quiet">How it works ↓</Link>
        </div>

        {allIssues.length > 0 && (
          <p className="hero-count">
            {allIssues.length} issues reported so far, {resolved} resolved.
          </p>
        )}
      </section>

      <section id="how" className="page section">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <strong>Report it.</strong> Say what the problem is and where. It
            takes a minute.
          </li>
          <li>
            <strong>Back it.</strong> Neighbours support the issues that affect
            them too. The most supported ones rise to the top.
          </li>
          <li>
            <strong>Follow it.</strong> An admin updates the status and leaves an
            official response, so you can see what's being done.
          </li>
        </ol>
      </section>

      <section id="about" className="page section">
        <h2>About</h2>
        <p className="lead-text">
          A small community project. Nothing fancy: issues with more support are
          shown first, and resolved ones move to the bottom, so attention goes
          where most people need it.
        </p>
      </section>
    </>
  )
}

export default Landing

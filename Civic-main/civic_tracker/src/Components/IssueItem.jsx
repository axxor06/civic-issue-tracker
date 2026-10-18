import { formatDate, statusOf } from '../utils/issueHelpers'

// one issue row, shared by the community and admin pages
// anything passed as children is shown as the action row
function IssueItem({ issue, rank, children }) {
  const status = statusOf(issue)

  return (
    <article className="issue">
      <div className="issue-top">
        <span className={`status status-${status.toLowerCase().replace(' ', '-')}`}>
          {status}
        </span>
        {rank && <span className="issue-rank">Priority {rank}</span>}
      </div>

      <h3 className="issue-title">{issue.title}</h3>

      <p className="issue-meta">
        {[issue.category, issue.location, formatDate(issue.createdAt)]
          .filter(Boolean)
          .join(' · ')}
      </p>

      <p className="issue-desc">{issue.description}</p>

      {issue.adminResponse && (
        <blockquote className="issue-reply">
          <span>Official response</span>
          {issue.adminResponse}
        </blockquote>
      )}

      {children && <div className="issue-actions">{children}</div>}
    </article>
  )
}

export default IssueItem

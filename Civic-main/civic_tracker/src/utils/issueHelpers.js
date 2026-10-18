export const STATUSES = ['Pending', 'In Progress', 'Resolved']

export const statusOf = (issue) => issue.status || 'Pending'

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

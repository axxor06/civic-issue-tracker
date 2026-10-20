export const STATUS_STYLES = {
  Pending: {
    background: '#F59E0B',
    color: '#FFFFFF'
  },

  Reported: {
    background: '#2563EB',
    color: '#FFFFFF'
  },

  'Under Review': {
    background: '#7C3AED',
    color: '#FFFFFF'
  },

  Approved: {
    background: '#16A34A',
    color: '#FFFFFF'
  },

  Assigned: {
    background: '#0891B2',
    color: '#FFFFFF'
  },

  'In Progress': {
    background: '#4F46E5',
    color: '#FFFFFF'
  },

  Resolved: {
    background: '#059669',
    color: '#FFFFFF'
  },

  Rejected: {
    background: '#DC2626',
    color: '#FFFFFF'
  }
}

export const getStatusStyle = (status) => {
  return STATUS_STYLES[status] || {
    background: '#64748B',
    color: '#FFFFFF'
  }
}
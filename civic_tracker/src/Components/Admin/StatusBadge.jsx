import React from 'react'
import { getStatusStyle } from '../../utils/statusStyles'

function StatusBadge({ status }) {

  const currentStatus = status || 'Pending'

  const style = getStatusStyle(currentStatus)

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: style.background,
        color: style.color
      }}
    >
      {currentStatus}
    </span>
  )
}

export default StatusBadge
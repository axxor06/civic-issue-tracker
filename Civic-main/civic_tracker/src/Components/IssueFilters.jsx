import { FaSearch } from 'react-icons/fa'

const TABS = ['All', 'Pending', 'In Progress', 'Resolved']

function IssueFilters({ searchKey, setSearchKey, filter, setFilter }) {
  return (
    <div className="toolbar">
      <div className="tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            className={filter === tab ? 'on' : ''}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <label className="search">
        <FaSearch aria-hidden="true" />
        <input
          type="text"
          placeholder="Search issues"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </label>
    </div>
  )
}

export default IssueFilters

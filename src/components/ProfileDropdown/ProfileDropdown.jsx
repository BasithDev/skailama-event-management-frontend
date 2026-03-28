import { useState, useRef, useEffect } from 'react'

export default function ProfileDropdown({
  users,
  selected,
  onChange,
  multiple = false,
  onAddUser,
  loading = false,
  placeholder = 'Select profile...',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const containerRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchRef.current) searchRef.current.focus()
  }, [isOpen])

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  const isSelected = (id) => {
    if (multiple) return Array.isArray(selected) && selected.includes(id)
    return selected === id
  }

  const handleSelect = (id) => {
    if (multiple) {
      const current = Array.isArray(selected) ? selected : []
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
      onChange(next)
    } else {
      onChange(id)
      setIsOpen(false)
      setSearch('')
    }
  }

  const handleAdd = async () => {
    if (!newName.trim() || !onAddUser) return
    setAdding(true)
    try {
      await onAddUser(newName.trim())
      setNewName('')
    } finally {
      setAdding(false)
    }
  }

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const getDisplayText = () => {
    if (multiple) {
      if (!Array.isArray(selected) || selected.length === 0) return placeholder
      const names = selected
        .map((id) => users.find((u) => u._id === id)?.name)
        .filter(Boolean)
      return names.join(', ')
    }
    const user = users.find((u) => u._id === selected)
    return user ? user.name : placeholder
  }

  const hasValue = multiple
    ? Array.isArray(selected) && selected.length > 0
    : !!selected

  const selectedCount = multiple && Array.isArray(selected) ? selected.length : 0

  return (
    <div className="relative" ref={containerRef}>
      <button
        className={`w-full flex items-center gap-2 px-3 py-2.5 bg-white border rounded-lg text-sm text-left transition-all cursor-pointer
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-400'}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className={`flex-1 truncate ${hasValue ? 'text-gray-900' : 'text-gray-400'}`}>
          {getDisplayText()}
        </span>
        {multiple && selectedCount > 0 && (
          <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
            {selectedCount}
          </span>
        )}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12" fill="currentColor"
        >
          <path d="M6 8L1 3h10z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-1">
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search profiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 outline-none focus:border-primary transition-colors"
            />
          </div>

          <ul className="max-h-[180px] overflow-y-auto py-1">
            {loading ? (
              <li className="py-4 text-center text-sm text-gray-400">Loading...</li>
            ) : filtered.length === 0 ? (
              <li className="py-4 text-center text-sm text-gray-400">No profiles found</li>
            ) : (
              filtered.map((user) => (
                <li key={user._id}>
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer
                      ${isSelected(user._id) ? 'bg-primary-light' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelect(user._id)}
                    type="button"
                  >
                    <span className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-primary-hover text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="flex-1 text-sm">{user.name}</span>
                    {isSelected(user._id) && (
                      <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>

          {onAddUser && (
            <div className="flex gap-1 p-2 border-t border-gray-200">
              <input
                type="text"
                placeholder="New profile name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleAddKeyDown}
                className="flex-1 px-2.5 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-primary transition-colors"
                disabled={adding}
              />
              <button
                className="w-9 h-9 shrink-0 flex items-center justify-center bg-primary text-white rounded-md text-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleAdd}
                disabled={!newName.trim() || adding}
                type="button"
              >
                {adding ? '...' : '+'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

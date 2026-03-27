import { useState, useRef, useEffect } from 'react'
import timezones from '../../constants/timezones'
import { ChevronDown, Search, Check, Globe } from 'lucide-react'

export default function TimezoneSelect({ value, onChange, id }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
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

  const filtered = timezones.filter((tz) =>
    tz.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedOption = timezones.find((tz) => tz.value === value)
  const displayText = selectedOption ? selectedOption.label : 'Select timezone...'

  return (
    <div className="relative" ref={containerRef} id={id}>
      <button
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border rounded-lg text-sm text-left transition-all cursor-pointer
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-400'}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="flex items-center gap-2 truncate text-gray-900">
          <Globe className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="truncate">{displayText}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-1">
          <div className="p-2 border-b border-gray-200 relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-4" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search timezone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-2 border border-gray-200 rounded-md text-sm bg-gray-50 outline-none focus:border-primary transition-colors"
            />
          </div>

          <ul className="max-h-[220px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="py-4 text-center text-sm text-gray-400">No timezones found</li>
            ) : (
              filtered.map((tz) => (
                <li key={tz.value}>
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer
                      ${value === tz.value ? 'bg-primary-light' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      onChange(tz.value)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    type="button"
                  >
                    <span className="text-sm truncate pr-2">{tz.label}</span>
                    {value === tz.value && (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

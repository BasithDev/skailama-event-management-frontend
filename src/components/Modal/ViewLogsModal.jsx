import { useState, useEffect } from 'react'
import Modal from './Modal.jsx'
import { fetchEventLogs } from '../../api/api.js'
import { NotebookText, ArrowRight } from 'lucide-react'

function formatValue(value, field, users) {
  if (!value) return '--'
  if (field === 'members' && Array.isArray(value) && users) {
    return value.map(id => {
      const u = users.find(u => u._id === id);
      return u ? u.name : id;
    }).join(', ');
  }
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    return new Date(value).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }
  return String(value)
}

function formatTimestamp(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export default function ViewLogsModal({ isOpen, onClose, eventId, users }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && eventId) {
      setLoading(true)
      setError('')
      fetchEventLogs(eventId)
        .then((res) => setLogs(res.data))
        .catch((err) => {
          if (err.message.includes('No logs found')) {
            setLogs([])
          } else {
            setError(err.message)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, eventId])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Logs">
      <div className="min-h-[120px]">
        {loading ? (
          <p className="text-center py-10 text-sm text-gray-400">Loading logs...</p>
        ) : error ? (
          <p className="text-center py-10 text-sm text-red-500">{error}</p>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-gray-400">
            <NotebookText className="w-8 h-8" />
            <p className="text-sm">No change logs recorded yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log, i) => (
              <div key={log._id || i} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm capitalize text-primary">{log.field}</span>
                  <span className="text-xs text-gray-400">{formatTimestamp(log.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Previous</span>
                    <span className="text-sm text-red-500 wrap-break-word">{formatValue(log.previousValue, log.field, users)}</span>
                  </div>
                  <ArrowRight className="text-gray-300 w-5 h-5 shrink-0" />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Updated</span>
                    <span className="text-sm text-green-600 wrap-break-word">{formatValue(log.updatedValue, log.field, users)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

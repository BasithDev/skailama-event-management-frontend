import { Users,Clock, Edit,NotebookText } from "lucide-react";
function formatDateTime(isoString, timezone) {
  const date = new Date(isoString)
  const dateStr = date.toLocaleDateString('en-US', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  return { dateStr, timeStr }
}

function formatTimestamp(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export default function EventCard({ event, viewTimezone, onEdit, onViewLogs }) {
  const start = formatDateTime(event.startTime, viewTimezone)
  const end = formatDateTime(event.endTime, viewTimezone)
  const memberNames = event.members.map((m) => m.name).join(', ')

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2">
        <Users className="text-gray-500 w-4 h-4"/>
        <span className="font-semibold text-sm text-gray-900">{memberNames}</span>
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex items-start gap-2">
          <Clock className="text-gray-500 w-4 h-4 mt-1"/>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-gray-900">Start: {start.dateStr}</span>
            <span className="text-xs text-gray-500">{start.timeStr}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="text-gray-500 w-4 h-4 mt-1"/>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-gray-900">End: {end.dateStr}</span>
            <span className="text-xs text-gray-500">{end.timeStr}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 pt-2 border-t border-gray-100 text-xs text-gray-400">
        <p><span className="font-semibold">Created:</span> {formatTimestamp(event.createdAt)} | <span className="font-semibold">Updated:</span> {formatTimestamp(event.updatedAt)}</p>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white transition-all hover:bg-gray-50 hover:border-primary hover:text-primary cursor-pointer"
          onClick={() => onEdit(event)}
        >
          <Edit className="w-3.5 h-3.5"/>
          Edit
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white transition-all hover:bg-gray-50 hover:border-primary hover:text-primary cursor-pointer"
          onClick={() => onViewLogs(event._id)}
        >
          <NotebookText className="w-3.5 h-3.5"/>
          View Logs
        </button>
      </div>
    </div>
  )
}

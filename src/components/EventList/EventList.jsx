import TimezoneSelect from '../TimezoneSelect/TimezoneSelect.jsx'
import EventCard from '../EventCard/EventCard.jsx'
import { Loader2, UserCircle, CalendarX } from 'lucide-react'

export default function EventList({
  events,
  viewTimezone,
  onViewTimezoneChange,
  onEdit,
  onViewLogs,
  selectedProfile,
  loading,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Events</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-900">View in Timezone</label>
        <TimezoneSelect
          value={viewTimezone}
          onChange={onViewTimezoneChange}
          id="view-timezone"
        />
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading events...</p>
          </div>
        ) : !selectedProfile ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <UserCircle className="w-8 h-8" />
            <p className="text-sm">Select a profile to view events</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <CalendarX className="w-8 h-8" />
            <p className="text-sm">No events found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                viewTimezone={viewTimezone}
                onEdit={onEdit}
                onViewLogs={onViewLogs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

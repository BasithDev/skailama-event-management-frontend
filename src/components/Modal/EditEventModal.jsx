import { useState, useEffect } from 'react'
import Modal from './Modal.jsx'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown.jsx'
import TimezoneSelect from '../TimezoneSelect/TimezoneSelect.jsx'
import DateTimePicker from '../DateTimePicker/DateTimePicker.jsx'

function toLocalParts(isoString, timezone) {
  const date = new Date(isoString)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (type) => parts.find((p) => p.type === type)?.value || ''
  const dateStr = `${get('year')}-${get('month')}-${get('day')}`
  const timeStr = `${get('hour')}:${get('minute')}`
  return { dateStr, timeStr }
}

export default function EditEventModal({ isOpen, onClose, event, users, onAddUser, onUpdate }) {
  const [members, setMembers] = useState([])
  const [timezone, setTimezone] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (event) {
      setMembers(event.members.map((m) => m._id))
      setTimezone(event.timezone)
      const start = toLocalParts(event.startTime, event.timezone)
      const end = toLocalParts(event.endTime, event.timezone)
      setStartDate(start.dateStr)
      setStartTime(start.timeStr)
      setEndDate(end.dateStr)
      setEndTime(end.timeStr)
      setError('')
    }
  }, [event])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (members.length === 0) {
      setError('Select at least one profile')
      return
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      setError('All date/time fields are required')
      return
    }

    const startISO = `${startDate}T${startTime}`
    const endISO = `${endDate}T${endTime}`

    setSubmitting(true)
    try {
      await onUpdate(event._id, {
        members,
        timezone,
        startTime: startISO,
        endTime: endISO,
      })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Event">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">Profiles</label>
          <ProfileDropdown
            users={users}
            selected={members}
            onChange={setMembers}
            multiple={true}
            onAddUser={onAddUser}
            placeholder="Select profiles..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">Timezone</label>
          <TimezoneSelect value={timezone} onChange={setTimezone} id="edit-timezone" />
        </div>

        <DateTimePicker
          label="Start Date & Time"
          date={startDate}
          time={startTime}
          onDateChange={setStartDate}
          onTimeChange={setStartTime}
        />

        <DateTimePicker
          label="End Date & Time"
          date={endDate}
          time={endTime}
          onDateChange={setEndDate}
          onTimeChange={setEndTime}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="flex-1 py-2.5 border border-gray-200 rounded-lg font-medium bg-white hover:bg-gray-50 transition-all cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

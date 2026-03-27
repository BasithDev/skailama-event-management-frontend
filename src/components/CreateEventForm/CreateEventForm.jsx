import { useState } from 'react'
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown.jsx'
import TimezoneSelect from '../TimezoneSelect/TimezoneSelect.jsx'
import DateTimePicker from '../DateTimePicker/DateTimePicker.jsx'

export default function CreateEventForm({ users, onAddUser, onCreateEvent, loading }) {
  const [members, setMembers] = useState([])
  const [timezone, setTimezone] = useState('America/New_York')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => {
    setMembers([])
    setStartDate('')
    setStartTime('')
    setEndDate('')
    setEndTime('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (members.length === 0) {
      setError('Select at least one profile')
      return
    }
    if (!startDate || !startTime) {
      setError('Start date and time are required')
      return
    }
    if (!endDate || !endTime) {
      setError('End date and time are required')
      return
    }

    const startISO = `${startDate}T${startTime}`
    const endISO = `${endDate}T${endTime}`

    setSubmitting(true)
    try {
      await onCreateEvent({
        members,
        timezone,
        startTime: startISO,
        endTime: endISO,
      })
      resetForm()
      setSuccess('Event created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Create Event</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">Profiles</label>
          <ProfileDropdown
            users={users}
            selected={members}
            onChange={setMembers}
            multiple={true}
            onAddUser={onAddUser}
            loading={loading}
            placeholder="Select profiles..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">Timezone</label>
          <TimezoneSelect value={timezone} onChange={setTimezone} id="create-timezone" />
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
        {success && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">{success}</p>
        )}

        <button
          type="submit"
          className="py-3 bg-primary text-white font-semibold text-sm rounded-lg transition-all hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          disabled={submitting}
        >
          {submitting ? 'Creating...' : '+ Create Event'}
        </button>
      </form>
    </div>
  )
}

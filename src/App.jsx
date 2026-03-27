import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header/Header.jsx'
import CreateEventForm from './components/CreateEventForm/CreateEventForm.jsx'
import EventList from './components/EventList/EventList.jsx'
import EditEventModal from './components/Modal/EditEventModal.jsx'
import ViewLogsModal from './components/Modal/ViewLogsModal.jsx'
import * as api from './api/api.js'

export default function App() {
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [viewTimezone, setViewTimezone] = useState('America/New_York')

  const [editModal, setEditModal] = useState({ open: false, event: null })
  const [logsModal, setLogsModal] = useState({ open: false, eventId: null })

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.fetchUsers()
      setUsers(res.data)
    } catch (err) {
      console.error('Failed to load users:', err.message)
    } finally {
      setUsersLoading(false)
    }
  }, [])

  const loadEvents = useCallback(async (userId) => {
    if (!userId) {
      setEvents([])
      return
    }
    setEventsLoading(true)
    try {
      const res = await api.fetchEventsByMember(userId)
      setEvents(res.data)
    } catch (err) {
      if (err.message.includes('No Events found')) {
        setEvents([])
      } else {
        console.error('Failed to load events:', err.message)
      }
    } finally {
      setEventsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    loadEvents(selectedProfile)
  }, [selectedProfile, loadEvents])

  const handleAddUser = async (name) => {
    const res = await api.createUser(name)
    setUsers((prev) => [...prev, res.data])
    return res.data
  }

  const handleCreateEvent = async (data) => {
    await api.createEvent(data)
    if (selectedProfile) loadEvents(selectedProfile)
  }

  const handleUpdateEvent = async (eventId, data) => {
    await api.updateEvent(eventId, data)
    if (selectedProfile) loadEvents(selectedProfile)
  }

  const handleEdit = (event) => setEditModal({ open: true, event })
  const handleViewLogs = (eventId) => setLogsModal({ open: true, eventId })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        users={users}
        selectedProfile={selectedProfile}
        onProfileChange={setSelectedProfile}
        onAddUser={handleAddUser}
        loading={usersLoading}
      />

      <main className="flex-1 grid grid-cols-[1fr_1.4fr] gap-6 px-8 py-6 max-w-[1280px] w-full mx-auto max-[900px]:grid-cols-1 max-[900px]:px-4">
        <div className="sticky top-[90px] self-start max-[900px]:static">
          <CreateEventForm
            users={users}
            onAddUser={handleAddUser}
            onCreateEvent={handleCreateEvent}
            loading={usersLoading}
          />
        </div>

        <div className="min-h-[400px]">
          <EventList
            events={events}
            viewTimezone={viewTimezone}
            onViewTimezoneChange={setViewTimezone}
            onEdit={handleEdit}
            onViewLogs={handleViewLogs}
            selectedProfile={selectedProfile}
            loading={eventsLoading}
          />
        </div>
      </main>

      <EditEventModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, event: null })}
        event={editModal.event}
        users={users}
        onAddUser={handleAddUser}
        onUpdate={handleUpdateEvent}
      />

      <ViewLogsModal
        isOpen={logsModal.open}
        onClose={() => setLogsModal({ open: false, eventId: null })}
        eventId={logsModal.eventId}
        users={users}
      />
    </div>
  )
}

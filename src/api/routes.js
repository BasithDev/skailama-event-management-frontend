const ROUTES = {
  users: '/users',
  events: '/events',
  eventsByMember: (userId) => `/events/member/${userId}`,
  eventById: (eventId) => `/events/${eventId}`,
  eventLogs: (eventId) => `/events/${eventId}/logs`,
}

export default ROUTES

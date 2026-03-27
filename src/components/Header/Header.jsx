import ProfileDropdown from '../ProfileDropdown/ProfileDropdown.jsx'

export default function Header({ users, selectedProfile, onProfileChange, onAddUser, loading }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-40 max-md:flex-col max-md:gap-3 max-md:items-stretch max-md:px-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        <p className="text-sm text-gray-500">Create and manage events across multiple timezones</p>
      </div>
      <div className="w-[260px] max-md:w-full">
        <ProfileDropdown
          users={users}
          selected={selectedProfile}
          onChange={onProfileChange}
          multiple={false}
          onAddUser={onAddUser}
          loading={loading}
          placeholder="Select current profile..."
        />
      </div>
    </header>
  )
}

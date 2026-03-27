export default function DateTimePicker({ label, date, time, onDateChange, onTimeChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <div className="flex gap-2">
        <input
          type="date"
          className="flex-[1.5] px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-all hover:border-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
        <input
          type="time"
          className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-all hover:border-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </div>
    </div>
  )
}

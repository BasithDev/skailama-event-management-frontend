const timezones = Intl.supportedValuesOf('timeZone').map((tz) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    })
    const parts = formatter.formatToParts(new Date())
    const abbr = parts.find((p) => p.type === 'timeZoneName')?.value || ''
    const label = `${tz.replace(/_/g, ' ')} (${abbr})`
    return { value: tz, label }
  } catch {
    return { value: tz, label: tz }
  }
})

export default timezones

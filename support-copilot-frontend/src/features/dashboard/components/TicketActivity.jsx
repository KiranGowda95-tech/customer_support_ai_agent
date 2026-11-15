const activity = [
  { day: 'Mon', tickets: 42 },
  { day: 'Tue', tickets: 58 },
  { day: 'Wed', tickets: 46 },
  { day: 'Thu', tickets: 75 },
  { day: 'Fri', tickets: 62 },
  { day: 'Sat', tickets: 35 },
  { day: 'Sun', tickets: 50 },
];

function TicketActivity() {
  const maxTickets = Math.max(...activity.map((item) => item.tickets));
  return (
    <section className='rounded-xl border border-slate-200 bg-white p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-base font-semibold text-slate-900'>
            Ticket Activity
          </h2>

          <p className='mt-1 text-xs text-slate-400'>
            Weekly ticket volume · Demo data
          </p>
        </div>

        <span className='rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600'>
          Last 7 days
        </span>
      </div>
      <div className='mt-8 flex h-48 items-end justify-between gap-3'>
        {activity.map((item) => (
          <div
            key={item.day}
            className='flex h-full flex-1 flex-col items-center justify-end gap-3'
          >
            <div
              className='w-full max-w-10 rounded-t-md bg-blue-500 transition-all duration-300 hover:bg-blue-700'
              style={{
                height: `${(item.tickets / maxTickets) * 100}%`,
              }}
              title={`${item.tickets} tickets`}
            />

            <span className='text-xs text-slate-400'>{item.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TicketActivity;

function StatCard({
    title,
    value,
    change,
    description,
    icon:Icon,
    color
}) {
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm'>{title}</p>
          <h3 className='mt-3 text-3xl font-bold tracking-tight text-slate-900'>
            {value}
          </h3>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={19} />
        </div>
      </div>
      <div className='mt-5 flex items-center gap-2'>
        <span className='text-xs font-semibold text-emerald-600'>{change}</span>
        <span className='text-xs text-slate-400'>{description}</span>
      </div>
    </div>
  );
}

export default StatCard;
function NavItem({ icon: Icon, label, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3
        rounded-lg px-3 py-2.5 text-sm
        font-medium transition-all duration-200
        ${
          active
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      <Icon
        size={18}
        strokeWidth={1.8}
        className={
          active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
        }
      />

      <span className='flex-1 text-left'>{label}</span>

      {badge && (
        <span className='rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500'>
          {badge}
        </span>
      )}
    </button>
  );
}

export default NavItem;

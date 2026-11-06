import {
  Sparkles,
  Database,
  BrainCircuit,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

function AIOverview() {
  const items = [
    {
      icon: Database,
      title: 'Knowledge Base',
      description: 'Knowledge retrieval system',
      status: 'Ready',
    },
    {
      icon: BrainCircuit,
      title: 'Customer Memory',
      description: 'Contextual memory service',
      status: 'Ready',
    },
  ];

  return (
    <section className='rounded-xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600'>
          <Sparkles size={20} />
        </div>

        <div>
          <h2 className='text-base font-semibold text-slate-900'>
            AI Assistant
          </h2>

          <p className='text-xs text-slate-400'>
            Intelligence services · Demo status
          </p>
        </div>
      </div>

      <div className='mt-6 space-y-4'>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Icon size={18} className='text-slate-400' />

                <div>
                  <p className='text-xs font-semibold text-slate-800'>
                    {item.title}
                  </p>

                  <p className='mt-1 text-[10px] text-slate-400'>
                    {item.description}
                  </p>
                </div>
              </div>

              <span className='flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600'>
                <CheckCircle2 size={13} />
                {item.status}
              </span>
            </div>
          );
        })}
      </div>

      <div className='mt-6 rounded-lg bg-violet-50 p-4'>
        <p className='text-xs font-semibold text-violet-900'>
          AI-powered support
        </p>

        <p className='mt-1 text-[11px] leading-relaxed text-violet-700'>
          Generate contextual responses using customer history and your
          knowledge base.
        </p>

        <button className='mt-3 flex items-center gap-1 text-xs font-semibold text-violet-700'>
          Explore AI workspace
          <ArrowUpRight size={13} />
        </button>
      </div>
    </section>
  );
}

export default AIOverview;

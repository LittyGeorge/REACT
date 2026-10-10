import { useEffect, useRef } from 'react';
import { useDashboardDetails } from '../hooks/useDashboard';
import type { DashboardDetailKey } from '../types/dashboard';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function DashboardDetailsDialog({ detailKey, onClose }: { detailKey: DashboardDetailKey | null; onClose: () => void }) {
  const details = useDashboardDetails(detailKey);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detailKey) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [detailKey, onClose]);

  if (!detailKey) return null;

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}>
        <header className="detail-header">
          <div><p className="eyebrow">DASHBOARD DETAILS</p><h2 id="detail-title">{details.data?.title ?? 'Loading details'}</h2><p>{details.data?.description ?? 'Fetching the records behind this metric.'}</p></div>
          <button className="detail-close" type="button" aria-label="Close details" ref={closeButton} onClick={onClose}>×</button>
        </header>
        <div className="detail-records">
          {details.isPending && <div className="detail-state"><span className="button-spinner" /> Loading records…</div>}
          {details.isError && <div className="detail-state detail-error"><p>We couldn’t load these records.</p><button type="button" onClick={() => void details.refetch()}>Try again</button></div>}
          {details.isSuccess && details.data.records.length === 0 && <div className="detail-state">There are no records in this view.</div>}
          {details.data?.records.map((record) => (
            <article className="detail-record" key={record.id}>
              <div className="detail-record-main"><span className="detail-record-id">{record.id}</span><h3>{record.title}</h3><p>{record.subtitle}</p></div>
              <div className="detail-record-meta">
                {record.status && <span className="detail-status">{record.status}</span>}
                {record.date && <span>{record.date}</span>}
                {record.branchName && <span>{record.branchName}</span>}
                {record.amount !== undefined && <strong>{currency.format(record.amount)} due</strong>}
              </div>
            </article>
          ))}
        </div>
        <footer className="detail-footer"><span>Records shown are scoped to your role.</span><button type="button" onClick={onClose}>Done</button></footer>
      </section>
    </div>
  );
}

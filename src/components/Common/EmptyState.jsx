import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no active items in this view matching your filters.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-10 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

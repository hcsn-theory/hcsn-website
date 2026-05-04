import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  name?: string;
  isRoot?: boolean;
}

export function JsonViewer({ data, name, isRoot = true }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(isRoot);

  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data).length === 0;

  if (!isObject) {
    let valueClass = "text-emerald-400";
    if (typeof data === 'number') valueClass = "text-amber-400";
    if (typeof data === 'boolean') valueClass = "text-purple-400";
    if (data === null) valueClass = "text-zinc-500";

    return (
      <div className="flex font-mono text-[13px] leading-relaxed">
        {name && <span className="text-blue-300 mr-2">{name}:</span>}
        <span className={valueClass}>{data === null ? 'null' : data.toString()}</span>
      </div>
    );
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="font-mono text-[13px] leading-relaxed">
      <div 
        className="flex items-center cursor-pointer hover:bg-white/5 py-0.5 rounded -ml-1 pl-1 transition-colors group"
        onClick={toggleExpand}
      >
        <span className="w-4 h-4 flex items-center justify-center mr-1 text-zinc-500 group-hover:text-zinc-300">
          {!isEmpty && (
            isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          )}
        </span>
        {name && <span className="text-blue-300 mr-2">{name}:</span>}
        <span className="text-zinc-400">
          {isArray ? '[' : '{'}
          {!isExpanded && !isEmpty && <span className="text-zinc-500 px-1">...</span>}
          {isEmpty && (isArray ? ']' : '}')}
        </span>
        {!isExpanded && !isEmpty && (
          <span className="text-zinc-500 ml-1 text-xs">{Object.keys(data).length} items</span>
        )}
      </div>

      {isExpanded && !isEmpty && (
        <div className="pl-6 border-l border-zinc-800 ml-1 my-0.5">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="py-0.5">
              <JsonViewer data={value} name={isArray ? undefined : key} isRoot={false} />
            </div>
          ))}
        </div>
      )}

      {isExpanded && !isEmpty && (
        <div className="pl-1 text-zinc-400">
          {isArray ? ']' : '}'}
        </div>
      )}
    </div>
  );
}

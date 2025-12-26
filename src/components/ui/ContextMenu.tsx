// Context Menu component for right-click actions

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    // Adjust position if menu goes off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const adjustedX = position.x + rect.width > window.innerWidth 
        ? window.innerWidth - rect.width - 10 
        : position.x;
      const adjustedY = position.y + rect.height > window.innerHeight 
        ? window.innerHeight - rect.height - 10 
        : position.y;
      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      className="context-menu fixed z-[9999] min-w-[160px] py-1 rounded-sm overflow-hidden"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        background: 'linear-gradient(180deg, #2a2a40 0%, #1a1a2e 100%)',
        border: '1px solid #3a3a5a',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 255, 0, 0.1)',
      }}
    >
      {items.map((item, index) => (
        item.divider ? (
          <div key={index} className="h-px bg-[#00ff00]/20 my-1" />
        ) : (
          <button
            key={index}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
            className={cn(
              'w-full px-3 py-1.5 text-left text-xs flex items-center gap-2',
              'transition-colors',
              item.disabled 
                ? 'text-gray-600 cursor-not-allowed' 
                : item.danger
                  ? 'text-[#ff4444] hover:bg-[#ff4444]/10'
                  : 'text-[#00ff00] hover:bg-[#00ff00]/10'
            )}
          >
            {item.icon && <span className="w-4">{item.icon}</span>}
            {item.label}
          </button>
        )
      ))}
    </div>,
    document.body
  );
}

// Hook to manage context menu state
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    items: ContextMenuItem[];
  } | null>(null);

  const openContextMenu = useCallback((
    e: React.MouseEvent,
    items: ContextMenuItem[]
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      items,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
}

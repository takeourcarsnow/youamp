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
      className="context-menu fixed z-[9999] min-w-[140px] py-px overflow-hidden"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        background: '#232323',
        border: '2px solid',
        borderColor: '#4a4a4a #0a0a0a #0a0a0a #4a4a4a',
        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
      }}
    >
      {items.map((item, index) => (
        item.divider ? (
          <div 
            key={index} 
            className="h-px mx-1 my-px" 
            style={{ background: '#3a3a3a' }}
          />
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
              'w-full px-2 py-0.5 text-left text-[9px] flex items-center gap-1.5',
              'transition-none font-mono',
              item.disabled 
                ? 'text-[#444] cursor-not-allowed' 
                : item.danger
                  ? 'text-[#ff6666] hover:bg-[#aa0000] hover:text-white'
                  : 'text-[#00aa00] hover:bg-[#00aa00] hover:text-black'
            )}
          >
            {item.icon && <span className="w-3 text-center">{item.icon}</span>}
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

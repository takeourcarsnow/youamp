// Window dragging hook

import { useState, useCallback, useEffect, useRef } from 'react';
import { WindowPosition } from '@/types';

interface UseDraggableOptions {
  initialPosition: WindowPosition;
  onPositionChange?: (position: WindowPosition) => void;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

export function useDraggable({
  initialPosition,
  onPositionChange,
  bounds,
}: UseDraggableOptions) {
  const [position, setPosition] = useState<WindowPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<WindowPosition>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only allow dragging from left mouse button
      if (e.button !== 0) return;

      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      e.preventDefault();
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      // Apply bounds
      if (bounds) {
        if (bounds.minX !== undefined) newX = Math.max(bounds.minX, newX);
        if (bounds.maxX !== undefined) newX = Math.min(bounds.maxX, newX);
        if (bounds.minY !== undefined) newY = Math.max(bounds.minY, newY);
        if (bounds.maxY !== undefined) newY = Math.min(bounds.maxY, newY);
      }

      const newPosition = { x: newX, y: newY };
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    },
    [isDragging, bounds, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}

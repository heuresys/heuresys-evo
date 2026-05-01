'use client';

import * as React from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import { Button } from '../Button';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: { name: string; avatar?: string };
  badge?: React.ReactNode;
  meta?: React.ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

/**
 * KanbanBoard — accessible drag-drop kanban (column reorder + cross-column).
 * Uses @dnd-kit. Ships full keyboard navigation. (TIER 5)
 */
export function KanbanBoard({
  columns: initialColumns,
  onChange,
  onAddCard,
  className,
}: {
  columns: KanbanColumn[];
  onChange: (columns: KanbanColumn[]) => void;
  onAddCard?: (columnId: string) => void;
  className?: string;
}) {
  const [columns, setColumns] = React.useState(initialColumns);
  React.useEffect(() => setColumns(initialColumns), [initialColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(e: DragEndEvent) {
    const activeId = e.active.id as string;
    const overId = e.over?.id as string | undefined;
    if (!overId || activeId === overId) return;

    const activeCol = columns.find((c) => c.cards.some((x) => x.id === activeId));
    const overCol = columns.find((c) => c.id === overId || c.cards.some((x) => x.id === overId));
    if (!activeCol || !overCol) return;

    if (activeCol.id === overCol.id) {
      const oldIdx = activeCol.cards.findIndex((x) => x.id === activeId);
      const newIdx = activeCol.cards.findIndex((x) => x.id === overId);
      const next = columns.map((c) =>
        c.id === activeCol.id ? { ...c, cards: arrayMove(c.cards, oldIdx, newIdx) } : c
      );
      setColumns(next);
      onChange(next);
    } else {
      const card = activeCol.cards.find((x) => x.id === activeId)!;
      const next = columns.map((c) => {
        if (c.id === activeCol.id) return { ...c, cards: c.cards.filter((x) => x.id !== activeId) };
        if (c.id === overCol.id) return { ...c, cards: [...c.cards, card] };
        return c;
      });
      setColumns(next);
      onChange(next);
    }
  }

  return (
    <div
      className={cn('flex gap-4 overflow-x-auto pb-4', className)}
      role="list"
      aria-label="Kanban board"
    >
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        {columns.map((col) => (
          <KanbanColumnView
            key={col.id}
            column={col}
            onAddCard={onAddCard ? () => onAddCard(col.id) : undefined}
          />
        ))}
      </DndContext>
    </div>
  );
}

function KanbanColumnView({ column, onAddCard }: { column: KanbanColumn; onAddCard?: () => void }) {
  return (
    <section
      role="listitem"
      aria-label={`${column.title}, ${column.cards.length} cards`}
      className="flex w-72 shrink-0 flex-col gap-2 rounded-md bg-muted/40 p-3"
    >
      <header className="flex items-center justify-between">
        <h3
          className="text-sm font-semibold"
          style={column.color ? { color: column.color } : undefined}
        >
          {column.title}
          <span className="ml-2 rounded-full bg-background px-1.5 py-0.5 text-xs text-muted-fg">
            {column.cards.length}
          </span>
        </h3>
        {onAddCard ? (
          <Button
            size="icon"
            variant="ghost"
            onClick={onAddCard}
            aria-label={`Add card to ${column.title}`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : null}
      </header>
      <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {column.cards.map((c) => (
            <SortableCardItem key={c.id} card={c} />
          ))}
        </ul>
      </SortableContext>
    </section>
  );
}

function SortableCardItem({ card }: { card: KanbanCard }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <li ref={setNodeRef} style={style}>
      <Card className="p-3">
        <div className="flex items-start gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Drag card: ${card.title}`}
            className="cursor-grab text-muted-fg hover:text-foreground active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">{card.title}</h4>
            {card.description ? (
              <p className="mt-1 text-xs text-muted-fg">{card.description}</p>
            ) : null}
            <div className="mt-2 flex items-center gap-2 text-xs">
              {card.badge}
              {card.meta}
              {card.assignee ? (
                <span className="ml-auto text-muted-fg">{card.assignee.name}</span>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
}

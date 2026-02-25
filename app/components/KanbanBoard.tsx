"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { memo, useState } from "react";
import {
  COLUMNS,
  KanbanColumn,
  getTasksByColumn,
  PLACEHOLDER_TASKS,
  TaskDialog,
  TaskSearchBar,
} from "./kanban";
import type { Task } from "./kanban";

const COLUMN_IDS = new Set(COLUMNS.map((c) => c.id));

function getTargetColumnId(overId: string | null, tasks: Task[]): string | null {
  if (!overId) return null;
  if (COLUMN_IDS.has(overId)) return overId;
  const task = tasks.find((t) => t.id === overId);
  return task ? task.column : null;
}

const OverlayCard = memo(function OverlayCard({ task }: { task: Task }) {
  return (
    <Card
      variant="outlined"
      sx={{
        cursor: "grabbing",
        minWidth: 260,
        boxShadow: 3,
        willChange: "transform",
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
});

function DragOverlayContent() {
  const { active } = useDndContext();
  const task = active?.data?.current?.task as Task | undefined;
  if (!task) return null;
  return <OverlayCard task={task} />;
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(PLACEHOLDER_TASKS);
  const tasksByColumn = getTasksByColumn(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const targetColumnId = getTargetColumnId(over?.id as string, tasks);
    if (!targetColumnId) return;
    const taskId = String(active.id);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: targetColumnId } : t))
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1600, p: 2, mx: "auto" }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
        Kanban ToDo
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TaskSearchBar />
      </Box>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            minHeight: 480,
          }}
        >
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasksByColumn[col.id] ?? []}
            />
          ))}
        </Box>

        <DragOverlay dropAnimation={null}>
          <DragOverlayContent />
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={false}
        onClose={() => {}}
        title="Add task"
        columns={COLUMNS}
      />
    </Box>
  );
}

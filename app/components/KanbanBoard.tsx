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
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultColumnId, setDefaultColumnId] = useState("backlog");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [cardsPerPage, setCardsPerPage] = useState(5);
  const tasksByColumn = getTasksByColumn(tasks);

  function handleAddTask(columnId?: string) {
    setEditingTask(null);
    setDefaultColumnId(columnId ?? "backlog");
    setDialogOpen(true);
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
    setDefaultColumnId(task.column);
    setDialogOpen(true);
  }

  function handleDeleteTask(task: Task) {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  function handleSaveTask(data: { id?: string; title: string; description: string; column: string }) {
    if (data.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === data.id
            ? { ...t, title: data.title, description: data.description, column: data.column }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        column: data.column,
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setEditingTask(null);
  }

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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h4" fontWeight={600}>
          Kanban ToDo
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="cards-per-page-label">Cards per page</InputLabel>
            <Select
              labelId="cards-per-page-label"
              label="Cards per page"
              value={cardsPerPage}
              onChange={(e) => setCardsPerPage(Number(e.target.value))}
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleAddTask()}>
            Add task
          </Button>
        </Box>
      </Box>

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
              cardsPerPage={cardsPerPage}
              onAddTask={() => handleAddTask(col.id)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </Box>

        <DragOverlay dropAnimation={null}>
          <DragOverlayContent />
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit task" : "Add task"}
        columns={COLUMNS}
        initialColumnId={defaultColumnId}
        editingTask={editingTask}
        onSave={handleSaveTask}
      />
    </Box>
  );
}

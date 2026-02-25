"use client";

import { Box, Button, Chip, IconButton, Paper, Pagination, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "./TaskCard";
import type { ColumnDef, Task } from "./types";
import { useDroppable } from "@dnd-kit/core";

type KanbanColumnProps = {
  column: ColumnDef;
  tasks: Task[];
  onAddTask?: (columnId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onLoadMore?: (columnId: string) => void;
};

export default function KanbanColumn({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onLoadMore,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <Paper
      elevation={0}
      sx={{
        flex: "0 0 300px",
        minWidth: 300,
        borderRadius: 2,
        border: "1px solid",
        borderColor: isOver ? "primary.main" : "divider",
        bgcolor: isOver ? "action.hover" : "grey.50",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: column.color,
            }}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            {column.title}
          </Typography>
          <Chip label={tasks.length} size="small" sx={{ fontWeight: 600 }} />
        </Box>
        <IconButton
          size="small"
          aria-label={`Add task to ${column.title}`}
          sx={{ color: "text.secondary" }}
          onClick={() => onAddTask?.(column.id)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          p: 1.5,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          minHeight: 0,
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        <Box
          sx={{
            mt: "auto",
            pt: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Button size="small" variant="text" fullWidth onClick={() => onLoadMore?.(column.id)}>
            Load more
          </Button>
          <Pagination count={3} size="small" color="primary" hidePrevButton hideNextButton />
        </Box>
      </Box>
    </Paper>
  );
}

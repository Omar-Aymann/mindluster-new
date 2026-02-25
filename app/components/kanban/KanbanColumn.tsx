"use client";

import { Box, Chip, IconButton, Paper, Pagination, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import type { ColumnDef, Task } from "./types";
import { useDroppable } from "@dnd-kit/core";

const COLUMN_MAX_HEIGHT = 480;
const CARDS_PER_PAGE = 5;

type KanbanColumnProps = {
  column: ColumnDef;
  tasks: Task[];
  cardsPerPage?: number;
  onAddTask?: (columnId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
};

export default function KanbanColumn({
  column,
  tasks,
  cardsPerPage = CARDS_PER_PAGE,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tasks.length / cardsPerPage));
  const startIdx = (page - 1) * cardsPerPage;
  const visibleTasks = tasks.slice(startIdx, startIdx + cardsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(Math.max(1, totalPages));
  }, [page, totalPages]);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: "0 0 300px",
        minWidth: 300,
        maxHeight: COLUMN_MAX_HEIGHT,
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
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {totalPages > 1 && (
          <Box
            sx={{
              mt: "auto",
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="small"
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

"use client";

import { useDraggable } from "@dnd-kit/core";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Task } from "./types";

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      {...listeners}
      {...attributes}
      sx={{
        cursor: "grab",
        flexShrink: 0,
        opacity: isDragging ? 0.3 : 1,
        "&:active": { cursor: "grabbing" },
        "&:hover": { boxShadow: 1 },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {task.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.25 }}>
            <IconButton
              size="small"
              aria-label="Edit task"
              onClick={() => onEdit?.(task)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <CreateIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Delete task"
              color="error"
              onClick={() => onDelete?.(task)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

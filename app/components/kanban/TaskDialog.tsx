"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ColumnDef, Task } from "./types";

export type TaskFormData = {
  id?: string;
  title: string;
  description: string;
  column: string;
};

type TaskDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  columns: ColumnDef[];
  initialColumnId?: string;
  editingTask?: Task | null;
  onSave?: (data: TaskFormData) => void;
};

export default function TaskDialog({
  open,
  onClose,
  title: dialogTitle,
  columns,
  initialColumnId = "backlog",
  editingTask,
  onSave,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState(initialColumnId);

  useEffect(() => {
    if (open) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description);
        setColumn(editingTask.column);
      } else {
        setTitle("");
        setDescription("");
        setColumn(initialColumnId);
      }
    }
  }, [open, initialColumnId, editingTask]);

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSave?.({
      id: editingTask?.id,
      title: trimmedTitle,
      description: description.trim(),
      column,
    });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { overflow: "hidden" } },
      }}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent sx={{ overflow: "hidden" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            placeholder="Task description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="task-column-label">Column</InputLabel>
            <Select
              labelId="task-column-label"
              label="Column"
              value={column}
              onChange={(e) => setColumn(e.target.value)}
            >
              {columns.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!title.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

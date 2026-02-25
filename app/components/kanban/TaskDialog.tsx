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
import type { ColumnDef, Task } from "./types";

type TaskDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  columns: ColumnDef[];
  initialTitle?: string;
  initialDescription?: string;
  initialColumnId?: string;
  onSave?: (data: { title: string; description: string; column: string }) => void;
};

export default function TaskDialog({
  open,
  onClose,
  title: dialogTitle,
  columns,
  initialTitle = "",
  initialDescription = "",
  initialColumnId = "backlog",
  onSave,
}: TaskDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            placeholder="Task title"
            defaultValue={initialTitle}
            slotProps={{ input: { id: "task-dialog-title" } }}
          />
          <TextField
            label="Description"
            fullWidth
            placeholder="Task description"
            multiline
            rows={3}
            defaultValue={initialDescription}
            slotProps={{ input: { id: "task-dialog-description" } }}
          />
          <FormControl fullWidth>
            <InputLabel id="task-column-label">Column</InputLabel>
            <Select
              labelId="task-column-label"
              label="Column"
              defaultValue={initialColumnId}
              slotProps={{ input: { id: "task-dialog-column" } }}
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
          onClick={() => {
            // Caller can read form state or use controlled inputs; here we just notify
            onSave?.({
              title: initialTitle,
              description: initialDescription,
              column: initialColumnId,
            });
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

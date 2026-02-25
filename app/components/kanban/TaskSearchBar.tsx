"use client";

import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type TaskSearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function TaskSearchBar({
  value = "",
  onChange,
  placeholder = "Search by title or description...",
}: TaskSearchBarProps) {
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      size="small"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{ maxWidth: 400 }}
    />
  );
}

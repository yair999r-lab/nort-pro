import { Box, Chip } from "@mui/material";
import type { FilterInterface } from "@/global/types/filter.types";

type ActiveFiltersBarProps = {
  selectedOptions: FilterInterface[];
  onRemoveFilter: (key: string) => void;
};

const ActiveFiltersBar = ({
  selectedOptions,
  onRemoveFilter,
}: ActiveFiltersBarProps) => {
  if (selectedOptions.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 1,
      }}
    >
      {selectedOptions.map((filter) => (
        <Chip
          key={filter.key}
          size="small"
          label={`${filter.label}: ${
            Array.isArray(filter.value)
              ? filter.value.join(", ")
              : filter.value
          }`}
          onDelete={() => onRemoveFilter(filter.key)}
        />
      ))}
    </Box>
  );
};

export default ActiveFiltersBar;
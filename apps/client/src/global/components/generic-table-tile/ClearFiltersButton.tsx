import { IconButton, Tooltip } from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

type ClearFiltersButtonProps = {
  disabled: boolean;
  onClick: () => void;
};

const ClearFiltersButton = ({
  disabled,
  onClick,
}: ClearFiltersButtonProps) => (
  <Tooltip title="נקה את כל הפילטרים">
    <span>
      <IconButton
        aria-label="נקה את כל הפילטרים"
        size="small"
        disabled={disabled}
        onClick={onClick}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: "50%",
        }}
      >
        <FilterAltOffIcon fontSize="small" />
      </IconButton>
    </span>
  </Tooltip>
);

export default ClearFiltersButton;
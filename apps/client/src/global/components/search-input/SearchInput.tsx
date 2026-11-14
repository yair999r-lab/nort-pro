import { IconButton } from "@mui/material";
import { ChangeEvent, CSSProperties, FC } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { SEARCH_INPUT_STYLE } from "./search-input.style";

type SearchInputProps = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: CSSProperties["width"];
  noIcon?: boolean;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
};

const SearchInput: FC<SearchInputProps> = ({
  onChange,
  placeholder,
  width = "100%",
  noIcon,
  containerStyle,
  inputStyle,
}) => {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid white",
        width,
        paddingInline: "8px",
        ...containerStyle,
      }}
    >
      {!noIcon && (
        <IconButton sx={{ p: 0 }}>
          <SearchIcon />
        </IconButton>
      )}
      <input
        type="text"
        style={{ ...SEARCH_INPUT_STYLE, ...inputStyle }}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;

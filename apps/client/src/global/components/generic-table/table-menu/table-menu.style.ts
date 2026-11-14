import { CSSProperties } from "react";

export const getMenuItemStyle = (
  menuItemBorderColor: CSSProperties["color"]
): CSSProperties => ({
  cursor: "pointer",
  borderBottom: `1px solid ${menuItemBorderColor}`,
  borderRadius: 5,
  padding: "8px",
  display: "flex",
  justifyContent: "center",
});

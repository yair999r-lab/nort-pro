import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { FilterInterface } from "../types/filter.types";

type SelectedOptionsByTable = {
  [tableId: string]: FilterInterface[];
};

type FilterContextValue = {
  selectedOptionsByTable: SelectedOptionsByTable;
  setSelectedOptionsForTable: (
    tableId: string,
    options: FilterInterface[]
  ) => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOptionsByTable, setSelectedOptionsByTable] =
    useState<SelectedOptionsByTable>({});

  const setSelectedOptionsForTable = useCallback(
  (tableId: string, options: FilterInterface[]) => {
    setSelectedOptionsByTable((prev) => ({
      ...prev,
      [tableId]: options,
    }));
  },
  []
);

  return (
    <FilterContext.Provider
      value={{
        selectedOptionsByTable,
        setSelectedOptionsForTable,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilterContext must be used inside FilterProvider");
  }

  return context;
};

export default FilterProvider;
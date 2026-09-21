export type ResultFilterState = {
  values: Record<string, string>;
  onlyBillGoose: boolean;
  includeSupplier: boolean;
  networks: string[];
  simValues: Record<string, string[]>;
  stickeeFilters: Record<string, unknown>;
};

export const MOBILESHOP_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";
export const DEFAULT_OPTION = "Default Title";

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

interface PaginationResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type JoinQuery<T extends Record<string, any>> = {
  [K in keyof T]?: boolean | "*" | (keyof T[K])[] | JoinQuery<T[K]>;
};

export type SelectQuery<T extends Record<string, any>> = {
  [K in keyof T]?: boolean | "*" | (keyof T[K])[] | JoinQuery<T[K]>;
};

type SortOrder = "asc" | "desc";

interface SortParams {
  sort?: string;
  order?: SortOrder;
  defaultSort?: string;
  defaultOrder?: SortOrder;
}

export class SupabaseHelper {
  /**
   * Formats a Supabase select query.
   *
   * @param selectQueries - Fields to select and joins
   * @returns Formatted select query string
   *
   * @example
   * // Simple usage
   * formatSelectQuery({ id: true, name: true })
   * // => "id, name"
   *
   * @example
   * // Join usage
   * formatSelectQuery({ id: true, products: "*" })
   * // => "id, products(*)"
   *
   * @example
   * // Join with specific fields
   * formatSelectQuery({ id: true, products: ["id", "name"] })
   * // => "id, products(id, name)"
   *
   * @example
   * // Nested join
   * formatSelectQuery({
   *   id: true,
   *   products: {
   *     id: true,
   *     categories: "*"
   *   }
   * })
   * // => "id, products(id, categories(*))"
   */
  formatSelectQuery = <T extends Record<string, any>>(
    selectQueries: SelectQuery<T> | undefined
  ): string => {
    if (!selectQueries) return "*";

    return Object.entries(selectQueries)
      .map(([key, value]) => {
        if (typeof value === "boolean") {
          return value ? key : null;
        }
        if (value === "*") {
          return `${key}(*)`;
        }
        if (Array.isArray(value)) {
          return `${key}(${value.join(", ")})`;
        }
        if (typeof value === "object" && value !== null) {
          const nestedQuery = this.formatSelectQuery(value as SelectQuery<T>);
          return `${key}(${nestedQuery})`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
  };

  /**
   * Applies sorting to a Supabase query.
   *
   * @param query - Supabase query to apply sorting
   * @param params - Sorting parameters
   * @returns Query with sorting applied
   *
   * @example
   * // With custom sort
   * const query = applySort(baseQuery, { sort: "name", order: "asc" })
   *
   * @example
   * // With default sort
   * const query = applySort(baseQuery, {
   *   defaultSort: "created_at",
   *   defaultOrder: "desc"
   * })
   *
   * @example
   * // With both custom and default sort
   * const query = applySort(baseQuery, {
   *   sort: "name",
   *   order: "asc",
   *   defaultSort: "created_at",
   *   defaultOrder: "desc"
   * })
   */
  applySort = <T extends PostgrestFilterBuilder<any, any, any[]>>(
    query: T,
    {
      sort,
      order,
      defaultSort = "created_at",
      defaultOrder = "desc",
    }: SortParams
  ): T => {
    if (sort) {
      return query.order(sort, { ascending: order === "asc" });
    }
    return query.order(defaultSort, { ascending: defaultOrder === "asc" });
  };

  /**
   * Returns pagination results for a Supabase query.
   *
   * @param query - Supabase query
   * @param params - Pagination parameters
   * @returns Pagination results
   *
   * @example
   * const result = await getPaginationResult(query, { page: 1, pageSize: 10 })
   * // => { data: [...], count: 100, page: 1, pageSize: 10, totalPages: 10 }
   */
  async getPaginationResult<T>(
    query: PostgrestFilterBuilder<any, any, any[]>,
    { page = 1, pageSize = 10 }: PaginationParams
  ): Promise<PaginationResult<T>> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      data: data as T[],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }
}

/**
 * ### Supabase Helper
 *
 * @description
 * This class provides helper methods to create Supabase queries in a more convenient and type-safe way.
 */
const supabaseHelper = new SupabaseHelper();

export default supabaseHelper;

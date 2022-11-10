export interface PaginateType<T> {
  page: number;
  nextPage: number | null;
  previousPage: number | null;
  results: T[];
  totalPages: number;
  countResults: number;
}

export interface PaginateOptions {
  page: number;
  size: number;
  skip: number;
}

export default async <T>(
  results: T[],
  filter: { where: unknown } | unknown,
  model: { count: (arg0: any) => any },
  options: PaginateOptions,
): Promise<PaginateType<T>> => {
  const countResults = await model.count(filter);
  const totalPages = Math.ceil(countResults / options.size);
  return {
    page: options.page,
    nextPage: options.page < totalPages ? options.page + 1 : null,
    previousPage: options.page > 1 ? options.page - 1 : null,
    totalPages,
    countResults,
    results,
  };
};

type QueryStringOrderBy<T> = {
  [key in keyof T]?: QueryStringOrderBy<T[key]> | 'asc' | 'desc';
};

type QueryStringInclude<T> = {
  [key in keyof T]?: QueryStringInclude<T[key]> | boolean;
};

type QueryStringSelect<T> = {
  [key in keyof T]?: QueryStringSelect<T[key]> | boolean;
};

type QueryStringWhere<T> = {
  [key in keyof T]?:
    | QueryStringWhere<T[key]>
    | number
    | string
    | boolean
    | Date
    | null
    | undefined
    | (number | string | boolean | Date | null | undefined)[];
};

export interface QueryStringOptions<T = any> {
  include?: QueryStringInclude<T>;
  where?: QueryStringWhere<T>;
  select?: QueryStringSelect<T>;
  orderBy?: QueryStringOrderBy<T>;
}

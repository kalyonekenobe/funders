export const excludeMany = <Model, Key extends keyof Model>(
  models: Model[],
  keys: Key[],
): Omit<Model, Key>[] => models.map(item => exclude(item, keys));

export const exclude = <Model, Key extends keyof Model>(
  model: Model,
  keys: Key[],
): Omit<Model, Key> => {
  return Object.fromEntries(
    Object.entries(model as { [key: string]: unknown }).filter(
      ([key]) => !keys.includes(key as Key),
    ),
  ) as Omit<Model, Key>;
};

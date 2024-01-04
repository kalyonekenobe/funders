import { Prisma } from '@prisma/client';

const prismaModelSuffix = 'ScalarFieldEnum';
type PrismaModelSuffix = 'ScalarFieldEnum';

type Models<Model extends string> = Model extends `${infer Model}${PrismaModelSuffix}`
  ? Model
  : never;

type Keys<Model extends Models<keyof typeof Prisma>> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${Model}${PrismaModelSuffix}`>],
  string
>;

type Fields<Model extends Models<keyof typeof Prisma>, Key extends Keys<Model>> = Record<
  Exclude<Keys<Model>, Key>,
  boolean
>;

export const exclude = <Model extends Models<keyof typeof Prisma>, Key extends Keys<Model>>(
  model: Model,
  omit: Key[],
): Fields<Model, Key> => {
  const fields = new Object() as Fields<Model, Key>;
  for (const key in Prisma[`${model}${prismaModelSuffix}`]) {
    fields[key as Exclude<Keys<Model>, Key>] = !omit.includes(key as Key);
  }
  return fields;
};

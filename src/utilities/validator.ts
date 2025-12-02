import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

type ValidationOptions = {
  whitelist?: boolean;
};

export default async function validator<T extends object>(
  dtoClass: new () => T,
  body: any,
  options: ValidationOptions = {}
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, body, {
    enableImplicitConversion: true,
  });

  const errors = await validate(dtoInstance, {
    whitelist: options.whitelist || false,
  });

  if (errors.length > 0) {
    const error = Object.values(errors[0]?.constraints as any).pop();
    throw new Error(error as string);
  }

  return dtoInstance;
}

import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DecimalMin', async: false })
export class DecimalMin implements ValidatorConstraintInterface {
  validate(value: any, validationArguments: ValidationArguments): boolean | Promise<boolean> {
    return Number(value) > validationArguments.constraints[0];
  }
  defaultMessage?(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} must not be less than ${validationArguments.constraints[0]}`;
  }
}

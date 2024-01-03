import { DynamicModule, Module } from '@nestjs/common';
import { PasswordService } from './password.service';

@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {
  static forRoot(saltPrefix: string, saltSuffix: string, saltRounds: number = 10): DynamicModule {
    return {
      module: PasswordModule,
      providers: [
        {
          provide: PasswordService,
          useValue: new PasswordService(saltPrefix, saltSuffix, saltRounds),
        },
      ],
      exports: [PasswordService],
    };
  }
}

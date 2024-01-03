import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from 'src/core/password/password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  const passwordService = new PasswordService(
    process.env.USER_PASSWORD_SALT_PREFIX!,
    process.env.USER_PASSWORD_SALT_SUFFIX!,
    10,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    })
      .overrideProvider(PasswordService)
      .useValue({
        hash: jest
          .fn()
          .mockImplementation((password: string) =>
            Promise.resolve(passwordService.hash(password)),
          ),
        compare: jest
          .fn()
          .mockImplementation((password: string, hash: string) =>
            Promise.resolve(passwordService.compare(password, hash)),
          ),
      })
      .compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a string', async () => {
    await expect(service.hash('password')).resolves.not.toThrow();
  });

  it('should say that password is correct', async () => {
    expect(await service.compare('password', await service.hash('password'))).toEqual(true);
  });

  it('should say that password is incorrect', async () => {
    expect(await service.compare('password_2', await service.hash('password'))).toEqual(false);
  });
});

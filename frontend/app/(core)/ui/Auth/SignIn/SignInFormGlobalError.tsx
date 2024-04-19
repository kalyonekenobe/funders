'use client';

import useNotification from '@/app/(core)/hooks/notifications.hooks';
import { NotificationType } from '@/app/(core)/utils/notifications.utils';
import { ApplicationRoutes } from '@/app/(core)/utils/routes.utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const SignInFormGlobalError: FC = () => {
  const { createNotification } = useNotification();
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.get('error')) {
      setError(params.get('error'));
      router.push(ApplicationRoutes.SignIn);
    }
  }, [params]);

  useEffect(() => {
    if (error) {
      createNotification({
        type: NotificationType.Error,
        message: error,
      });
    }
  }, [error]);

  return null;
};

export default SignInFormGlobalError;

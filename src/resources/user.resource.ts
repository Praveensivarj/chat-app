import { User } from '../models/user.model';
import { getFlagUrl, genderFormatted, formatDate } from '../utils/common.utils';

export const shapeLoginUser = (user: User): Record<string, unknown> => {
  return {
    unique_id: user.unique_id,
    email: user.email,
    timezone: user.timezone ?? '',
    gender: genderFormatted(user.gender),
    mobile: user.mobile ?? '',
    mobile_country_code: user.mobile_country_code ?? '',
    flag_url: getFlagUrl(user.mobile_country_code),
    status: user.status,
    email_status: user.email_verified_at ? 'VERIFIED' : 'NOT_VERIFIED',
  };
};

export const shapeCredentials = (user: User): Record<string, unknown> => {
    return {
        unique_id: user.unique_id,
        api_key: user.api_key ?? '',
        salt_key: user.salt_key ?? '',
        private_key: user.private_key ?? '',
    };
};

export const authTokensToJSON = (
  user: User | null,
  accessToken: string,
  refreshToken: string,
): Record<string, unknown> => {
  const response: Record<string, unknown> = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  if (user) {
    response.user = shapeLoginUser(user);
  }

  return response;
};

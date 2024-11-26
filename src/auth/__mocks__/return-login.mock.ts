import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { ReturnLogin } from '../dtos/returnLogin.dto';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLogin = {
  accessToken: jwtMock,
  user: new ReturnUserDto(userEntityMock),
};

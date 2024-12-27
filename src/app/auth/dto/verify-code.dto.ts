import { UserDto } from "./user.dto";

export class VerifyCodeDto {
  email!: string;
  user!: UserDto;
  accessToken!: string;
  refreshToken!: string;
}   
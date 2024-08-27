import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Employee } from 'src/modules/employee/employee.entity';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.SECRET_JWT,
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<Employee>> {
    if (!payload.is_active) {
      throw new UnauthorizedException('Данная учетная запись отключена.');
    }
    return {
      id: payload.id,
      login: payload.login,
      role: payload.role,
      name: payload.name,
    };
  }
}

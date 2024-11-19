import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtém os papéis (roles) necessários para acessar esta rota.
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se não houver papéis definidos, permite o acesso.
    if (!requiredRoles) {
      return true;
    }

    // Extrai o token de autenticação do cabeçalho da requisição.
    const { authorization } = context.switchToHttp().getRequest().headers;

    // Tenta verificar o token JWT e extrair as informações do usuário logado.
    // Se houver algum erro na verificação, captura e retorna undefined.
    const loginPayload: LoginPayload | undefined = await this.jwtService
      .verifyAsync(authorization, {
        secret: process.env.JWT_SECRET,
      })
      .catch(() => undefined);

    // Se o token for inválido ou não existir, nega o acesso.
    if (!loginPayload) {
      return false;
    }

    // Verifica se algum dos papéis necessários está presente nos papéis do usuário.
    const hasPermission = requiredRoles.some(
      (role) => role === loginPayload.typeUser,
    );

    return hasPermission;
  }
}

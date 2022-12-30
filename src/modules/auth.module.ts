import { JwtAuthGuard } from "@/infra/auth/guards/jwt-auth-guard";
import { RolesGuard } from "@/infra/auth/guards/role-guard";
import { JwtStrategy } from "@/infra/auth/strategies/jwt-strategy";
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [PassportModule],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}

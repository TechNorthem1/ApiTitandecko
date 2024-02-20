import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt"){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // Aquí, adapta la condición según tu lógica para identificar rutas que no requieran autenticación
        if (request.route.path === "/cart-abandoment" || request.route.path === "/api/v1/orders/google/feed") {
          return true;
        }
        return super.canActivate(context);
      }
}
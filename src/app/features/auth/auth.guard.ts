import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "./auth.services";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) {
    return false;
  }

  if (auth.user()) {
    return true;
  }

  return auth.getUserByToken().pipe(
    map((user) => {
      if (user) {
        return true;
      }
      router.navigate(["/auth"]);
      return false;
    }),
  );
};

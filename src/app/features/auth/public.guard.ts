import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "./auth.services";

export const publicGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) {
    return true;
  }

  return auth.getUserByToken().pipe(
    map((user) => {
      if (user) {
        router.navigate(["/profile"]);
        return false;
      }
      return true;
    }),
  );
};

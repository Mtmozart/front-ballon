import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";
import { routes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

import { provideAnimations } from "@angular/platform-browser/animations";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
  ],
};

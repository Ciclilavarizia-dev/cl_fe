import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';

bootstrapApplication(App, {
  providers: [

    // L’interceptor è registrato globalmente 
    // tramite questa funzione, quindi impatta
    // tutte le richieste HTTP dell’app.
    provideHttpClient(withInterceptors([authInterceptor])),

    provideRouter(routes)
  ]
}).catch((err) => console.error(err));

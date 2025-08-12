import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export function ApiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        console.error('404 Not Found:', error.url);
        // Handle 404 errors (route not found)
        // You might want to navigate to a 404 page or show a user-friendly message
      } else if (error.status >= 500) {
        console.error('Server Error:', error);
        // Handle server-side errors
      } else if (error.status >= 400) {
        console.error('Client Error:', error);
        // Handle client-side errors (e.g., bad request, validation errors)
      }
      return throwError(() => error);
    })
  );
}

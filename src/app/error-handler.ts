import { ErrorHandler, Injectable, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements OnInit {

  ngOnInit() {  }

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
    return 'No Internet Connection';
  }
   return error.message ? error.message : error.toString();
  }

  getClientStack(error: Error): string {
   return error.stack;
  }

  getServerMessage(error: HttpErrorResponse): string {
   return error.message;
  }

  getServerStack(error: HttpErrorResponse): string {
    // handle stack trace
    return 'stack';
  }

  // handleError(error) {
  //   console.log("GlobalErrorHandler -> handleError -> error", error)
  //   alert(error)
  // }
}

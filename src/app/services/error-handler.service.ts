import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  alertError(errMsg) {
    console.log("ErrorHandlerService -> alertError -> errMsg", errMsg);

    (errMsg != undefined)
      ? alert("Ошибка:" + errMsg) 
      : alert("Произошла ошибка на сервере.")
  }
}

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "truncate",
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = "...") {
    if (value != undefined) {
      if (completeWords) {
        limit = value.substr(0, limit).lastIndexOf(" ");
      }
      return value.length > limit ? value.substr(0, limit) + ellipsis : value;
    }
  }
}
/*
  limit - string max length
  completeWords - Flag to truncate at the nearest complete word, instead of character
  ellipsis - appended trailing suffix


  <h1>{{longStr | truncate }}</h1> 
  <!-- Outputs: A really long string that... -->

  <h1>{{longStr | truncate : 12 }}</h1> 
  <!-- Outputs: A really lon... -->

  <h1>{{longStr | truncate : 12 : true }}</h1> 
  <!-- Outputs: A really... -->

  <h1>{{longStr | truncate : 12 : false : '***' }}</h1> 
  <!-- Outputs: A really lon*** -->
*/

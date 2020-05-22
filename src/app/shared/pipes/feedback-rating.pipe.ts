import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'feedbackRating'
})
export class FeedbackRatingPipe implements PipeTransform {

  transform(value: any): string {
    if(value == 1){
      return "pooor"
    }
    else if(value == 2){
      return "fair"
    }
 
    else if(value == 3){
      return "good"
    }
 
    else if(value == 4){
      return "very good"
    }
 
    else if(value == 5){
      return "excellent"
    }
 
  }

}

import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[numberOnly]'
})

/**Directive for allowing only numbers
 * 
 */
export class NumberOnlyDirective {
    @HostListener('keypress', ['$event'])
    onkeypress(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
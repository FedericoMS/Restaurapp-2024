import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dayName',
  standalone: true
})
export class DayNamePipe implements PipeTransform {
  constructor(){}
  transform(value: Date): string {
    const date = new Date(value);

    const numberDay = date.getDay();

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    return dayNames[numberDay];
  }

}

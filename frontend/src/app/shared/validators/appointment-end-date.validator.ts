import { FormGroup, ValidatorFn } from '@angular/forms';
import { DateTime } from 'luxon';

export function appointmentEndDateValidator(startDateControlName: string): ValidatorFn {
  return (endDateControl) => {
    const formGroup = endDateControl.parent as FormGroup;
    if (!formGroup) return null;  // Ensure that the form group exists


    const startDateControl = formGroup.get(startDateControlName);
    if (!startDateControl) return null;  // Ensure that the matching control exists
    const startDate: DateTime = DateTime.fromJSDate(startDateControl?.value);
    const endDate: DateTime = DateTime.fromJSDate(endDateControl.value);

    if (startDate > endDate || startDate.equals(endDate)) {
      // Return an error if start time is after end time
      return { invalidInterval: true };
    }

    // difference higher than 1 hour
    if (endDate.diff(startDate, 'hours').hours > 1) {
      return { appointmentBigInterval: true };
    }

    return null;
  };
}

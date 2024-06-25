import { DateTime } from 'luxon';

export class DashboardUtil {

  static generatePageTitleBasedTime() {
    let title = 'Good Morning';
    const date = DateTime.now();
    const time = date.hour;
    if (time >= 12 && time < 17) {
      title = 'Good Afternoon';
    } else if (time >= 17 && time < 24) {
      title = 'Good Evening';
    }
    return title;
  }
}

package com.medical.app.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
/**
 * This class provides utility methods for validating dates.
 */
public class DateValidator {

  /**
   * This method checks if a given string can be parsed into a LocalDate.
   * It tries to parse the string and if it fails, it returns false, otherwise it returns true.
   *
   * @param dateStr the string to be checked
   * @return true if the string can be parsed into a LocalDate, false otherwise
   */
  public static boolean localDateIsValid(String dateStr) {
    try {
      LocalDate.parse(dateStr);
    } catch (DateTimeParseException e) {
      return false;
    }
    return true;
  }

  /**
   * This method checks if a given string can be parsed into a LocalDateTime.
   * It tries to parse the string and if it fails, it returns false, otherwise it returns true.
   *
   * @param dateStr the string to be checked
   * @return true if the string can be parsed into a LocalDateTime, false otherwise
   */
  public static boolean localDateTimeIsValid(String dateStr) {
    try {
      LocalDateTime.parse(dateStr);
    } catch (DateTimeParseException e) {
      return false;
    }
    return true;
  }

  /**
   * This method checks if the minute part of a given Instant is on a quarter (0, 15, 30, 45).
   * It also checks if the second and millisecond parts are zero.
   * It converts the Instant into a LocalDateTime and then checks the minute, second and millisecond parts.
   *
   * @param dateTime
   * @return true if the minute part is on a quarter and the second and millisecond parts are zero, false otherwise
   */
  public static boolean isMinuteOnQuarter(LocalDateTime dateTime) {
    int minute = dateTime.getMinute();
    int second = dateTime.getSecond();
    int milliseconds = dateTime.getNano();

    if (second != 0 || milliseconds != 0) {
      return false;
    }

    return minute == 0 || minute == 15 || minute == 30 || minute == 45;
  }

  public static boolean isTimeValid(String time) {
    try {
      LocalTime.parse(time);
    } catch (DateTimeParseException e) {
      return false;
    }
    return true;
  }

}

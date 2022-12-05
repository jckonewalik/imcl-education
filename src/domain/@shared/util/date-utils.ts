import moment from "moment";

export class DateUtils {
  static toSimpleDate(date: Date): Date {
    return moment(moment(date).format("YYYY-MM-DD")).toDate();
  }

  static toIsoDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}

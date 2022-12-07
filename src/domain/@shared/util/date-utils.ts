import moment from "moment";

export class DateUtils {
  static toSimpleDate(date: Date): Date {
    return moment(moment(date).format("YYYY-MM-DD")).toDate();
  }

  static toIsoDate(date: Date): string {
    return moment(date).format("YYYY-MM-DD");
  }

  static fromString(date: string): Date {
    return moment(date).toDate();
  }
}

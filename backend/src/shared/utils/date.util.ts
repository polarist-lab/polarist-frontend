export class DateUtil {
  static now(): Date {
    return new Date();
  }
  
  static toISOString(date: Date): string {
    return date.toISOString();
  }
  
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  static diffInDays(from: Date, to: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((to.getTime() - from.getTime()) / msPerDay);
  }
}
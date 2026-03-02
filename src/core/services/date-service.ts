import { addHours, addSeconds } from "date-fns";
import { injectable } from "inversify";

@injectable()
export class DateService {
  addHours(hours: number) {
    return addHours(new Date(), hours);
  }
  addSeconds(seconds: number) {
    return addSeconds(new Date(), seconds);
  }
}

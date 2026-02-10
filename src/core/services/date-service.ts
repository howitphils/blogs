import { addHours, addSeconds } from "date-fns";

export const dateService = {
  addHours(hours: number) {
    return addHours(new Date(), hours);
  },
  addSeconds(seconds: number) {
    return addSeconds(new Date(), seconds);
  },
};

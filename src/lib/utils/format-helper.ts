import { format } from "date-fns";

export const formatUnixTimestamp = (timestamp: number) => {
  return format(new Date(timestamp * 1000), "dd MMM yyyy");
};

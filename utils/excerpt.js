export default function excerpt(str, stopIndex) {
  if (
    typeof str !== "string" ||
    typeof stopIndex !== "number" ||
    stopIndex <= 0
  ) {
    return null;
  }
  return str.length <= stopIndex ? str : str.substring(0, stopIndex) + "...";
}

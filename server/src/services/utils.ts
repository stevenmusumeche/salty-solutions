export function parseWindDirection(direction: string) {
  let text: string;
  let degrees: number;
  switch (direction.toLowerCase().trim()) {
    case "north":
    case "n":
      text = "N";
      degrees = 0;
      break;
    case "east":
    case "e":
      text = "E";
      degrees = 90;
      break;
    case "south":
    case "s":
      text = "S";
      degrees = 180;
      break;
    case "west":
    case "w":
      text = "W";
      degrees = 270;
      break;
    case "northeast":
    case "ne":
      text = "NE";
      degrees = 45;
      break;
    case "northwest":
    case "nw":
      text = "NW";
      degrees = 315;
      break;
    case "southeast":
    case "se":
      text = "SE";
      degrees = 135;
      break;
    case "southwest":
    case "sw":
      text = "SW";
      degrees = 225;
      break;
    default:
      throw new Error("Unknown wind direction");
  }

  return { text, degrees };
}

export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

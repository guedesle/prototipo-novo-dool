function expandHex(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(normalized)) return normalized.slice(1);
  if (/^#[0-9a-f]{3}$/.test(normalized)) {
    const short = normalized.slice(1);
    return `${short[0]}${short[0]}${short[1]}${short[1]}${short[2]}${short[2]}`;
  }
  throw new TypeError('Expected a #RGB or #RRGGBB color.');
}

function channel(hex: string, start: number): number {
  return Number.parseInt(hex.slice(start, start + 2), 16) / 255;
}

function linearize(value: number): number {
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: string): number {
  const hex = expandHex(color);
  const red = linearize(channel(hex, 0));
  const green = linearize(channel(hex, 2));
  const blue = linearize(channel(hex, 4));
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
}

export function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function panicSpeed(intensity) {
  return 2.35 + Math.max(0, Math.min(1, intensity)) * 1.65;
}

export function escapeMove(index) {
  return ['dodge', 'tumble', 'hide'][index % 3];
}

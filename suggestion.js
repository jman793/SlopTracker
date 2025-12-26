// Functions to help figure out what games to suggest

// Calculates the ratio of ownership of a game
// Returns an array of numerator and demoninator
export function calculateOwnership(game, owners) {
  if (game.owners.length === 0) {
    return 0;
  }

  const intersection = game.owners.filter((owner) =>
    owners.map((owner) => owner.toLowerCase()).includes(owner.toLowerCase()),
  );

  if (intersection.length === 0) {
    return 0;
  }
  return bound(intersection.length / owners.length);
}

export function getOwnershipAsPercentage(ownershipDecimal) {
  return (ownershipDecimal * 100).toFixed(2);
}

// bounds the ratio between 0 and 1
function bound(value) {
  return Math.min(Math.max(value, 0), 1);
}

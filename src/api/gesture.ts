// Track nose postion of the last 1.5 second
//
// If the nose tip moves X-axis more than Y, then it's a shake. The better
// the ratio the higher the confidence.
//
// If the yaw is negative, then it's facing left.
//

export const SHAKE = "shake";
export const NOD = "nod";
export const LEFT = "left";
export const RIGHT = "right";
export const NONE = "";

type nodOrShakeType = "nod" | "shake";
type rotationVector = [number, number, number];
type noseTip = { x: number; y: number };

/**
 * Detect whether it's a nod or shake gesture.
 */
export function nodOrShake(noseTips: noseTip[]) {
  const count = noseTips.length;
  if (count < 2)
    return {
      gesture: NONE,
      nodConfidence: 0,
      shakeConfidence: 0
    };
  const xs = noseTips.map(n => n.x);
  const ys = noseTips.map(n => n.y);
  const xRange = Math.abs(Math.max(...xs) - Math.min(...xs));
  const yRange = Math.abs(Math.max(...ys) - Math.min(...ys));

  const nodConfidence = yRange / xRange;
  const shakeConfidence = xRange / yRange;

  let gesture: nodOrShakeType | "" = NONE;
  if (nodConfidence > 2.3) {
    // TODO might need more tweaks
    gesture = NOD;
  } else if (shakeConfidence > 7) {
    gesture = SHAKE;
  }
  return {
    gesture,
    nodConfidence,
    shakeConfidence
  };
}

/**
 * Detect horizontal facing direction.
 *
 */
export function leftOrRight(
  rotationVectors: rotationVector[],
  mirrored = false
) {
  const yaws = rotationVectors.map(x => x[2]);
  const classified = yaws.reduce((acc: string[], x) => {
    let dir = NONE;
    if (x > 0.5) {
      dir = mirrored ? LEFT : RIGHT;
    } else if (x < -0.5) {
      dir = mirrored ? RIGHT : LEFT;
    }

    return [...acc, dir];
  }, []);
  // const average = sum / yaws.length;
  // return average;
  const rightCount = classified.filter(x => x === RIGHT).length;
  const leftCount = classified.filter(x => x === LEFT).length;
  let facing: "" | "right" | "left" = NONE;

  const count = rotationVectors.length;
  if (count < 2)
    return {
      rightCount,
      leftCount,
      facing
    };

  if (rightCount > leftCount) {
    facing = RIGHT;
  } else if (rightCount < leftCount) {
    facing = LEFT;
  }

  return { rightCount, leftCount, facing };
}

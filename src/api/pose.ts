import cv from "../opencv.js";
import { FaceLandmarks68 } from "face-api.js";

const SIZE = {
  width: 640,
  height: 480
};
const FOCAL_LENGTH = SIZE.width;
const CENTER = [SIZE.width / 2, SIZE.height / 2];
const CAMERA_MATRIX_ARRAY = [
  FOCAL_LENGTH,
  0,
  CENTER[0],
  0,
  FOCAL_LENGTH,
  CENTER[1],
  0,
  0,
  1
];

const NUM_ROWS = 6;

// types
export type PoseSolution = {
  rotationVector: any[];
  translationVector: any[];
  distCoeffs: any[];
  noseTip: {
    x: any;
    y: any;
  };
  imagePoints: any[];
};

// predict
export function solvePoseFrom(
  landmarks: FaceLandmarks68
): PoseSolution | undefined {
  const CAMERA_MATRIX = cv.matFromArray(3, 3, cv.CV_64FC1, CAMERA_MATRIX_ARRAY);

  // 3D model points
  const modelPoints = cv.matFromArray(NUM_ROWS, 3, cv.CV_64FC1, [
    0.0,
    0.0,
    0.0, // Nose tip
    0.0,
    -330.0,
    -65.0, // Chin
    -225.0,
    170.0,
    -135.0, // Left eye left corner
    225.0,
    170.0,
    -135.0, // Right eye right corner
    -150.0,
    -150.0,
    -125.0, // Left Mouth corner
    150.0,
    -150.0,
    -125.0 // Right mouth corner
  ]);

  // Create Matrixes
  // We are using wasm so gotta do these slice by slice
  // Everything is mutable here
  const imagePoints = cv.Mat.zeros(NUM_ROWS, 2, cv.CV_64FC1);
  const distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64FC1); // Assuming no lens distortion
  const rotationVector = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
  const translationVector = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);

  // get relevant keypoints
  const {
    noseTip,
    chin,
    leftEye,
    rightEye,
    leftMouth,
    rightMouth
  } = _get6PointsFrom(landmarks["_positions"]);

  // Assign 2D image points
  [
    noseTip.x,
    noseTip.y, // Nose tip
    chin.x,
    chin.y, // Chin
    leftEye.x,
    leftEye.y, // Left eye left corner
    rightEye.x,
    rightEye.y, // Right eye right corner
    leftMouth.x,
    leftMouth.y, // Left Mouth corner
    rightMouth.x,
    rightMouth.y // Right mouth corner
  ].map((v, i) => {
    imagePoints.data64F[i] = v;
  });

  const success = cv.solvePnP(
    modelPoints,
    imagePoints,
    CAMERA_MATRIX,
    distCoeffs, // will be mutated
    rotationVector, // will be mutated
    translationVector // will be mutated
  );
  if (!success) {
    return;
  }

  const result = {
    rotationVector: [...rotationVector.data64F],
    translationVector: [...translationVector.data64F],
    distCoeffs: [...distCoeffs.data64F],
    noseTip,
    imagePoints: [...imagePoints.data64F]
  };

  // Clean up to prevent mem leak
  imagePoints.delete();
  distCoeffs.delete();
  rotationVector.delete();
  translationVector.delete();
  modelPoints.delete();
  CAMERA_MATRIX.delete();

  return result;
}

export function drawAxes(solution, canvas: HTMLCanvasElement) {
  const CAMERA_MATRIX = cv.matFromArray(3, 3, cv.CV_64FC1, CAMERA_MATRIX_ARRAY);

  const {
    rotationVector: _rotationVector,
    translationVector: _translationVector,
    distCoeffs: _distCoeffs,
    noseTip,
    imagePoints: _imagePoints
  } = solution;

  // Variables for drawing
  const rotationVector = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
  const translationVector = new cv.Mat({ width: 1, height: 3 }, cv.CV_64FC1);
  const distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64FC1);
  const imagePoints = cv.Mat.zeros(NUM_ROWS, 2, cv.CV_64FC1);

  _rotationVector.map((v, i) => {
    rotationVector.data64F[i] = v;
  });
  _translationVector.map((v, i) => {
    translationVector.data64F[i] = v;
  });
  _distCoeffs.map((v, i) => {
    distCoeffs.data64F[i] = v;
  });
  _imagePoints.map((v, i) => {
    imagePoints.data64F[i] = v;
  });

  const pointZ = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 0.0, 500.0]);
  const pointY = cv.matFromArray(1, 3, cv.CV_64FC1, [0.0, 500.0, 0.0]);
  const pointX = cv.matFromArray(1, 3, cv.CV_64FC1, [500.0, 0.0, 0.0]);
  const noseEndPoint2DZ = new cv.Mat();
  const noseEndPoint2DY = new cv.Mat();
  const noseEndPoint2DX = new cv.Mat();
  const jacob = new cv.Mat();

  // Below is code for drawing points and stuff
  // Project a 3D points [0.0, 0.0, 500.0],  [0.0, 500.0, 0.0],
  //   [500.0, 0.0, 0.0] as z, y, x axis in red, green, blue color
  cv.projectPoints(
    pointZ,
    rotationVector,
    translationVector,
    CAMERA_MATRIX,
    distCoeffs,
    noseEndPoint2DZ,
    jacob
  );
  cv.projectPoints(
    pointY,
    rotationVector,
    translationVector,
    CAMERA_MATRIX,
    distCoeffs,
    noseEndPoint2DY,
    jacob
  );
  cv.projectPoints(
    pointX,
    rotationVector,
    translationVector,
    CAMERA_MATRIX,
    distCoeffs,
    noseEndPoint2DX,
    jacob
  );

  let image = cv.imread(canvas);
  // color the detected eyes and nose to purple
  for (let i = 0; i < NUM_ROWS; i++) {
    cv.circle(
      image,
      {
        x: imagePoints.doublePtr(i, 0)[0],
        y: imagePoints.doublePtr(i, 1)[0]
      },
      3,
      [255, 0, 255, 255],
      -1
    );
  }
  // draw axis
  const pZ = {
    x: noseEndPoint2DZ.data64F[0],
    y: noseEndPoint2DZ.data64F[1]
  };
  const pY = {
    x: noseEndPoint2DY.data64F[0],
    y: noseEndPoint2DY.data64F[1]
  };
  const pX = {
    x: noseEndPoint2DX.data64F[0],
    y: noseEndPoint2DX.data64F[1]
  };
  cv.line(image, noseTip, pZ, [255, 0, 0, 255], 2);
  cv.line(image, noseTip, pY, [0, 255, 0, 255], 2);
  cv.line(image, noseTip, pX, [0, 0, 255, 255], 2);
  // Display image
  cv.imshow(canvas, image);

  // cleanup
  image.delete();
  CAMERA_MATRIX.delete();
  pointZ.delete();
  pointY.delete();
  pointX.delete();
  noseEndPoint2DZ.delete();
  noseEndPoint2DY.delete();
  noseEndPoint2DX.delete();
  jacob.delete();
}

// utils
function _getSinglePointFrom(positions) {
  return function(index) {
    const point = positions[index];
    return { x: point["_x"], y: point["_y"] };
  };
}

function _get6PointsFrom(positions) {
  const point = _getSinglePointFrom(positions);

  const noseTip = point(33);
  const chin = point(8);
  const leftEye = point(36);
  const rightEye = point(45);
  const leftMouth = point(48);
  const rightMouth = point(54);
  return { noseTip, chin, leftEye, rightEye, leftMouth, rightMouth };
}

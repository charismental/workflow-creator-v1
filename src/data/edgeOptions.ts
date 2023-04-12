import {
  svgDrawSmoothLinePath,
  pathfindingAStarDiagonal,
  svgDrawStraightLinePath,
  pathfindingJumpPointNoDiagonal,
  pathfindingAStarNoDiagonal,
} from "@tisoap/react-flow-smart-edge";

// Same as importing "SmartBezierEdge" directly
export const bezierResult = {
  drawEdge: svgDrawSmoothLinePath,
  generatePath: pathfindingAStarDiagonal,
};

// Same as importing "SmartStepEdge" directly
export const stepResult = {
  drawEdge: svgDrawStraightLinePath,
  generatePath: pathfindingJumpPointNoDiagonal,
};

// Same as importing "SmartStraightEdge" directly
export const straightResult = {
  drawEdge: svgDrawStraightLinePath,
  generatePath: pathfindingAStarNoDiagonal,
};

export type FPSDebug = {
  frameCount: number;
  fps: number;
  lastFrameTimeForFPS: number;
};

export const updateFpsDebugVariables = (fpsDebug: FPSDebug, currentTime: number) => {
  fpsDebug.frameCount++;

  if (currentTime - fpsDebug.lastFrameTimeForFPS >= 1000) {
    fpsDebug.fps = fpsDebug.frameCount;
    fpsDebug.frameCount = 0;
    fpsDebug.lastFrameTimeForFPS = currentTime;
  }
};

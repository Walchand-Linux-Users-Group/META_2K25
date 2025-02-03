export const getDeviceRefreshRate = () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();
  
      const checkFrameRate = () => {
        frameCount++;
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
  
        if (elapsedTime >= 1000) {
          const fps = (frameCount / elapsedTime) * 1000;
          if (fps >= 120) {
            resolve(120);
          } else if (fps >= 60) {
            resolve(60);
          } else {
            resolve(30);
          }
        } else {
          requestAnimationFrame(checkFrameRate);
        }
      };
      console.log("Hello my friend");
      requestAnimationFrame(checkFrameRate);
    });
  };
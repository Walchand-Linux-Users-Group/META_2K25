import React, { useEffect, useState } from "react";

const WASDGuidelines = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleKeyPress = () => {
      setIsVisible(false); // Hide guidelines when any key is pressed
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      swipeData.startX = touch.clientX;
      swipeData.startY = touch.clientY;
    };

    const handleTouchEnd = (event) => {
      const touch = event.changedTouches[0];
      swipeData.endX = touch.clientX;
      swipeData.endY = touch.clientY;

      // Check for swipe direction
      const deltaX = swipeData.endX - swipeData.startX;
      const deltaY = swipeData.endY - swipeData.startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) console.log("Swipe Right");
        else console.log("Swipe Left");
      } else {
        // Vertical swipe
        if (deltaY > 0) console.log("Swipe Down");
        else console.log("Swipe Up");
      }

      // Hide guidelines on swipe
      setIsVisible(false);
    };

    const swipeData = { startX: 0, startY: 0, endX: 0, endY: 0 };

    // Add event listeners
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Return null if the guidelines are not visible
  if (!isVisible) {
    return null;
  }

  // Styles for the overlay and WASD display
  const styles = {
    overlay: {
      position: "fixed", // Makes the component cover the entire viewport
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Dim background
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Ensures it's above other components
    },
    container: {
      textAlign: "center",
      color: "#fff",
    },
    wasdKeys: {
      display: "inline-block",
      marginBottom: "20px",
    },
    key: {
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      width: "50px",
      height: "50px",
      margin: "5px",
      border: "2px solid white",
      borderRadius: "8px",
      fontSize: "20px",
      fontWeight: "bold",
      backgroundColor: "#000",
    },
    horizontalKeys: {
      display: "flex",
      justifyContent: "center",
      marginTop: "5px",
    },
    instructions: {
      fontSize: "18px",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.wasdKeys}>
          <div style={styles.horizontalKeys}>
            <div style={styles.key}>W</div>
          </div>
          <div style={styles.horizontalKeys}>
            <div style={styles.key}>A</div>
            <div style={styles.key}>S</div>
            <div style={styles.key}>D</div>
          </div>
        </div>
        <div style={styles.instructions}>
          Use your arrow keys (or WASD keys) to control the ball. Swipe on your
          phone to control it.
        </div>
      </div>
    </div>
  );
};

export default WASDGuidelines;

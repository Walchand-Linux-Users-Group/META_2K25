import React, { useEffect, useState } from "react";

const WASDGuidelines = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Hide the guidelines when any key is pressed
  useEffect(() => {
    const handleKeyPress = () => {
      setIsVisible(false);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
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
          Use your arrow keys (or WASD keys) to control the ball
        </div>
      </div>
    </div>
  );
};

export default WASDGuidelines;

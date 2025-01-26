// SessionCard.js
import React from "react";

const sessions = [
  {
    title: "Session 1",
    description: "Description for session 1",
    imageUrl: "path/to/image1.jpg",
  },
  {
    title: "Session 2",
    description: "Description for session 2",
    imageUrl: "path/to/image2.jpg",
  },
  {
    title: "Session 3",
    description: "Description for session 3",
    imageUrl: "path/to/image3.jpg",
  },
  {
    title: "Session 4",
    description: "Description for session 4",
    imageUrl: "path/to/image4.jpg",
  },
];

const SessionCard = ({ session }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "70%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#FFF",
        color: "black",
        fontSize: "18px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        width: "300px",
        textAlign: "center",
      }}
    >
      <img
        src={session.imageUrl}
        alt={session.title}
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <h2>{session.title}</h2>
      <p>{session.description}</p>
    </div>
  );
};

const SessionCards = () => {
  return (
    <div>
      {sessions.map((session, index) => (
        <SessionCard key={index} session={session} />
      ))}
    </div>
  );
};

export default SessionCards;

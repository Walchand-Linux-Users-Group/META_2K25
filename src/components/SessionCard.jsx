import React from "react";

const sessions = [
  {
    title: "Session 1",
    description: "Description for session 1",
    date: "15 feb"
  },
  {
    title: "Session 2",
    description: "Description for session 2",
    date: "15feb"
  },
  {
    title: "Session 3",
    description: "Description for session 3",
    date: ""
  },
  {
    title: "Session 4",
    description: "Description for session 4",
    date: ""
  },
];

const PromotionalCard = ({ title, description, date }) => {
  return (
    <div className="relative w-full md:h-screen h-auto flex flex-col md:items-center md:justify-center">
      <div className="md:fixed md:top-[calc(33%-6rem)] relative top-0 z-10 flex flex-col items-center">
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-7 rounded-xl shadow-2xl text-center transform rotate-3 skew-x-6 border border-white border-opacity-30 md:scale-100 scale-75">
          <div className="text-teal-300 text-xl font-semibold mb-4">{title}</div>
          <p className="text-gray-300 text-lg">{description}</p>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-xl shadow-2xl text-center transform -rotate-3 -skew-x-6 md:mt-8 border border-white border-opacity-30 md:scale-100 scale-75">
          <div className="text-green-400 text-3xl font-bold">{date}</div>
        </div>
      </div>
    </div>
  );
};

const SessionCards = ({ index }) => {
  const session = sessions[index] || {};
  return (
    <div>
      <PromotionalCard
        title={session.title}
        description={session.description}
        date={session.date}
      />
    </div>
  );
};

export default SessionCards;
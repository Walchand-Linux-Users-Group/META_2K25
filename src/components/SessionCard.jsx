import React from "react";

const sessions = [
  {
    title: "Let's Dock It!",
    description:
      "This session covers virtualization vs. physical servers, why modern apps prefer containers over VMs and a hands-on introduction to Docker with its core components and commands.",
    date: "15 FEB 2025",
  },
  {
    title: "DockerVerse",
    description:
      "This session covers Docker Volumes for data persistence, Docker Networking for container communication and Docker Compose for managing multi-container apps with a single YAML file.",
    date: "15 FEB 2025",
  },
  {
    title: "Sailing to K8s",
    description:
      "Managing a few containers is easy, but scaling requires Kubernetes. This session covers its architecture, key components and how it complements Docker, making it essential for large-scale applications.",
    date: "16 FEB 2025",
  },
  {
    title: "Pod Power",
    description:
      "Take your Kubernetes skills further with Pods, Services, and Deployments to automate and scale applications. Apply your knowledge with real-world projects and test your expertise in wargames.",
    date: "16 FEB 2025",
  },
];

const PromotionalCard = ({ title, description, date }) => {
  return (
    <div className="relative w-[50%] m-1 md:h-screen h-auto flex flex-col md:items-center md:justify-center">
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 w-full md:p-7 rounded-xl shadow-2xl text-center border border-white border-opacity-30 md:scale-75 scale-75">
          <div className="text-teal-300 text-3xl font-semibold mb-4">
            {title}
          </div>
          <p className="text-gray-300 p-1 text-base md:text-2xl">{description}</p>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-2xl text-center md:mt-8 border border-white border-opacity-30 md:scale-75 scale-75">
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

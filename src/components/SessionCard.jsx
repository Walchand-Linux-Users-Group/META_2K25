import React from "react";

const sessions = [
  {
    title: "Session 1",
    description:
      "DevOps is transforming software development, making delivery faster and more efficient! This session covers virtualization vs physical servers and why modern apps prefer containers over VMs. You'll dive into Docker, exploring its core components and mastering essential commands with hands-on experience! 🚀",
    date: "15 FEB 2025",
  },
  {
    title: "Session 2",
    description:
      "Now that you know Docker, let's dive into data management and networking! Learn how Docker Volumes keep data persistent and how containers communicate using Docker Networking. Finally, master Docker Compose, a game-changer for managing multi-container apps with a single YAML file! 🚀",
    date: "15 FEB 2025",
  },
  {
    title: "Session 3",
    description:
      "Running a few containers is simple, but scaling to hundreds? That's where Kubernetes shines! 🚀 It auto-scales, load balances and self-heals containers, making it the go-to for managing large-scale applications. In this session, we'll break down Kubernetes architecture, explore its key components and compare Docker vs Kubernetes to see how they complement each other. By the end, you'll know why Kubernetes powers the cloud! 🌍",
    date: "16 FEB 2025",
  },
  {
    title: "Session 4",
    description:
      "Level up your Kubernetes skills! 🚀 Learn Pods, Services, Deployments and more to automate and scale applications seamlessly. Go beyond theory with real-world projects, deploying and managing cloud-native apps like a pro. For the grand finale—dive into epic wargames! 🔥 Test your skills, compete and push your Docker & K8s expertise to the limit! 🎯",
    date: "16 FEB 2025",
  },
];

const PromotionalCard = ({ title, description, date }) => {
  return (
    <div className="relative w-[50%] m-1 md:h-screen h-auto flex flex-col md:items-center md:justify-center">
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 w-full md:p-7 rounded-xl shadow-2xl text-center transform rotate-3 skew-x-6 border border-white border-opacity-30 md:scale-75 scale-75">
          <div className="text-teal-300 text-3xl font-semibold mb-4">
            {title}
          </div>
          <p className="text-gray-300 text-base md:text-2xl">{description}</p>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 md:p-6 rounded-xl shadow-2xl text-center transform -rotate-3 -skew-x-6 md:mt-8 border border-white border-opacity-30 md:scale-75 scale-75">
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

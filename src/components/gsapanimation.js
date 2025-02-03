import { gsap } from "gsap";

export const createHoverTimeline = (shipRef, setStarSpeed, fps) => {
  const duration = fps >= 60 ? 1.5 : 2.5; // Adjust duration based on FPS

  const timeline = gsap.timeline({ paused: true });

  timeline
    .to(shipRef.current, {
      duration,
      ease: "power2.out",
      onStart: () => gsap.to({}, {
        duration,
        onUpdate: () => setStarSpeed(0.4),
      }),
      onReverseComplete: () => gsap.to({}, {
        duration,
        onUpdate: () => setStarSpeed(0.1),
      }),
    })
    .to(
      ".thruster-flicker",
      {
        duration,
        ease: "power2.out",
        className: "+=fast-flicker",
      },
      0
    )
    .to(
      shipRef.current,
      {
        duration,
        y: "-=10",
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
      0
    );

  return timeline;
};
/**
 * Framer Motion Reusable Animation Variants & Transitions
 * Adheres to modern, subtle, fast productivity app animations (ChatGPT/Vercel style).
 * Respects reduced motion preferences.
 */

export const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.98, y: -8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    transition: { duration: 0.18, ease: "easeIn" }
  }
};

export const aiModalDesktopVariants = {
  initial: { opacity: 0, scale: 0.97, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.26, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

export const aiModalMobileVariants = {
  initial: { opacity: 0, y: "100%" },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.22, ease: "easeIn" }
  }
};

export const dialogVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" }
  }
};

export const drawerVariants = {
  initial: { x: "-100%", opacity: 0.8 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  exit: {
    x: "-100%",
    opacity: 0.8,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

export const accordionVariants = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.22, ease: "easeOut" },
      opacity: { duration: 0.18, delay: 0.04 }
    }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.18, ease: "easeInOut" },
      opacity: { duration: 0.12 }
    }
  }
};

export const messageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export const chatSwitchVariants = {
  initial: { opacity: 0, x: 8 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.15, ease: "easeIn" }
  }
};

export const chatItemDeleteVariants = {
  initial: { opacity: 1, height: "auto" },
  exit: {
    opacity: 0,
    height: 0,
    x: -10,
    transition: { duration: 0.18, ease: "easeInOut" }
  }
};

export const pillSpringTransition = {
  type: "spring",
  stiffness: 450,
  damping: 32
};

export const buttonTapScale = {
  scale: 0.97
};

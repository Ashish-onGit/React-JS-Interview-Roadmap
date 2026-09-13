import React from "react";
import {
  FaJs,
  FaCode,
  FaCubes,
  FaBolt,
  FaLayerGroup,
  FaClock,
  FaGlobe,
  FaReact,
  FaSyncAlt,
  FaAnchor,
  FaLightbulb,
  FaRoute,
  FaWpforms,
  FaDatabase,
  FaCloudDownloadAlt,
  FaTachometerAlt,
  FaExchangeAlt,
  FaLock,
  FaSitemap,
  FaHtml5,
  FaCss3Alt,
  FaFileCode,
  FaGitAlt,
  FaVial,
  FaRocket,
  FaRobot,
  FaClipboardList
} from "react-icons/fa";

const iconMap = {
  FaJs,
  FaCode,
  FaCubes,
  FaBolt,
  FaLayerGroup,
  FaClock,
  FaGlobe,
  FaReact,
  FaSyncAlt,
  FaAnchor,
  FaLightbulb,
  FaRoute,
  FaWpforms,
  FaDatabase,
  FaCloudDownloadAlt,
  FaTachometerAlt,
  FaExchangeAlt,
  FaLock,
  FaSitemap,
  FaHtml5,
  FaCss3Alt,
  FaFileCode,
  FaGitAlt,
  FaVial,
  FaRocket,
  FaRobot,
  FaClipboardList
};

export default function CategoryIcon({ name, className = "w-4 h-4" }) {
  const IconComponent = iconMap[name] || FaCode;
  return <IconComponent className={className} aria-hidden="true" />;
}

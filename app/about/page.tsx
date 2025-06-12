import React from "react";
import type { Metadata } from "next";
import PersonalLandingPage from "@/app/components/PersonalLandingPage";

export const metadata: Metadata = {
  title: "About - Dane Willacker",
  description:
    "Background and experience of Dane Willacker, an AI and XR developer based in Hawai'i.",
};

export default function AboutPage() {
  return <PersonalLandingPage />;
} 
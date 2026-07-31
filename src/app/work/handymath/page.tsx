import type { Metadata } from "next";
import { HandyMathShowcase } from "@/components/work/HandyMathShowcase";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "HandyMath — AI Math Education Platform",
  description:
    "Full-stack education platform with computer vision OCR, SymPy symbolic solver, and Three.js 3D visualization. Solo build in 4 months.",
};

export default function HandyMathPage() {
  const project = projects.find((p) => p.id === "handymath")!;
  const allProjects = projects;
  return <HandyMathShowcase project={project} allProjects={allProjects} />;
}

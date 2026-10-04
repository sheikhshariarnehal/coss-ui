import { Button } from "@/registry/default/ui/button";
import { Sparkles, Youtube, Check, ChevronRight } from "lucide-react";

export default function Particle() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4 max-w-4xl">
      <Button variant="primary">Primary Skeuomorphic</Button>
      <Button variant="emerald">Emerald</Button>
      <Button variant="youtube" leftIcon={<Youtube />}>Watch on YouTube</Button>
      <Button variant="youtube-subscribe">Subscribe</Button>
      <Button variant="youtube-red">YouTube Red</Button>
      <Button variant="rainbow">Rainbow Border</Button>
      <Button variant="glass">Glassmorphic</Button>
      <Button variant="dark">Dark Slate</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="white">White Pill</Button>
      <Button variant="primary" loading>Loading...</Button>
      <Button variant="primary" shape="rounded" rightIcon={<ChevronRight />}>Rounded Shape</Button>
    </div>
  );
}

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/origin/ui/toggle-group";

export default function Component() {
  return (
    <ToggleGroup className="inline-flex" type="single" variant="outline">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}

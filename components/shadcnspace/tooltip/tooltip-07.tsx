import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ErrorTooltipDemo = () => {
  return (
    <Tooltip>
      <TooltipTrigger render={
        <Button variant="outline">Error Tooltip</Button>
      } />
      <TooltipContent className="bg-destructive text-white [&>*:last-child]:bg-destructive! [&>*:last-child]:fill-destructive!">
        <p>This is an error tooltip</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ErrorTooltipDemo;

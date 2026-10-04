import { BookmarkIcon, HomeIcon } from "lucide-react";
import DatePicker from "@/origin/components/navbar-components/date-picker";
import Filters from "@/origin/components/navbar-components/filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/origin/ui/breadcrumb";
import { Button } from "@/origin/ui/button";

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <HomeIcon aria-hidden="true" size={16} />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Date picker */}
          <DatePicker />
          {/* Filters */}
          <Filters />
          {/* Saved button */}
          <Button
            className="text-sm max-sm:aspect-square max-sm:p-0"
            size="sm"
            variant="outline"
          >
            <BookmarkIcon
              aria-hidden="true"
              className="text-muted-foreground/80 sm:-ms-1"
              size={16}
            />
            <span className="max-sm:sr-only">Saved</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

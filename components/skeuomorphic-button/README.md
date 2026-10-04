# Skeuomorphic Button

> Tactile skeuomorphic buttons with specular highlights, frosted glass, pill/rounded shapes, and custom platform styles.

<ComponentPreview name="p-skeuomorphic-button-1" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTab value="cli">CLI</TabsTab>
  <TabsTab value="manual">Manual</TabsTab>
</TabsList>
<TabsPanel value="cli">

```bash
npx shadcn@latest add @coss/skeuomorphic-button
```

</TabsPanel>

<TabsPanel value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-slot class-variance-authority lucide-react
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="skeuomorphic-button" title="components/ui/skeuomorphic-button.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsPanel>

</CodeTabs>

## Usage

```tsx
import { SkeuomorphicButton } from "@/components/ui/skeuomorphic-button";
import { Youtube } from "lucide-react";

export default function Example() {
  return (
    <SkeuomorphicButton variant="primary" shape="pill">
      Click Me
    </SkeuomorphicButton>
  );
}
```

# Skeuomorphic Button

> Tactile skeuomorphic buttons featuring specular highlights, multi-layer gradient depth, frosted glassmorphism, animated rainbow borders, and platform-inspired action pills.

<ComponentPreview name="p-skeuomorphic-button-1" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTab value="cli">CLI</TabsTab>
  <TabsTab value="manual">Manual</TabsTab>
</TabsList>
<TabsPanel value="cli">

```bash
npx shadcn@latest add https://coss-ui-beta.vercel.app/r/skeuomorphic-button.json
```

</TabsPanel>

<TabsPanel value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-slot class-variance-authority lucide-react clsx tailwind-merge
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="skeuomorphic-button" title="components/ui/skeuomorphic-button.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsPanel>

</CodeTabs>

## Usage

```tsx
import { SkeuomorphicButton } from "@/components/ui/skeuomorphic-button"
```

```tsx
<SkeuomorphicButton variant="primary">
  Primary Skeuomorphic
</SkeuomorphicButton>
```

## Features & Variants

- **Specular Inset Highlights**: Crisp top rim specular highlight reflection that gives a real tactile physical look.
- **Platform Presets**: Includes dedicated YouTube dark pill (`youtube`), high-contrast subscribe pill (`youtube-subscribe`), and YouTube red (`youtube-red`).
- **Glassmorphism & Glow**: Built-in frosted glass (`glass`) with backdrop filter blur, and prismatic animated glowing border (`rainbow`).
- **Shapes & Sizes**: Full `pill` (rounded-full) or `rounded` (rounded-xl) with sizes ranging from `sm`, `default`, `lg`, to `icon`.
- **Built-in Icons & Loading**: Dedicated `leftIcon`, `rightIcon`, and `loading` spinner props with automatic accessible disabled states.

## Examples

### With Left or Right Icons

```tsx
import { SkeuomorphicButton } from "@/components/ui/skeuomorphic-button"
import { Youtube, ChevronRight } from "lucide-react"

export function IconButtonExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <SkeuomorphicButton variant="youtube" leftIcon={<Youtube />}>
        Watch on YouTube
      </SkeuomorphicButton>

      <SkeuomorphicButton variant="emerald" shape="rounded" rightIcon={<ChevronRight />}>
        Get Started
      </SkeuomorphicButton>
    </div>
  )
}
```

### Loading State

```tsx
import { SkeuomorphicButton } from "@/components/ui/skeuomorphic-button"

export function LoadingExample() {
  return (
    <SkeuomorphicButton variant="primary" loading>
      Submitting...
    </SkeuomorphicButton>
  )
}
```

### Link as Button (`asChild`)

```tsx
import Link from "next/link"
import { SkeuomorphicButton } from "@/components/ui/skeuomorphic-button"

export function LinkButton() {
  return (
    <SkeuomorphicButton asChild variant="primary">
      <Link href="/dashboard">Go to Dashboard</Link>
    </SkeuomorphicButton>
  )
}
```

## API Reference

### SkeuomorphicButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "default" \| "emerald" \| "dark" \| "youtube" \| "youtube-subscribe" \| "youtube-red" \| "rainbow" \| "black" \| "glass" \| "destructive" \| "white"` | `"primary"` | Controls the button visual theme and specular lighting effect |
| `size` | `"sm" \| "default" \| "lg" \| "icon"` | `"default"` | Controls the height, padding, and font size |
| `shape` | `"pill" \| "rounded"` | `"pill"` | Controls the border radius (`pill` = `rounded-full`, `rounded` = `rounded-xl`) |
| `loading` | `boolean` | `false` | Displays an animated spinner and disables button interactions |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon element rendered before the button children |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon element rendered after the button children |
| `asChild` | `boolean` | `false` | Merges props and behavior onto child component using Radix `Slot` |
| `disabled` | `boolean` | `false` | Disables the button and applies reduced opacity |

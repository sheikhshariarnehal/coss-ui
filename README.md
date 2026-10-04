# coss.com UI Components Library

> Complete collection of accessible, styled UI components, documentation, and interactive particle examples from [coss.com UI](https://coss.com/ui).

## Overview

- **Components:** 57
- **Interactive Particle Examples:** 554
- **Shared Utilities & Hooks:** 6 libs, 4 hooks, 4 base-ui wrappers

## Project Structure

```
coss UI/
├── components/              # Individual component packages
│   ├── accordion/
│   │   ├── accordion.tsx    # Source code
│   │   ├── README.md        # Documentation & API reference
│   │   └── examples/        # Particle demo variations (e.g. p-accordion-1.tsx)
│   ├── alert/
│   ├── button/
│   └── ...
├── lib/                     # Utility helpers (utils.ts, cn)
├── hooks/                   # React custom hooks
├── base-ui/                 # Base UI primitives
├── styles/                  # Theme & CSS variables
└── download_components.py   # Downloader script to refresh/update
```

## Components List

| Component | Source Code | Documentation | Examples / Particles |
| :--- | :---: | :---: | :---: |
| **[Accordion](./components/accordion/)** | [`accordion.tsx`](./components/accordion/accordion.tsx) | [`README.md`](./components/accordion/README.md) | [4 examples](./components/accordion/examples/) |
| **[Alert](./components/alert/)** | [`alert.tsx`](./components/alert/alert.tsx) | [`README.md`](./components/alert/README.md) | [9 examples](./components/alert/examples/) |
| **[Alert Dialog](./components/alert-dialog/)** | [`alert-dialog.tsx`](./components/alert-dialog/alert-dialog.tsx) | [`README.md`](./components/alert-dialog/README.md) | [2 examples](./components/alert-dialog/examples/) |
| **[Autocomplete](./components/autocomplete/)** | [`autocomplete.tsx`](./components/autocomplete/autocomplete.tsx) | [`README.md`](./components/autocomplete/README.md) | [16 examples](./components/autocomplete/examples/) |
| **[Avatar](./components/avatar/)** | [`avatar.tsx`](./components/avatar/avatar.tsx) | [`README.md`](./components/avatar/README.md) | [14 examples](./components/avatar/examples/) |
| **[Badge](./components/badge/)** | [`badge.tsx`](./components/badge/badge.tsx) | [`README.md`](./components/badge/README.md) | [20 examples](./components/badge/examples/) |
| **[Breadcrumb](./components/breadcrumb/)** | [`breadcrumb.tsx`](./components/breadcrumb/breadcrumb.tsx) | [`README.md`](./components/breadcrumb/README.md) | [7 examples](./components/breadcrumb/examples/) |
| **[Button](./components/button/)** | [`button.tsx`](./components/button/button.tsx) | [`README.md`](./components/button/README.md) | [40 examples](./components/button/examples/) |
| **[Calendar](./components/calendar/)** | [`calendar.tsx`](./components/calendar/calendar.tsx) | [`README.md`](./components/calendar/README.md) | [25 examples](./components/calendar/examples/) |
| **[Card](./components/card/)** | [`card.tsx`](./components/card/card.tsx) | [`README.md`](./components/card/README.md) | [11 examples](./components/card/examples/) |
| **[Checkbox](./components/checkbox/)** | [`checkbox.tsx`](./components/checkbox/checkbox.tsx) | [`README.md`](./components/checkbox/README.md) | [10 examples](./components/checkbox/examples/) |
| **[Checkbox Group](./components/checkbox-group/)** | [`checkbox-group.tsx`](./components/checkbox-group/checkbox-group.tsx) | [`README.md`](./components/checkbox-group/README.md) | [5 examples](./components/checkbox-group/examples/) |
| **[Collapsible](./components/collapsible/)** | [`collapsible.tsx`](./components/collapsible/collapsible.tsx) | [`README.md`](./components/collapsible/README.md) | [1 examples](./components/collapsible/examples/) |
| **[Combobox](./components/combobox/)** | [`combobox.tsx`](./components/combobox/combobox.tsx) | [`README.md`](./components/combobox/README.md) | [20 examples](./components/combobox/examples/) |
| **[Command](./components/command/)** | [`command.tsx`](./components/command/command.tsx) | [`README.md`](./components/command/README.md) | [2 examples](./components/command/examples/) |
| **[Context Menu](./components/context-menu/)** | [`context-menu.tsx`](./components/context-menu/context-menu.tsx) | [`README.md`](./components/context-menu/README.md) | [8 examples](./components/context-menu/examples/) |
| **[Date Picker](./components/date-picker/)** | - | [`README.md`](./components/date-picker/README.md) | [9 examples](./components/date-picker/examples/) |
| **[Dialog](./components/dialog/)** | [`dialog.tsx`](./components/dialog/dialog.tsx) | [`README.md`](./components/dialog/README.md) | [6 examples](./components/dialog/examples/) |
| **[Drawer](./components/drawer/)** | [`drawer.tsx`](./components/drawer/drawer.tsx) | [`README.md`](./components/drawer/README.md) | [14 examples](./components/drawer/examples/) |
| **[Empty](./components/empty/)** | [`empty.tsx`](./components/empty/empty.tsx) | [`README.md`](./components/empty/README.md) | [1 examples](./components/empty/examples/) |
| **[Field](./components/field/)** | [`field.tsx`](./components/field/field.tsx) | [`README.md`](./components/field/README.md) | [18 examples](./components/field/examples/) |
| **[Fieldset](./components/fieldset/)** | [`fieldset.tsx`](./components/fieldset/fieldset.tsx) | [`README.md`](./components/fieldset/README.md) | [1 examples](./components/fieldset/examples/) |
| **[Form](./components/form/)** | [`form.tsx`](./components/form/form.tsx) | [`README.md`](./components/form/README.md) | [2 examples](./components/form/examples/) |
| **[Frame](./components/frame/)** | [`frame.tsx`](./components/frame/frame.tsx) | [`README.md`](./components/frame/README.md) | [4 examples](./components/frame/examples/) |
| **[Group](./components/group/)** | [`group.tsx`](./components/group/group.tsx) | [`README.md`](./components/group/README.md) | [22 examples](./components/group/examples/) |
| **[Input](./components/input/)** | [`input.tsx`](./components/input/input.tsx) | [`README.md`](./components/input/README.md) | [47 examples](./components/input/examples/) |
| **[Input Group](./components/input-group/)** | [`input-group.tsx`](./components/input-group/input-group.tsx) | [`README.md`](./components/input-group/README.md) | [28 examples](./components/input-group/examples/) |
| **[Kbd](./components/kbd/)** | [`kbd.tsx`](./components/kbd/kbd.tsx) | [`README.md`](./components/kbd/README.md) | [1 examples](./components/kbd/examples/) |
| **[Label](./components/label/)** | [`label.tsx`](./components/label/label.tsx) | [`README.md`](./components/label/README.md) | - |
| **[Menu](./components/menu/)** | [`menu.tsx`](./components/menu/menu.tsx) | [`README.md`](./components/menu/README.md) | [9 examples](./components/menu/examples/) |
| **[Meter](./components/meter/)** | [`meter.tsx`](./components/meter/meter.tsx) | [`README.md`](./components/meter/README.md) | [4 examples](./components/meter/examples/) |
| **[Navigation](./components/navigation/)** | - | [`README.md`](./components/navigation/README.md) | [3 examples](./components/navigation/examples/) |
| **[Number Field](./components/number-field/)** | [`number-field.tsx`](./components/number-field/number-field.tsx) | [`README.md`](./components/number-field/README.md) | [11 examples](./components/number-field/examples/) |
| **[Otp Field](./components/otp-field/)** | [`otp-field.tsx`](./components/otp-field/otp-field.tsx) | [`README.md`](./components/otp-field/README.md) | [9 examples](./components/otp-field/examples/) |
| **[Pagination](./components/pagination/)** | [`pagination.tsx`](./components/pagination/pagination.tsx) | [`README.md`](./components/pagination/README.md) | [3 examples](./components/pagination/examples/) |
| **[Popover](./components/popover/)** | [`popover.tsx`](./components/popover/popover.tsx) | [`README.md`](./components/popover/README.md) | [4 examples](./components/popover/examples/) |
| **[Preview Card](./components/preview-card/)** | [`preview-card.tsx`](./components/preview-card/preview-card.tsx) | [`README.md`](./components/preview-card/README.md) | [1 examples](./components/preview-card/examples/) |
| **[Progress](./components/progress/)** | [`progress.tsx`](./components/progress/progress.tsx) | [`README.md`](./components/progress/README.md) | [3 examples](./components/progress/examples/) |
| **[Radio Group](./components/radio-group/)** | [`radio-group.tsx`](./components/radio-group/radio-group.tsx) | [`README.md`](./components/radio-group/README.md) | [10 examples](./components/radio-group/examples/) |
| **[Scroll Area](./components/scroll-area/)** | [`scroll-area.tsx`](./components/scroll-area/scroll-area.tsx) | [`README.md`](./components/scroll-area/README.md) | [5 examples](./components/scroll-area/examples/) |
| **[Segmented Control](./components/segmented-control/)** | - | [`README.md`](./components/segmented-control/README.md) | - |
| **[Select](./components/select/)** | [`select.tsx`](./components/select/select.tsx) | [`README.md`](./components/select/README.md) | [24 examples](./components/select/examples/) |
| **[Separator](./components/separator/)** | [`separator.tsx`](./components/separator/separator.tsx) | [`README.md`](./components/separator/README.md) | [1 examples](./components/separator/examples/) |
| **[Sheet](./components/sheet/)** | [`sheet.tsx`](./components/sheet/sheet.tsx) | [`README.md`](./components/sheet/README.md) | [3 examples](./components/sheet/examples/) |
| **[Sidebar](./components/sidebar/)** | [`sidebar.tsx`](./components/sidebar/sidebar.tsx) | [`README.md`](./components/sidebar/README.md) | - |
| **[Skeleton](./components/skeleton/)** | [`skeleton.tsx`](./components/skeleton/skeleton.tsx) | [`README.md`](./components/skeleton/README.md) | [2 examples](./components/skeleton/examples/) |
| **[Slider](./components/slider/)** | [`slider.tsx`](./components/slider/slider.tsx) | [`README.md`](./components/slider/README.md) | [23 examples](./components/slider/examples/) |
| **[Spinner](./components/spinner/)** | [`spinner.tsx`](./components/spinner/spinner.tsx) | [`README.md`](./components/spinner/README.md) | [1 examples](./components/spinner/examples/) |
| **[Switch](./components/switch/)** | [`switch.tsx`](./components/switch/switch.tsx) | [`README.md`](./components/switch/README.md) | [9 examples](./components/switch/examples/) |
| **[Table](./components/table/)** | [`table.tsx`](./components/table/table.tsx) | [`README.md`](./components/table/README.md) | [8 examples](./components/table/examples/) |
| **[Tabs](./components/tabs/)** | [`tabs.tsx`](./components/tabs/tabs.tsx) | [`README.md`](./components/tabs/README.md) | [15 examples](./components/tabs/examples/) |
| **[Textarea](./components/textarea/)** | [`textarea.tsx`](./components/textarea/textarea.tsx) | [`README.md`](./components/textarea/README.md) | [15 examples](./components/textarea/examples/) |
| **[Toast](./components/toast/)** | [`toast.tsx`](./components/toast/toast.tsx) | [`README.md`](./components/toast/README.md) | [13 examples](./components/toast/examples/) |
| **[Toggle](./components/toggle/)** | [`toggle.tsx`](./components/toggle/toggle.tsx) | [`README.md`](./components/toggle/README.md) | [17 examples](./components/toggle/examples/) |
| **[Toggle Group](./components/toggle-group/)** | [`toggle-group.tsx`](./components/toggle-group/toggle-group.tsx) | [`README.md`](./components/toggle-group/README.md) | [9 examples](./components/toggle-group/examples/) |
| **[Toolbar](./components/toolbar/)** | [`toolbar.tsx`](./components/toolbar/toolbar.tsx) | [`README.md`](./components/toolbar/README.md) | [1 examples](./components/toolbar/examples/) |
| **[Tooltip](./components/tooltip/)** | [`tooltip.tsx`](./components/tooltip/tooltip.tsx) | [`README.md`](./components/tooltip/README.md) | [4 examples](./components/tooltip/examples/) |

## Usage

To re-download or update components to the latest version from upstream:
```bash
python download_components.py
```

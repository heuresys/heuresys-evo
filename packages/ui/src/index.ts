// Existing exports (preserved)
export { Button, buttonVariants, type ButtonProps } from './components/Button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/Card';
export { Input, type InputProps } from './components/Input';
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
  type ToastProps,
} from './components/Toast';
export { cn } from './lib/cn';

// New B7 components
export { ThemeProvider, useTheme } from './components/theme-provider';
export { ThemeToggle } from './components/theme-toggle';
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog';
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
} from './components/dropdown-menu';
export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent } from './components/popover';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './components/tooltip';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion';
export { Checkbox } from './components/checkbox';
export { Switch } from './components/switch';
export { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from './components/avatar';
export { Badge, badgeVariants } from './components/badge';
export { Skeleton, Spinner } from './components/skeleton';
export { EmptyState, ErrorState } from './components/empty-state';
export type { EmptyStateProps, ErrorStateProps } from './components/empty-state';
export {
  Stack,
  Cluster,
  Center,
  Cover,
  Frame,
  Grid,
  Switcher,
} from './components/layout-primitives';
export { FadeIn, SlideIn, ScaleIn, StaggerChildren, StaggerItem } from './components/motion';
export { CommandPalette, useGlobalCmdK } from './components/command-palette';
export { DataTable, type DataTableProps } from './components/data-table';

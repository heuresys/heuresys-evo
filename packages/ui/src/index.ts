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

// B7 base
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

// === B-EXT TIER 1 — Layout & navigazione admin ===
export { PageHeader, type PageHeaderProps } from './components/page-header';
export { FilterBar, type FilterChip, type FilterBarProps } from './components/filter-bar';
export { AppShell, type AppShellNavItem, type AppShellProps } from './components/app-shell';
export {
  BentoGrid,
  BentoCell,
  type BentoGridProps,
  type BentoCellProps,
} from './components/bento-grid';
export { Breadcrumbs, type BreadcrumbItem } from './components/breadcrumbs';
export { Stepper, type StepperStep, type StepperProps } from './components/stepper';
export { Pagination, type PaginationProps } from './components/pagination';
export { FAB, type FABProps } from './components/fab';
export { MobileBottomNav, type MobileNavItem } from './components/mobile-nav';
export { TabsOverflow, type TabItem } from './components/tabs-overflow';
export { AppSwitcher, type AppSwitcherApp } from './components/app-switcher';
export { MegaMenu, type MegaMenuColumn, type MegaMenuTrigger } from './components/mega-menu';

// === B-EXT TIER 2 — Brand identity & theming ===
export {
  ThemeBuilderWizard,
  STARTER_PRESETS,
  findPreset,
  DEFAULT_THEME_STATE,
  exportTokensCss,
  exportTailwindConfig,
  exportTokensJson,
  exportFigmaTokens,
  exportThemeProvider,
  downloadAsFile,
  type ThemePreset,
  type BrandIdentity,
  type ColorSystem,
  type ColorModes,
  type Typography as TypographyConfig,
  type SpacingLayout,
  type MotionConfig,
  type EffectsConfig,
  type IconographyConfig,
  type ThemeBuilderState,
} from './components/ThemeBuilderWizard';
export { GlassCard, type GlassCardProps } from './components/glass-card';
export { NeumorphicCard, type NeumorphicCardProps } from './components/neumorphic-card';
export {
  oklch,
  toCss as oklchToCss,
  toHex as oklchToHex,
  toRgb as oklchToRgb,
  luminance as oklchLuminance,
  contrastRatio as oklchContrast,
  simulateColorBlind as oklchSimulateColorBlind,
  harmony as oklchHarmony,
  buildScale as oklchBuildScale,
  type OKLCH,
} from './lib/oklch';

// === B-EXT TIER 3 — Wow factor & micro-interactions ===
export { StatsCard, type StatsCardProps } from './components/stats-card';
export { ActivityFeed, type ActivityFeedItem } from './components/activity-feed';
export { NotificationCenter, type Notification } from './components/notification-center';
export { useConfetti, ConfettiButton } from './components/confetti';
export { AchievementBadge, type AchievementBadgeProps } from './components/achievement-badge';
export { OnboardingTour, type TourStep } from './components/onboarding-tour';
export {
  KeyboardShortcutsModal,
  useShortcutsModal,
  type ShortcutGroup,
} from './components/keyboard-shortcuts-modal';
export { MeshGradient, AuroraBackground, DotGrid, NoiseOverlay } from './components/backgrounds';
export { TiltCard } from './components/tilt-card';
export { Banner, type BannerProps } from './components/banner';
export { LottiePlayer, type LottiePlayerProps } from './components/lottie-player';

// === B-EXT TIER 4 — Charts/Viz ===
export {
  EChartsCard,
  echartsPresets,
  Sparkline,
  WinLossSparkline,
  RadialGauge,
  ActivityRing,
  LinearGauge,
  NetworkGraph,
  type EChartsCardProps,
  type SparklineProps,
  type RadialGaugeProps,
  type ActivityRingProps,
  type LinearGaugeProps,
  type NetworkGraphProps,
} from './components/charts';

// === B-EXT TIER 6 — Forms avanzati ===
export {
  FormWizard,
  PhoneInputField,
  MoneyInput,
  IbanInput,
  TaxIdInput,
  OtpInput,
  PasswordStrengthMeter,
  SignaturePadField,
  FileDropzone,
  type FormWizardStep,
  type FormWizardProps,
  type MoneyInputProps,
  type OtpInputProps,
  type SignaturePadFieldProps,
  type FileDropzoneProps,
} from './components/forms';

// === B-EXT TIER 5 — Project mgmt & collaboration ===
export {
  KanbanBoard,
  Timeline,
  CommentThread,
  CalendarGrid,
  type KanbanCard,
  type KanbanColumn,
  type TimelineEvent,
  type Comment,
  type CalendarEvent,
} from './components/collab';

// === B-EXT TIER 7 — Media & viewer ===
export {
  VideoPlayer,
  QRCodeView,
  ImageGallery,
  type VideoChapter,
  type VideoCaption,
  type VideoPlayerProps,
  type GalleryImage,
} from './components/media';

// === B-EXT TIER 9 — File handling & data ops ===
export { DiffViewer, JsonTree, type DiffLine } from './components/files';
export {
  parseCSV,
  exportCSV,
  parseExcel,
  exportExcel,
  parseJSON,
  parseTOML,
  parseXML,
} from './lib/parsers';

// === B-EXT TIER 10 — Markdown extensions ===
export {
  MarkdownView,
  MermaidDiagram,
  Admonition,
  TableOfContents,
  type AdmonitionVariant,
  type TocItem,
} from './components/markdown';

// === B-EXT TIER 8 — AI integration ===
export {
  ChatProvider,
  useChat,
  Chatbot,
  ToolCallView,
  VoiceInput,
  type ChatRole,
  type ChatMessage,
  type ToolCall,
  type ToolResult,
  type ChatProviderAdapter,
} from './components/ai';

// === B-EXT TIER 11 — i18n ===
export {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatList,
  SUPPORTED_LOCALES,
  LanguagePicker,
} from './components/i18n';

// === B-EXT TIER 12 — A11y & settings ===
export { SkipLink, AccessibilityPanel, LiveRegionProvider, useAnnounce } from './components/a11y';

// === B-EXT TIER 13 — DevTools ===
export { PerfMonitor } from './components/devtools';

// === B-EXT TIER 14 — Hero / Marketing sections ===
export { HeroSplit, HeroCentered, HeroVideoBackground } from './components/marketing';

// === B-EXT TIER 15 — Utility & text effects ===
export { AnimatedNumber, Typewriter, GradientText, Marquee } from './components/utility';

// === B-EXT TIER 16 — XR / 3D ===
export { ThreeScene } from './components/xr';

// === B-EXT TIER 17 — Atomic dashboard components (Phase 13.A) ===
export {
  IntegrationHealthPill,
  KpiRing,
  SuccessionCard,
  CareerArc,
  KgMiniGraph,
  SkillHeatmap,
  CapabilityRadar,
  RbacMatrix,
  type IntegrationHealthPillProps,
  type IntegrationHealthTone,
  type KpiRingProps,
  type KpiRingTone,
  type KpiRingThresholds,
  type SuccessionCardProps,
  type SuccessionRisk,
  type SuccessionReadiness,
  type CareerArcProps,
  type CareerStage,
  type CareerStageStatus,
  type KgMiniGraphProps,
  type KgMiniGraphLegendItem,
  type SkillHeatmapProps,
  type SkillHeatmapAxis,
  type SkillHeatmapCell,
  type CapabilityRadarProps,
  type CapabilityRadarAxis,
  type CapabilityRadarSeries,
  type RbacMatrixProps,
  type RbacRole,
  type RbacArea,
  type RbacAssignment,
  type RbacPermissionLevel,
} from './components/dashboard';

// Phase 14 Sprint 3.G — Tier 2 explorer atomics
export {
  ESCOTreeNavigator,
  type ESCOTreeNavigatorProps,
  type ESCOTreeNode,
} from './components/esco-tree-navigator';
export {
  KGGraphCanvas,
  type KGGraphCanvasProps,
  type KGNode,
  type KGEdge,
} from './components/kg-graph-canvas';
export {
  SAPSyncPanel,
  type SAPSyncPanelProps,
  type SAPJobSummary,
  type SAPJobStatus,
  type SAPDeltaEntry,
} from './components/sap-sync-panel';

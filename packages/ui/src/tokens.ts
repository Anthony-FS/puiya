/**
 * Design tokens shared by the mobile app and, later, the web dashboard.
 *
 * Sized for older shop owners on cheap Android phones: large text, large tap targets and
 * high contrast in bright shop light. Text colours are tested against WCAG AA (4.5:1).
 */

export const colors = {
  /** Screen background: warm off-white, easier on the eyes than pure white in sunlight. */
  background: '#F7F6F1',
  surface: '#FFFFFF',
  /** Main text. */
  ink: '#1C2118',
  /** Secondary text: labels, hints, timestamps. */
  muted: '#4F584A',
  border: '#D6D9CF',
  /** Brand and primary actions: deep paddy green. */
  primary: '#2E6B34',
  onPrimary: '#FFFFFF',
  primarySoft: '#E2EEDF',
  /** Status colours. Always paired with an icon and a word, never colour alone. */
  success: '#2E6B34',
  warning: '#8A5A00',
  warningSoft: '#FBEFD5',
  danger: '#B3261E',
  dangerSoft: '#F9E0DE',
  offline: '#4F584A',
  offlineSoft: '#E9EBE4',
} as const

/** 4-point spacing scale, in density-independent pixels. */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const

/** Thai script needs extra line height for tone marks above and vowels below. */
export const fontFamily = {
  regular: 'Sarabun_400Regular',
  medium: 'Sarabun_500Medium',
  bold: 'Sarabun_700Bold',
} as const

export const type = {
  caption: { fontSize: 16, lineHeight: 26 },
  body: { fontSize: 18, lineHeight: 29 },
  bodyLarge: { fontSize: 20, lineHeight: 32 },
  title: { fontSize: 24, lineHeight: 36 },
  display: { fontSize: 32, lineHeight: 48 },
} as const

/** Minimum sizes, in density-independent pixels. */
export const touch = {
  /** Smallest tappable area for any control. */
  minTarget: 48,
  /** Main actions such as "Pay" or "Add to sale". */
  primaryButtonHeight: 56,
  tabBarHeight: 68,
} as const

export type ColorToken = keyof typeof colors

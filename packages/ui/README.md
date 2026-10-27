# @puiya/ui

Design tokens for Puiya: colours, spacing, radius, type scale, tap-target sizes and the Sarabun
font names. The mobile app uses them through React Native `StyleSheet`; there is no NativeWind
or Tailwind (decided in P2-01: fewer moving parts on low-end phones).

| Export               | What it is                                                                            |
| -------------------- | ------------------------------------------------------------------------------------- |
| `colors`             | Palette; every text colour meets WCAG AA (4.5:1) on its background, enforced by tests |
| `space`, `radius`    | 4-point spacing scale and corner radii                                                |
| `type`, `fontFamily` | 16–32 px sizes with ≥ 1.5× line height for Thai tone marks; Sarabun weights           |
| `touch`              | Minimum 48 dp tap targets, 56 dp primary buttons, 68 dp tab bar                       |
| `contrastRatio`      | WCAG contrast helper used by the tests                                                |

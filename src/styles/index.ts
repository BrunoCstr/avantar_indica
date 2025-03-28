import { createTheme } from "@shopify/restyle";

import { colors } from "./colors";
import { spacing } from "./spacing";
import { textVariants } from "./textVariants";

export const theme = createTheme({
    colors,
    spacing,
    textVariants
})

export type ThemeProps = typeof theme;
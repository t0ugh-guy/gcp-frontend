import '@mui/material/Stack'
import '@mui/material/Grid'
import '@mui/material/Typography'
import '@mui/material/ListItemText'
import '@mui/material/TextField'
import '@mui/material/Drawer'
import '@mui/material/Tabs'

declare module '@mui/material/Stack' {
  interface StackOwnProps {
    alignItems?: any
    justifyContent?: any
    mb?: any
    mt?: any
    gap?: any
    flexWrap?: any
    py?: any
    px?: any
    p?: any
    m?: any
    flexGrow?: any
    flexBasis?: any
    flexShrink?: any
    width?: any
    height?: any
  }
}

declare module '@mui/material/Grid' {
  interface GridBaseProps {
    item?: boolean
    xs?: any
    sm?: any
    md?: any
    lg?: any
    xl?: any
  }
}

declare module '@mui/material/Typography' {
  interface TypographyOwnProps {
    lineHeight?: any
    fontWeight?: any
    letterSpacing?: any
  }
}

declare module '@mui/material/ListItemText' {
  interface ListItemTextProps {
    primaryTypographyProps?: any
  }
}

declare module '@mui/material/TextField' {
  interface BaseTextFieldProps {
    InputProps?: any
    FormHelperTextProps?: any
  }
}

declare module '@mui/material/Drawer' {
  interface DrawerProps {
    PaperProps?: any
  }
}

declare module '@mui/material/Tabs' {
  interface TabsOwnProps {
    size?: any
  }
}

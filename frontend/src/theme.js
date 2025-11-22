// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    dark: {
      primary: "#9F7AEA", // A softer purple
      secondary: "#805AD5",
      background: "#1A202C", // Dark Slate Gray
      surface: "#2D3748", // Lighter Slate Gray
      text: "rgba(255, 255, 255, 0.92)", // Off-white
      accent: "#B794F4", // A light purple for accents
    },
    light: {
      primary: "#8A2BE2",
      secondary: "#4B0082",
      background: "#F7FAFC", // Very light gray
      surface: "#EDF2F7", // Light gray
      text: "#1A202C", // Dark Slate Gray
      accent: "#8A2BE2",
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "dark.background" : "light.background",
        color: props.colorMode === "dark" ? "dark.text" : "light.text",
        fontFamily: "body",
      },
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: props.colorMode === "dark" ? "dark.surface" : "light.surface",
      },
      "::-webkit-scrollbar-thumb": {
        background: props.colorMode === "dark" ? "dark.primary" : "light.primary",
        borderRadius: "4px",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "dark.primary" : "light.primary",
          color: props.colorMode === "dark" ? "dark.text" : "white",
          _hover: {
            bg: props.colorMode === "dark" ? "dark.secondary" : "light.secondary",
          },
        }),
      },
    },
    Select: {
      baseStyle: (props) => ({
        field: {
          bg: props.colorMode === "dark" ? "dark.surface" : "light.surface",
          borderColor: props.colorMode === "dark" ? "dark.primary" : "light.primary",
          color: props.colorMode === "dark" ? "dark.text" : "light.text",
        },
      }),
    },
    Textarea: {
      baseStyle: (props) => ({
        bg: props.colorMode === "dark" ? "dark.surface" : "light.surface",
        borderColor: props.colorMode === "dark" ? "dark.primary" : "light.primary",
        color: props.colorMode === "dark" ? "dark.text" : "light.text",
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === "dark" ? "dark.accent" : "light.accent",
      }),
    },
    ListItem: {
      baseStyle: (props) => ({
        bg: props.colorMode === "dark" ? "dark.surface" : "light.surface",
      }),
    },
  },
});

export default theme;


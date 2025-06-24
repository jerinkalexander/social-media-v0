// components/ScreenContainer.tsx
import { StyleSheet, View, ViewProps } from "react-native"

export default function ScreenContainer({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  content: {
    width: "100%",
    maxWidth: 700,
    flex: 1,
  },
})
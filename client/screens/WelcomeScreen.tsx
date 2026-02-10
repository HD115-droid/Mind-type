import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useApp } from "@/context/AppContext";
import { Spacing, BorderRadius } from "@/constants/theme";

type RootStackParamList = {
  Main: undefined;
  Welcome: undefined;
  TypeSelector: undefined;
};

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setHasSeenWelcome } = useApp();

  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.6);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleTakeQuiz = async () => {
    await setHasSeenWelcome(true);
    // Directly go to the test tab, not the agents tab
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Main",
            state: {
              index: 0,
              routes: [{ name: "TestTab" }],
            },
          },
        ],
      }),
    );
  };

  const handleSelectType = async () => {
    await setHasSeenWelcome(true);
    navigation.navigate("TypeSelector");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={[
          "rgba(139, 92, 246, 0.25)",
          "rgba(139, 92, 246, 0.05)",
          "transparent",
        ]}
        style={styles.topGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={["transparent", "rgba(139, 92, 246, 0.1)"]}
        style={styles.bottomGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing["4xl"],
            paddingBottom: insets.bottom + Spacing["4xl"],
          },
        ]}
      >
        <Animated.View
          entering={FadeIn.delay(200)}
          style={styles.logoContainer}
        >
          <Animated.View
            style={[
              styles.glowRing,
              animatedGlowStyle,
              { shadowColor: theme.neonRed },
            ]}
          />
          <Animated.View
            style={[
              styles.glowRingInner,
              animatedGlowStyle,
              { shadowColor: theme.neonRed },
            ]}
          />
          <Animated.View style={[styles.logoWrapper, animatedLogoStyle]}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>

        <View style={styles.textSection}>
          <Animated.View entering={FadeInUp.delay(400).springify()}>
            <ThemedText type="h1" style={styles.title}>
              MindType
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(600)}>
            <ThemedText
              type="h3"
              style={[styles.subtitle, { color: theme.neonRed }]}
            >
              Discover Your Cognitive Blueprint
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(800)}>
            <ThemedText
              type="body"
              style={[styles.description, { color: theme.textSecondary }]}
            >
              Explore your unique personality through cognitive functions,
              connect with AI personalities, and learn to master your mental
              patterns.
            </ThemedText>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(1000).springify()}
            style={styles.features}
          >
            <View
              style={[
                styles.featureItem,
                {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                type="small"
                style={{ color: theme.neonRed, fontWeight: "700" }}
              >
                16
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Personalities
              </ThemedText>
            </View>
            <View
              style={[
                styles.featureItem,
                {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                type="small"
                style={{ color: theme.neonRed, fontWeight: "700" }}
              >
                AI
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Companions
              </ThemedText>
            </View>
            <View
              style={[
                styles.featureItem,
                {
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                type="small"
                style={{ color: theme.neonRed, fontWeight: "700" }}
              >
                8
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Functions
              </ThemedText>
            </View>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(1200).springify()}
          style={styles.buttonContainer}
        >
          <Button
            onPress={handleTakeQuiz}
            testID="button-take-quiz"
            size="large"
          >
            Take the Quiz
          </Button>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSelectType}
            style={[styles.secondaryButton, { borderColor: theme.neonRed }]}
            testID="button-select-type"
          >
            <ThemedText
              type="body"
              style={[styles.secondaryButtonText, { color: theme.neonRed }]}
            >
              I Already Know My Type
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 260,
  },
  glowRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 16,
  },
  glowRingInner: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: "hidden",
  },
  logo: {
    width: 140,
    height: 140,
  },
  textSection: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
    fontSize: 38,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginBottom: Spacing.xl,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
  },
  description: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xl,
    fontSize: 16,
  },
  features: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  featureItem: {
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  buttonContainer: {
    width: "100%",
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  secondaryButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 17,
  },
});

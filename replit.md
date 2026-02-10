# MindType - Replit Agent Guidelines

## Overview

MindType is a web-only Expo application that helps users discover their MBTI personality type through a 14-question A/B personality quiz, then connects them with AI companions representing different personality types for personalized conversations and advice. The app follows an "Apple Premium Dark" aesthetic with a dark theme (#000000 to #0A0A0F backgrounds) and purple accents (#8B5CF6 primary, #A78BFA secondary).

### Web Deployment
- The public URL (port 5000) serves a pre-built Expo web app from `dist/web/`
- The web build is generated via `npx expo export --platform web --output-dir dist/web`
- Express serves static assets first, then API routes, then SPA fallback (all non-API GET requests serve index.html)
- `getApiUrl()` in `client/lib/query-client.ts` uses `window.location.origin` for same-origin API calls
- No mobile (iOS/Android) builds — all mobile-specific code has been removed

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54 (New Architecture enabled)
- **Navigation**: React Navigation v7 with bottom tabs and native stack navigators
- **State Management**: React Context (AppContext) for global app state, TanStack React Query for server state
- **Styling**: StyleSheet-based with a centralized theme system in `client/constants/theme.ts`
- **Animations**: React Native Reanimated for smooth UI animations
- **Storage**: AsyncStorage for persisting user preferences and test results

### Backend Architecture
- **Runtime**: Express.js server with TypeScript
- **API Pattern**: RESTful endpoints with JSON request/response
- **AI Integration**: OpenAI API via Replit AI Integrations for chat agents
- **Database ORM**: Drizzle ORM with PostgreSQL

### Key Design Patterns
- **Path Aliases**: `@/` maps to `client/`, `@shared/` maps to `shared/`
- **Screen Layout**: All screens use safe area insets, header height, and tab bar height for proper spacing
- **Component Library**: Themed components (ThemedText, ThemedView, Button, Card) ensure consistent styling
- **Dark Mode Only**: The app forces dark color scheme for the Apple Premium Dark aesthetic

### Navigation Structure
```
RootStackNavigator
├── WelcomeScreen (first launch only)
├── MainTabNavigator
│   ├── TestTab → TestStackNavigator → TestScreen
│   ├── AgentsTab → AgentsStackNavigator → AgentsScreen (labeled "Companions")
│   ├── WellnessTab → WellnessStackNavigator → WellnessScreen
│   └── ProfileTab → ProfileStackNavigator → ProfileScreen
├── ResultsScreen
├── TypeSelectorScreen
├── ChatScreen
├── GroupChatSetupScreen
└── LoopDetailsScreen
```

### Data Models
- **MBTI Types**: 16 personality types with cognitive function stacks, defined in `client/data/mbtiTypes.ts`
- **Questions**: 14-question A/B quiz in `client/data/mbtiQuestions.ts` scoring E/I, S/N, T/F, J/P axes
- **Loop Info**: Wellness content about cognitive loops in `client/data/loopInfo.ts`
- **Users**: Basic user schema in `shared/schema.ts`
- **Conversations/Messages**: Chat persistence models in database (conversations + messages tables)

### Quiz System
- 14 A/B questions scoring across 4 axes: E/I, S/N, T/F, J/P
- Automatic advancement after selecting an option
- Results screen displays MBTI type with axis score breakdown
- Tie handling: "Weak preference" label shown when axis is tied (left letter chosen via >= comparison)
- Welcome screen offers "Take the Quiz" or "I Already Know My Type" options

## External Dependencies

### AI Services
- **OpenAI API**: Accessed via Replit AI Integrations for chat completions
  - Environment: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Used for personality-based AI agent conversations

### Database
- **PostgreSQL**: Primary database via Drizzle ORM
  - Environment: `DATABASE_URL`
  - Schema managed with `drizzle-kit push`

### Expo Services (Web Only)
- **expo-font**: Custom font loading (Nunito)
- **expo-blur**: Glass effect on tab bar

### Replit Integrations
The `server/replit_integrations/` folder contains pre-built utilities:
- **audio/**: Voice chat with speech-to-text and text-to-speech
- **batch/**: Rate-limited batch processing for LLM calls
- **chat/**: Conversation persistence and streaming
- **image/**: Image generation via gpt-image-1
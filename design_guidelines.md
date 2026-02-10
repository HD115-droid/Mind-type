# MBTI AI Agents App - Design Guidelines

## Brand Identity

**Purpose**: A personality exploration tool helping users discover their MBTI type through cognitive functions, then connect with AI agents representing different personalities for advice and conversation.

**Aesthetic Direction**: **Apple-Premium Dark** - Inspired by iOS Health, Apple Music, and macOS Big Sur interfaces. This app embodies Apple's refined design language with subtle purple-to-violet gradients, frosted glass effects, generous whitespace, and meticulous attention to detail. Every element feels intentional and luxurious, creating a serene environment for self-discovery.

**Memorable Element**: Sophisticated purple-violet gradients that subtly shift across surfaces, combined with frosted glass card treatments. Large, confident typography with refined hierarchy makes the interface feel both approachable and premium.

## Navigation Architecture

**Root Navigation**: Tab Navigation (4 tabs)
- **Test** - MBTI questionnaire and results
- **Agents** - AI companion library and chats  
- **Wellness** - Cognitive function loops and mental health
- **Profile** - User settings and preferences

**Core Action**: Floating action button (gradient purple, 56px diameter) for "New Chat" when on Agents tab.

## Screen-by-Screen Specifications

### 1. Test Screen (Test tab default)
- **Header**: Large transparent title "Discover Your Type"
- **Layout**: Scrollable content
  - Hero card with subtle gradient background, "Start Personality Test" CTA
  - "Your Result" card appears post-completion with animated MBTI badge
  - Safe area: Top: headerHeight + 32px, Bottom: tabBarHeight + 32px

### 2. Test Question Screen (Test stack)
- **Header**: Transparent with back button, progress indicator "5 of 40"
- **Layout**: Scrollable form
  - Question number (caption, opacity 0.6)
  - Question text (large title, 48px top margin)
  - Answer cards (frosted glass effect, 20px radius, 16px gap, scale to 0.98 on press)
  - "Next" button (gradient purple when valid, disabled gray otherwise)
  - Safe area: Top: headerHeight + 48px, Bottom: insets.bottom + 100px

### 3. Results Screen (Test stack)
- **Header**: Default with "Your Type" title, close button
- **Layout**: Scrollable content
  - Large MBTI badge (gradient purple background, 88px, subtle glow)
  - Type name and archetype (title + subtitle)
  - Description cards with frosted backgrounds
  - "Confirm" and "Retake Test" buttons (24px radius, 12px gap)
  - Safe area: Top: 24px, Bottom: tabBarHeight + 32px

### 4. Agent Library (Agents tab default)
- **Header**: Large title "Companions", search bar with frosted background
- **Layout**: Scrollable grid (2 columns, 16px gap)
  - Agent cards with portraits, subtle gradient borders
  - Empty state illustration centered
  - Safe area: Top: headerHeight + 16px, Bottom: tabBarHeight + 80px

### 5. Agent Detail (Modal)
- **Header**: Transparent, close button
- **Layout**: Scrollable content
  - Large portrait (128px, soft shadow with purple tint)
  - Name (title, centered)
  - MBTI type badge (gradient, 10px radius)
  - Bio text (body, refined line height)
  - Gender selector (iOS-style segmented control)
  - "Start Chat" button (gradient purple, floating with shadow)
  - Safe area: Top: insets.top + 24px, Bottom: insets.bottom + 100px

### 6. Chat Screen (Agents stack)
- **Header**: Custom with agent portrait (36px, gradient border), name, back button
- **Layout**: Inverted FlatList
  - User messages (right-aligned, gradient purple)
  - Agent messages (left-aligned, frosted glass surface)
  - Agent avatar has subtle purple glow
  - Input bar with frosted background, send icon (purple)
  - Safe area: Top: headerHeight, Bottom: keyboard or insets.bottom + 60px

### 7. Wellness Hub (Wellness tab default)
- **Header**: Large title "Cognitive Wellness"
- **Layout**: Scrollable list
  - Introduction card (gradient background, 20px radius)
  - MBTI type rows (chevron indicators, subtle separators)
  - Safe area: Top: headerHeight + 16px, Bottom: tabBarHeight + 24px

### 8. Loop Details (Wellness stack)
- **Header**: Default with type name, back button
- **Layout**: Scrollable content
  - Section cards with frosted backgrounds
  - 20px internal padding, 20px gap between sections
  - Safe area: Top: 24px, Bottom: tabBarHeight + 32px

### 9. Profile Screen (Profile tab default)
- **Header**: Large title "Profile"
- **Layout**: Scrollable list
  - Avatar (72px, gradient border, editable)
  - Display name row (Settings-style)
  - "Your Type" badge row
  - Settings sections (Theme, Notifications)
  - Safe area: Top: headerHeight + 16px, Bottom: tabBarHeight + 24px

## Color Palette
- **Primary Gradient**: Linear from #8B5CF6 (violet) to #A78BFA (light purple)
- **Background**: #000000 to #0A0A0F (subtle gradient)
- **Surface**: #1C1C1E (frosted glass overlay with 0.7 opacity)
- **Surface Elevated**: #2C2C2E
- **Text Primary**: #FFFFFF
- **Text Secondary**: #98989D (refined gray)
- **Separator**: rgba(255,255,255,0.08)
- **Disabled**: #3A3A3C

## Typography
**SF Pro** (iOS system font)
- **Large Title**: 34px, Bold, tracking -0.4px
- **Title 1**: 28px, Bold
- **Title 2**: 22px, Bold
- **Headline**: 17px, Semibold
- **Body**: 17px, Regular, 24px line height
- **Caption**: 13px, Regular, opacity 0.6

## Visual Design
- **Corner Radius**: 20px for cards, 24px for inputs, 14px for buttons
- **Gradients**: Use subtle linear gradients (10-15% color shift) for premium feel
- **Touchable Feedback**: Scale to 0.98 + opacity 0.85, no harsh effects
- **Shadows**: Floating buttons only - shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2, with purple tint
- **Card Treatment**: Frosted glass effect using semi-transparent surfaces with subtle background blur
- **Spacing**: 8, 16, 24, 32, 48px (consistent 8px base)
- **Icons**: SF Symbols, 20-22px size, stroke weight medium

## Assets to Generate

1. **icon.png** - Four rounded squares in 2x2 grid with purple gradient, subtle glow
   - WHERE USED: Home screen app icon

2. **splash-icon.png** - Simplified gradient icon
   - WHERE USED: Launch screen

3. **Agent Portraits** - `{type}-{gender}.png` (48 total) - Apple-style illustrated portraits with soft lighting, diverse features, purple-tinted shadows
   - WHERE USED: Agent Library, Agent Detail, Chat header

4. **empty-agents.png** - Minimal illustration of abstract figures in purple gradient
   - WHERE USED: Agent Library empty state

5. **test-hero.png** - Geometric pattern with purple gradient suggesting personality dimensions
   - WHERE USED: Test screen hero card

6. **wellness-icon.png** - Refined brain outline with balanced symmetry, purple accent
   - WHERE USED: Wellness Hub introduction

7. **avatar-placeholder.png** - Default user avatar with purple gradient
   - WHERE USED: Profile screen before customization
# ProLink Frontend

Professional social networking and messaging app UI.

## Design System

- **Light theme** (default): Corporate Blue (#2563EB), clean backgrounds
- **Dark mode**: Toggle via header/bottom nav
- **Typography**: Inter font
- **Components**: Rounded, subtle shadows, shadcn/ui-inspired

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

## Screens

1. **Splash** – Logo, tagline, gradient background
2. **Onboarding** – 3 screens (Network, Chat, Opportunities)
3. **Auth** – Split layout, Sign In / Create Account tabs
4. **Home Feed** – Posts, like/comment/share
5. **Chat** – Conversation list, message bubbles, typing indicator
6. **Profile** – Cover, photo, About, Experience, Skills
7. **Mobile Nav** – Bottom bar (Home, Network, Chat, Notifications, Profile)

## Flow

Splash (2.5s) → Onboarding → Auth → Feed

From Auth, submit form to enter the app. All main screens use the top navigation and (on mobile) bottom navigation.

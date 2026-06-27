# Dada V2 Design Direction

The V2 interface should feel closer to a polished relationship/social product than a hackathon utility. The target is clean, intentional, and slightly editorial, with a Hinge-like sense of restraint.

## Principles

- Minimal first, expressive second. Use whitespace, type, rhythm, and motion before adding decoration.
- Avoid emoji as UI primitives. Icons, abstract avatars, and custom marks should carry the visual language.
- Activity cards should feel collectible and trustworthy, not like feed noise.
- Motion should explain a state transition: onboarding progress, profile generation, reveal, waiting for confirmation, or permission unlock.
- Keep the product useful on a phone-sized viewport. No dense desktop dashboard patterns.

## Visual Language

- Background: warm paper or soft neutral, with subtle texture or depth.
- Text: high-contrast ink, short lines, generous spacing.
- Cards: thin borders, small radius, restrained shadow, strong hierarchy.
- Accent: one confident primary color, used sparingly for intent and active state.
- Icons: lucide-based or custom line icons, consistent stroke, no random emoji markers.
- Avatar: abstract orb or glassy identity mark, closer to Siri/ambient assistant than cute mascot.

## Key Screens

### Splash

The first screen should feel cinematic but not loud. Use an animated slogan, abstract campus/social background, and terms gating.

### Onboarding

Onboarding should feel like a guided profile interview, not a long form. Use one decision at a time, visible progress, and calm transitions.

### Profile Reveal

The reveal should be the emotional payoff after onboarding. Avoid confetti. Use unfolding, light, focus, or card assembly motion.

### Explore

Map and list should share the same information design. The map can be stylized first, with fuzzy zones and locked placeholders to imply nearby opportunities.

### Match Chat

The task card and countdown should stay pinned. Free chat is not the default; permission-based actions are the core interaction.

## Copy Tone

- Natural campus Chinese, not AI assistant prose.
- Short, specific, and slightly witty.
- Avoid explaining features in visible UI unless the user needs the information to decide.
- Dada can have dry humor, but it should not become noisy or try-hard.

## Implementation Notes

- Keep Tailwind for speed, but replace the current orange-heavy design tokens.
- Use CSS/SVG motion first. Add Rive, Lottie, or 3D only after the visual direction is stable.
- Prefer real interface polish over heavy illustration.
- Maintain reduced-motion fallbacks for major animations.

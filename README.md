# Phoker Voice Blackjack

A mobile-first hackathon MVP for voice-controlled blackjack opened from an iMessage mini-app card. The demo presents an incoming call from Mina, an AI dealer, then runs a fixed-wager play-credit hand with no blackjack buttons.

## Run the demo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`, answer Mina’s call, and say **hit**, **stand**, **double**, or **deal**. Desktop demo shortcuts are `H`, `S`, `D`, and `N`.

## Voice modes

- With `NEXT_PUBLIC_VAPI_PUBLIC_KEY` and `NEXT_PUBLIC_VAPI_ASSISTANT_ID`, the page connects through the Vapi Web SDK. Configure that Vapi assistant with the desired ElevenLabs voice.
- Without those values, the hackathon demo requests browser microphone access and uses browser speech recognition and speech synthesis.
- If neither voice path is available, the visual demo still works with the keyboard shortcuts.

The MVP parses final user transcripts locally. A production version should turn those commands into server-side Vapi tools and accept only backend-authoritative game snapshots.

## Photon handoff

The backend should reply to the user’s iMessage with a Photon Spectrum mini-app card whose URL points to this deployed page. Use the expanded sheet presentation; Photon can retain its normal browser URL fallback for unsupported clients.

For the hackathon, no session token is required. A production invite should use a short-lived, one-time token in the mini-app URL.

## Deliberately out of scope

- Real money, deposits, withdrawals, identity checks, or geolocation
- Split, insurance, surrender, variable wagers, or multiplayer tables
- Accounts, persistence, analytics, or an authoritative game backend
- Realtime avatar lip sync; Mina uses a subtle looping portrait treatment

## Checks

```bash
npm run lint
npm test
```

The tests cover server-rendered invite content, the absence of blackjack action buttons, hand scoring, payouts, hit/stand/double behavior, and deterministic demo decks.

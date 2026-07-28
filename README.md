# FocusSync

FocusSync is an offline-first study app. A student can run focus sessions and update syllabus progress with no network connection, and two devices that made conflicting edits while offline converge on the same state once they sync. It is built with TypeScript, React Native with Expo, Express and n8n.

The app has one hardcoded student, `student_1`, and three device profiles: `phone`, `laptop` and `tablet`. Each device keeps its own saved state and pending changes, so the profiles behave like separate devices in one browser.

## Features

- Focus sessions that can start, finish or fail while offline
- A five-second grace period before leaving the app fails a running session
- Coins and focus minutes counted once per successful session, with the streak advancing once per active day
- Subjects, chapters and tasks with instant offline progress updates
- Custom conflict handling for changes made on different devices
- A Sync Lab for device switching, conflict tests and duplicate replay tests
- Express APIs with persisted state and operation deduplication
- An n8n workflow that creates one notification for each successful session
- An Alerts page that reads the notification back into the app

## Run the Frontend with the Hosted Backend

Create a root `.env` file pointing at your deployed backend:

```env
EXPO_PUBLIC_API_BASE_URL=https://YOUR-PUBLIC-BACKEND
EXPO_PUBLIC_FOCUS_TEST_MODE=false
```

Then run:

```bash
npm install
npm run web
```

The web app normally opens at `http://localhost:8081`.

## Run Everything Locally

Create the root `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
EXPO_PUBLIC_FOCUS_TEST_MODE=false
```

Create `server/.env`:

```env
PORT=4000
N8N_WEBHOOK_URL=https://YOUR-N8N-DOMAIN/webhook/focus-success
NOTIFICATION_SINK_URL=https://YOUR-PUBLIC-BACKEND/api/notifications/sink
FOCUS_TEST_MODE=false
```

Run the frontend:

```bash
npm install
npm run web
```

Run Express in another terminal:

```bash
npm --prefix server install
npm run server
```

## One-Minute Demo Mode

Focus sessions normally run from 25 to 120 minutes. A one-minute option exists only so the offline and sync behaviour can be demonstrated without waiting out a full session.

Set both values to `true` and restart the frontend and backend:

```env
EXPO_PUBLIC_FOCUS_TEST_MODE=true
FOCUS_TEST_MODE=true
```

Keep both values disabled for normal session lengths.

## n8n Setup

1. Import `n8n-workflow.json` into n8n Cloud.
2. Publish the workflow.
3. Put its production webhook URL in `N8N_WEBHOOK_URL` on the backend.
4. Put the public notification sink URL in `NOTIFICATION_SINK_URL`.
5. Restart or redeploy Express after changing the environment variables.

After Express confirms a successful focus session, it sends one event to n8n. n8n calls the notification sink, and the Alerts page displays the saved notification. The sink is a mock HTTP endpoint standing in for a real messaging provider, so the automation can be exercised end to end without a WhatsApp Business account.

`n8n-reward-prototype.json` is a separate optional workflow. It shows the first, quick version of the reward rule inside n8n: add 50 coins once for each `sessionId` and advance the streak only once on the same UTC day. The app does not use this workflow in production. The final rule lives in Express because the backend can validate session timing and save rewards together with the synced state.

## Sync Rules

Task progress uses this order:

```text
not_started < in_progress < done
```

The higher progress wins when two devices change the same task. A deletion is kept as a tombstone and wins against an edit. Duplicate operations are ignored using `operationId`. Focus rewards and notifications are counted once using `sessionId`.

These rules do not use device time, because phone and laptop clocks may disagree.

## Tunable Rules

- The background grace period is five seconds.
- A successful focus session gives 50 coins.
- Today's focus total uses the UTC date.
- Subject progress uses completed tasks divided by all active tasks in the subject.
- The notification target is the allowed mock HTTP sink.
- JSON files are used for server storage.

## Storage

The frontend uses AsyncStorage. Phone and laptop have separate keys:

```text
focussync:v1:phone:redux-state
focussync:v1:laptop:redux-state
focussync:v1:tablet:redux-state
```

Express stores its state in JSON files inside `server/data`. This keeps the project easy to run locally with no database to provision. A production deployment should use a database with unique constraints instead, since a free hosting service may replace local files during a redeploy.

## Main Files

- `src/components/focus/FocusSessionLifecycle.tsx`
- `src/features/focus/sessionTiming.ts`
- `src/features/sync/operationTemplates.ts`
- `src/features/sync/conflictResolution.ts`
- `src/features/sync/syncClient.ts`
- `server/src/services/syncService.ts`
- `server/src/services/automationService.ts`
- `n8n-workflow.json`
- `n8n-reward-prototype.json`

## Not Included

Real WhatsApp delivery and a real-phone Expo Go build are not wired up. The code is React Native and runs on a device through Expo Go, but the sync and conflict behaviour is easiest to demonstrate with several browser profiles side by side, so that is what the setup above targets. Remaining ideas are listed in `DECISIONS.md`.

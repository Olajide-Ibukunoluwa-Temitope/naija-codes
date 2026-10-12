# Naija Codes

A word game for two teams, built for games night. Next.js, React and TypeScript. It builds to plain static files, so it needs no server.

## Run it on your computer

```
npm install
npm run dev
```

Open http://localhost:3000.

## Put it online

Option 1, Vercel with GitHub:
1. Push this folder to a new GitHub repo.
2. On vercel.com choose Add New, then Project, and import the repo.
3. Keep the default settings and press Deploy. You get a public link.

Option 2, Vercel from the terminal:
```
npx vercel
npx vercel --prod
```

Option 3, no GitHub needed:
```
npm run build
```
Then drag the `out` folder onto Netlify Drop (app.netlify.com/drop).

## How to play

1. Put the page on the big screen. Pick a word pack, tap New game and read out the game code.
2. Each team picks a spymaster. They open the link on their phone, type the code, tap Load, then switch to Spymaster.
3. The first letter of the code sets the word pack: N for Naija, M for Mixed, C for Classic.
4. Spymasters give a one word clue and a number. The team taps cards on the big screen.

## Change the words

Edit `lib/words.ts`. Words are separated by commas. Keep single words to 9 letters or fewer so they fit on small phones.
Everyone must use the same deployed version, or the boards will not match.

## Where things live

- `lib/game.ts`: board shuffling from the game code, turn rules, win rules
- `lib/words.ts`: the word packs
- `components/Game.tsx`: the main screen and game actions
- `app/globals.css`: all styling

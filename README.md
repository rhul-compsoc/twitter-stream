# ~~twitter-stream v2~~
# compsoc-stream v2.5

Due to changes to the Twitter API, we decided to make this a little more general and add additional ways for users to send messages.

## What needs doing

Currently this is all the stuff I can think of that needs doing. 

Feel free to add if you think anything else needs to be added!

- [x] Admin authentication using Discord OAuth
- [ ] Conversion and generalisation of Tweets to Messages (worked on by Leo)
    - [x] Updating schema to make it more general
    - [ ] Create endpoint for message submission, and receiving
        - [ ] Rate limiting, some form of spam protection
    - [ ] Updating UI to make it less specific to Twitter
    - [ ] Testing the stuff
- [ ] Message submission methods
    - [ ] Discord message submission
    - [ ] Form based submission (using Zod)
    - [ ] LinkedIn submission wwwwww
- [ ] Clean up, document, and polish

**IMPORTANT**: Please inform the rest of the team or edit this README to let other people know you are working on a feature.

## Dependencies

Please make sure you have:

-   [node](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/)
-   A MySQL instance

And have run `pnpm i` in the repo location

## Before running

Before developing please make sure you have an `.env.local` file in the repo home dir with the following keys

```env
DATABASE_URL="mysql://someone@somewhere/someplace"

DISCORD_CLIENT_ID="xxxxxxxxxxxxxxxxxx"
DISCORD_CLIENT_SECRET="Opppan_gangnam_style"
DISCORD_AUTH_SERVER_ID="xxxxxxxxxxxxxxxx"
DISCORD_AUTH_ROLES='["xxxxxxxxxxxxxxxx", "xxxxxxxxxxxxxxxx"]'

TRUSTED_AGENT_SECRET="some_secret"

NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='something_secret'
```

-   To get Discord Client ID and secrets, go [here](https://discord.com/developers/applications) to create an app.
-   If any help is needed setting up, dm either Leo (doobes#0083) or Charlie (chazzox#1001) on discord
-   Role and Server IDs are obtained by enabling developer mode in Discord, and right clicking the role or server.

If you are creating a new theme, please name the branch `theme-[name_of_theme]`, this way we know what each branch is for!

## Running

Then, as long as you have a working internet connection, run `pnpm dev` to get started!


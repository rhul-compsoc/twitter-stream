# twitter-stream v2

## Dependencies

Please make sure you have:

-   [node](https://nodejs.org/en/)
-   [pnpm](https://pnpm.io/)

And have run `pnpm i` in the repo location

## Before running

Before developing please make sure you have an `.env.local` file in the repo home dir with the following keys

```env
AZURE_AD_CLIENT_SECRET='asdf'
AZURE_AD_CLIENT_ID='asdf'
AZURE_AD_TENANT_ID='asdf'
NEXTAUTH_URL='asdf'
NEXTAUTH_SECRET='asdf'
TWITTER_API_BEARER='asdf'
```

-   You can find the azure information [here](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/24eb9f6b-b7e5-4bb0-83dd-9f54da283fc4/isMSAApp~/false)
-   And dm me on discord (chazzox#1001) so i can provide you the twitter api key (we have to regen everytime you want access)

If you are creating a new theme, please name the branch `theme-[name_of_theme]`, this way we know what each branch is for!

## Running

Then, as long as you have a working internet connection, run `pnpm dev` to get started!

# WarcraftLogs Death Report

This tool provides a death report for an entire tier as a single pane of glass for guildmasters and recruiters
to see how often a player contributes to the first x deaths of a pull.

Use this as another tool in your arsenal of evaluating players.

## Usage

`npm run start guild <guildId>` - This will get death reports for the `ZONE_ID` and `DIFFICULTY` set in the `.env` file for all the guild reports of the provided guild ID. This will only get logs that are uploaded to a guild report. If you are using personal logs, this will NOT work. You can get your `guildId` from the warcraftlogs.com website. For example, here is [God I Miss Her - Mal'Ganis](https://www.warcraftlogs.com/guild/id/571322). NOTE: the guild ID is 571322 based on the URL of the guild in Warcraft Logs. An example of how to run this command: `npm run start guild 571322`

`npm run start character <name> <server> <region>` - This will get death reports for the `ZONE_ID` and `DIFFICULTY` set in the `.env` file for the provided character. `server` must not use any special characters. `region` must be one of `us`, `eu`, `tw`, `kr`, OR `cn`. For example: `npm run start character Yugopriest malganis us`.

**NOTE**: After running the app the first time, you should see a `.token.json` get created. This holds your secret token for interacting with the Warcraft Logs API. **DO NOT** share this with anyone!

### Set the .env file

I'd personally start by just renaming `.env.example` to `.env`. This will use the default settings of the app.

You will need to obtain an API key from https://www.warcraftlogs.com/api/clients/
. This is free to do once you have a Warcraft Logs account. Change the `CLIENT_ID` and `CLIENT_SECRET` values of the `.env` file to reflect the values you got from when you created the Warcraft Logs API client. **DO NOT** share these keys with anyone!

The default settings of the app are to check for Mythic logs only (difficulty = 5), in Manaforge Omega (zoneId = 44), with a wipe cut off of 3 deaths (wipeCutoff = 3). You are welcome to change any of these values by editing the `.env` file. If the app is a little to noisy for your terminal window, you can likewise set `DEBUG` to `"false"` or just remove that line entirely.

#### Windows

I only ran this on [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install), so I can't really help you if you have trouble running in powershell, but here's some steps for Windows anyway. I'll assume that if you're using this path, you probably don't have nvm/npm/Node installed

1. Download and install `nvm-setup.exe` from [nvm-windows](https://github.com/coreybutler/nvm-windows/releases). Don't bother with the end option to "open powershell with nvm". It doesn't work.
2. Open powershell (win+s, type "powershell", press enter)
3. enter the command `nvm install 24`
    1. This will install the latest NodeJS v24
4. enter the command `nvm use 24`
    1. This will tell the system to use this version of nodeJS when running the program
    2. You will have to run this command each time you start up powershell to run this app
5. enter the command `Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser`
    1. This lets us run the untrusted (by Windows) script on a non-admin powershell
    2. You will have to run this command each time you start up powershell to run this app
6. make sure you're in the correct folder where you downloaded/extracted the WCL-DeathReport code. For example: `cd C:\Users\ps818\Downloads\WCL-DeathReport`
7. build the app: `npm run build`
8. run the app: `npm run start <command> <...args>`

#### Linux/Mac

1. Install [nvm](https://github.com/nvm-sh/nvm): `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash`
2. Go to the folder where you downloaded the file. For example: `cd /mnt/c/Users/ps818/Downloads/WCL-DeathReport`
3. install Node v24 if you don't already have it (note the `.nvmrc` file included in the repo): `nvm install`
4. use Node v24: `nvm use`
5. build the app: `npm run build`
6. run the app: `npm run start <command> <...args>`

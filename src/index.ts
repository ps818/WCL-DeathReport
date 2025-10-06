import { CommandsRegistry, handlerCharacter, handlerGuild, registerCommand, runCommand } from "./commands.js";


async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log("usage: cli <command> [args...]");
        process.exit(1);
    }
    const [cmdName, ...cmdArgs] = args;
    const registry: CommandsRegistry = {};

    registerCommand(registry, "guild", handlerGuild);
    registerCommand(registry, "character", handlerCharacter);

    try {
        await runCommand(registry, cmdName, ...cmdArgs);
    } catch (e: any) {
        console.error(e.message || String(e));
        process.exit(1);
    }
    process.exit(0);
}

main();
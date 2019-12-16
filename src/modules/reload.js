const { join } = require("path");

module.exports = {
    name: "reload",
    description: "Reload a command within the bot process",
    args: true,
    aliases: ["rl"],
    cooldown: 5,
    adminOnly: true,
    execute(message, args, client, logger) {
        const module = message.client.commands.get(args[0]) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

        if(!module) message.channel.send("That module couldn't be found.");

        delete require.cache[require.resolve(`./${module.name}.js`)];
        message.client.commands.delete(module.name);

        const cmd = require(join(__dirname, `${module.name}.js`));
        message.client.commands.set(cmd.name, cmd);
        message.channel.send(`Successfully reloaded \`${module.name}\`${args[0] != module.name ? " (`" + args[0] + "`)" : ""}.`);
    }
}
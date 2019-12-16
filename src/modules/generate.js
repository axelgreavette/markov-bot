const Chain = require("./../helper/Chain");

module.exports = {
    name: "generate",
    description: "Generates a sample message for the specified user using the given channel as a base.",
    usage: "<?channel> <?user>",
    aliases: ["markov", "gen", "markov-gen"],
    cooldown: 5,
    async execute(message, args) {
        const original = await message.channel.send("*Generating...*");

        let chanIndex = args.findIndex(val => /\<#\d+\>/.test(val));
        let userIndex = args.findIndex(val => /\<@!*\d+\>|./.test(val));

        let channel = args[chanIndex] ? message.guild.channels.get(args[chanIndex].replace("<#", "").replace(">", "")) : message.channel;
        let user = args[userIndex] ? findMember(message, args[userIndex], true) : message.member;
        
        let messages1 = await channel.fetchMessages({ limit: 100 });
        let messages2 = await channel.fetchMessages({ limit: 100, before: messages1.lastKey() });
        let messages3 = await channel.fetchMessages({ limit: 100, before: messages2.lastKey() });
        let messages4 = await channel.fetchMessages({ limit: 100, before: messages3.lastKey() });
        let messages5 = await channel.fetchMessages({ limit: 100, before: messages4.lastKey() });
        let messages6 = await channel.fetchMessages({ limit: 100, before: messages5.lastKey() });
        let messages7 = await channel.fetchMessages({ limit: 100, before: messages6.lastKey() });
        let messages8 = await channel.fetchMessages({ limit: 100, before: messages7.lastKey() });
        await original.edit(`*Received a raw total of ${messages1.size + messages2.size + messages3.size + messages4.size + messages5.size + messages6.size + messages7.size + messages8.size} messages...*`);

        messages1 = messages1.filter(m => m.author.id === user.id);
        messages2 = messages2.filter(m => m.author.id === user.id);
        messages3 = messages3.filter(m => m.author.id === user.id);
        messages4 = messages4.filter(m => m.author.id === user.id);
        messages1 = messages5.filter(m => m.author.id === user.id);
        messages2 = messages6.filter(m => m.author.id === user.id);
        messages3 = messages7.filter(m => m.author.id === user.id);
        messages4 = messages8.filter(m => m.author.id === user.id);
        await original.edit(`*Filtered to ${messages1.size + messages2.size + messages3.size + messages4.size + messages5.size + messages6.size + messages7.size + messages8.size} messages...*`);

        let messages = messages1.array().join(". ") + ". " + messages2.array().join(". ") + ". " + messages3.array().join(". ") + ". " + messages4.array().join(". ") + ". " + messages5.array().join(". ") + ". " + messages6.array().join(". ") + ". " + messages7.array().join(". ") + ". " + messages8.array().join(". ") + ". ";

        let generator = new Chain({ source: messages });

        original.edit(`> ${generator.generate()}\n*Generated from ~${messages.split(". ").length} of ${user.displayName}'s messages in ${channel}*`);
    }
}

function findMember(msg, suffix, self = false) {
    if (!suffix) {
        if (self) return msg.member;
        else return null;
    } else {
        let member = msg.mentions.members.first() || msg.guild.members.get(suffix) || msg.guild.members.find(m => m.displayName.toLowerCase().includes(suffix.toLowerCase()) || m.user.username.toLowerCase().includes(suffix.toLowerCase()));
        return member;
    }
}
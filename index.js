const { Client, WebhookClient, Intents, MessageEmbed } = require("discord.js");

const webhookClient = new WebhookClient({
	url: "your webhook url",
});
const client = new Client({ intents: new Intents(33313) });

let lastNumber = 0;
let nextNumber = lastNumber + 1;
let lastUser = null;

client.on("ready", () => {
	client.user.setActivity({ type: "WATCHING", name: `No one: ${lastNumber}` });
	console.log(`${client.user.tag} is ready!`);
});

client.on("messageCreate", (message) => {
	if (message.author.bot) return;
	if (message.channel.id != "991653263587942481") return;

	if (message.author.id == lastUser) {
		const embed = new MessageEmbed()
			.setColor("RED")
			.setDescription(`Nu poti numara de mai multe ori la rand.`)
			.setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();
		return message
			.reply({ embeds: [embed] })
			.then((msg) => {
				setTimeout(() => {
					msg.delete().catch((err) => {});
					message.delete().catch((err) => {});
				}, 5000);
			})
			.catch((err) => {});
	}

	const curNumber = Math.floor(message.content);

	if (isNaN(message.content) || curNumber != nextNumber) {
		const embed = new MessageEmbed()
			.setColor("RED")
			.setDescription(`Urmatorul numar este **${nextNumber}**.`)
			.setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();
		return message
			.reply({ embeds: [embed] })
			.then((msg) => {
				setTimeout(() => {
					msg.delete().catch((err) => {});
					message.delete().catch((err) => {});
				}, 5000);
			})
			.catch((err) => {});
	}

	lastNumber++;
	nextNumber = lastNumber + 1;
	lastUser = message.author.id;

	client.user.setActivity({ type: "WATCHING", name: `${message.author.username}: ${curNumber}` });

	message
		.delete()
		.then((msg) => {
			webhookClient.send({
				content: curNumber.toString(),
				username: msg.author.username,
				avatarURL: msg.author.avatarURL(),
			});
		})
		.catch((err) => {});
});

require("dotenv").config();
client.login(process.env.TOKEN);

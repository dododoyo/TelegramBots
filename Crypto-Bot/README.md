# crypto-bot

# How to create custom keyboards in Telegram ?

## Types of Custom Keyboards

1. Reply keyboard: This is a basic keyboard that appears right above the chat interface. It allows users to quickly select one of the predefined options. You can create a reply keyboard by sending a message with the `reply_markup` parameter set to a JSON-serialized object that describes the keyboard.

2. Inline keyboard: This type of keyboard appears right above the chat interface as well, but it's more flexible than the reply keyboard. It allows you to add buttons that can trigger different actions, such as opening a URL or sending a callback query to your bot. You can create an inline keyboard by sending a message with the `reply_markup` parameter set to a JSON-serialized object that describes the keyboard.

3. Reply keyboard markup: This is similar to the reply keyboard, but it allows you to customize the appearance of the buttons. You can set the background color, text color, and other properties of each button. You can create a reply keyboard markup by sending a message with the `reply_markup` parameter set to a JSON-serialized object that describes the keyboard.

4. Force reply: This is a special type of keyboard that forces the user to reply to your message. When the user taps on the input field, the keyboard appears automatically. You can create a force reply keyboard by sending a message with the `reply_markup` parameter set to a JSON-serialized object that describes the keyboard and the `force_reply` parameter set to `true`.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run bot.js
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

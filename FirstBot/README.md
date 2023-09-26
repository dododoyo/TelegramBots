 # Telegraf.js(3.x) Notes

## Get started with Telegram bot using `telegraf.js`:

1. First, you'll need to create a Telegram account if you don't already have one. You can do this by downloading the Telegram app on your phone or by visiting the Telegram website.

2. Once you have a Telegram account, you'll need to create a new bot. To do this, you'll need to talk to the [BotFather](https://t.me/botfather), which is a Telegram bot that helps you create and manage other bots. You can find the BotFather by searching for "@BotFather" in the Telegram app or by visiting the BotFather website.

3. When you talk to the BotFather, type "/newbot" to create a new bot. Follow the prompts to choose a name and username for your bot. Once you've created your bot, the BotFather will give you a token that you'll need to use to authenticate your bot.

4. Now that you have a bot token, you can start building your bot using `telegraf.js`. To get started, you'll need to install `telegraf` using npm. Open your terminal and run the following command:

```
npm install telegraf
```

5. Once you've installed `telegraf`, you can start building your bot. Here's some sample code to get you started:
   

> Replace `YOUR_TELEGRAM_BOT_TOKEN` with the token you received from the BotFather.

```javascript
const Telegraf = require('telegraf');
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

bot.start((ctx) => {
  ctx.reply('Hello! Welcome to my bot.');
});

bot.launch();
```

6. Save the code to a file called `bot.js` (or any other name you prefer). Then, run the following command in your terminal to start your bot:

```
node bot.js
```

7. Now that your bot is running, you can test it out by sending a message to your bot on Telegram. Type "/start" to start the bot and "/help" to see the available commands.

That's it! You've now created a Telegram bot using `telegraf.js`. From here, you can continue to build out your bot by adding more commands and functionality.

### Common Commands

- `/start`: This command is usually used to greet the user and provide some basic information about the bot.
- `/help`: This command is used to provide help and support to the user.
- `/settings`: This command is used to provide settings options to the user.
- `/stop`: This command is used to stop the bot from sending messages to the user.
- `/cancel`: This command is used to cancel the current operation or action.
- `/feedback`: This command is used to provide feedback to the bot developer.
  
Here's some sample code for each command using the `telegraf.js` library:

> Note that you'll need to replace `YOUR_TELEGRAM_BOT_TOKEN` with your actual bot token.


```javascript
const Telegraf = require('telegraf');
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

// /start command
bot.start((ctx) => {
  ctx.reply('Welcome to my bot! Type /help to see the available commands.');
});

// /help command
bot.help((ctx) => {
  ctx.reply('Here are the available commands:\n/start - Start the bot\n/help - Show this help message\n/settings - Change bot settings\n/stop - Stop the bot\n/cancel - Cancel the current operation\n/feedback - Provide feedback to the bot developer');
});

// /settings command
bot.command('settings', (ctx) => {
  ctx.reply('Here are the available settings:\nOption 1\nOption 2\nOption 3');
});

// /stop command
bot.command('stop', (ctx) => {
  ctx.reply('Bot stopped. Type /start to start the bot again.');
});

// /cancel command
bot.command('cancel', (ctx) => {
  ctx.reply('Operation cancelled.');
});

// /feedback command
bot.command('feedback', (ctx) => {
  ctx.reply('Please provide your feedback:');
});

bot.launch();
```


## `ctx`

`ctx` stands for "context" and it's an object that contains information about the current message and the user who sent it. Think of it like a messenger who delivers a message to you, but also tells you who sent it and some other details about it.

For example, when someone sends a message to your bot, `ctx` contains information like the message text, the sender's username, and the chat ID (which is a unique identifier for the chat the message was sent in).

You can use `ctx` to access this information and perform actions based on it. For example, you can use `ctx.reply()` to send a message back to the user who sent the original message.

In the code you provided, `ctx.reply()` is used to send a message back to the user with the specified text. The `ctx` object is passed as a parameter to the function, so that the function can access the message information and send a reply back to the user.

Most commonly used properties of the `ctx` object include:

- `ctx.from`: An object that contains information about the user who sent the message, such as their username, first name, and last name.

- `ctx.chat`: An object that contains information about the chat where the message was sent, such as the chat ID and type (e.g. group chat or private chat).

- `ctx.message`: An object that contains information about the message that was sent, such as the message ID, text, and date.




<br>

>  ***How can i added custom commands besides the default ones ?***

##  `command` method

In the Telegraf library, the `command` method of the bot is used to handle commands that start with a slash (`/`). (i.e create your own custom commands.)

The `command` method takes two parameters:

1. The command name: a string that starts with a slash (`/`) and represents the name of the command.
2. The command handler function: a function that will be called when the command is received by the bot.

Here's an example of how to use the `command` method:

```javascript
bot.command('/start', (ctx) => {
  ctx.reply('Hello, world!');
});
```

You can define as many command handlers as you need, and each one will be called when the corresponding command is received by the bot.
For example, if the user sends the command `/start`, the bot can handle it using the `command` method like this:

```javascript
bot.command('start', (ctx) => {
  ctx.reply('Welcome to my bot!');
});
```

You can also use an array of strings for the first argument of the command method.
```javascript
bot.command(['start','Start','START'], (ctx) => {
  ctx.reply('Welcome to my bot!');
});
```

This code will send a reply message to the user with the text "Welcome to my bot!" when the user sends the `/start`, `/Start`, or `/START`command.

> You can use the `command` method to handle any command that starts with a slash (`/`).

To access the arguments in your code, you can use the `ctx.message.text` property to get the entire message text, and then parse it to extract the arguments. Here's an example:

```javascript
bot.command('greet', (ctx) => {
  const args = ctx.message.text.split(' ');
  const name = args[1];
  ctx.reply(`Hello, ${name}!`);
});
```

In this example, we split the message text by spaces to get an array of arguments, and then use the second argument as the name to greet. Note that we start counting arguments from index 1, because index 0 contains the command name.

So if the user types `/greet John`, the bot will reply with "Hello, John!".

### A telegram bot rarely has a single command example with multiple command handlers:

```javascript

bot.command('/help', (ctx) => {
  ctx.reply('Here are some commands you can use:\n/greet - say hello\n/joke - tell a joke');
});

bot.command('/greet', (ctx) => {
  ctx.reply('Hello, world!');
});

bot.command('/joke', (ctx) => {
  ctx.reply('Why did the chicken cross the road? To get to the other side!');
});

bot.launch();
```

> Note that we also have a `/help` command that lists all the available commands. This is generally the case for most  `/help` commands and can be useful for users who are not familiar with the bot's functionality.

##  `hears` method

The `hears` method in Telegraf.js is used to handle messages that match a certain pattern. It takes two parameters:

1. The pattern to match: a string, regular expression, or array of strings/regular expressions that the message text should match.
2. The message handler function: a function that will be called when a message matching the pattern is received by the bot.

Here's an example of how to use the `hears` method:

```javascript
bot.hears('hello', (ctx) => {
  ctx.reply('Hi there!');
});
```

In this example, we're defining a message handler function that will be called when the bot receives a message containing the word "hello". The function takes a single parameter `ctx`, which is the context object that contains information about the message and the user who sent it.

You can define as many message handlers as you need, and each one will be called when a message matching the corresponding pattern is received by the bot.

##  `on` method

The `on` method in Telegraf.js is used to handle events that are not related to specific commands or messages. It takes two parameters:

1. The updateType: a string that represents the name of the event to handle.
2. The event handler function: a function that will be called when the event is triggered.

> What is updateType
> 
In Telegraf.js, update types are events that are triggered when the bot receives a specific type of update from the user. Some examples of update types include `text`, `sticker`, `photo`, `audio`, `video`, `voice`, `location`, `contact`, `document`, `animation`, `game`, `poll`, `venue`, `invoice`, `successful_payment`, and `callback_query`.

[More Info about UpdateTypes](https://telegrafjs.org/#/?id=update-types)

Here's an example of how to use the `bot.on()` method:

- `text`: This event is triggered when the bot receives a text message from the user.
- `sticker`: This event is triggered when the bot receives a sticker from the user.
- `photo`: This event is triggered when the bot receives a photo from the user.
- `location`: This event is triggered when the bot receives a location message from the user.
- `contact`: This event is triggered when the bot receives a contact message from the user.

Here's an example of how to handle the `text` event:

```javascript
bot.on('text', (ctx) => {
  const text = ctx.message.text;
  ctx.reply(`You said: ${text}`);
});
```

In this example, we're defining an event handler function that will be called when the bot receives a text message from the user. The function takes a single parameter `ctx`, which is the context object that contains information about the message and the user who sent it.

Inside the function, we're getting the text of the message from the `message` object in the context, and then sending a reply message back to the user with the same text.

## `entity` method

The `bot.entity` method in the `telegraf` library is used to extract entities from a message. **Entities are special pieces of text in a message that represent things like usernames(mentions), hashtags,phones or URLs.** For example, if a user sends a message that contains a hashtag like "#programming", the `bot.entity` method can be used to extract the hashtag from the message.

The `bot.entity` method takes two arguments: the type of entity to extract *(e.g. "mention" for usernames, "hashtag" for hashtags)*, and a callback function that will be executed when the entity is found. The callback function will be passed an object that contains information about the entity, such as its offset in the message text and its length.

Here's an example of how the `bot.entity` method could be used to extract hashtags from a message:

```javascript

bot.entity("hashtag", (ctx) => {
  const userText = ctx.message.text;
  /**
   * This variable `entities` is assigned the value of `ctx.message.entities`.
   * It is used to store the entities of a message received by the Telegram bot.
   * @type {Array<Object>}
   */
  const entities = ctx.message.entities;

  // print each hashtag 
  entities.forEach((entity) => {
    console.log(userText.slice(entity.offset,entity.offset + entity.length));
  })
  // other code to handle the hashtag
});

```

In this example, the `bot.entity` method is called with the "hashtag" type and a callback function that logs each hashtag to the console. When the user sends a message that contains a hashtag, the `bot.entity` method will extract the hashtag and pass it to the callback function.

Overall, the `bot.entity` method can be a useful tool for extracting specific pieces of information from a message, such as usernames, hashtags, or URLs.

## MiddleWare Functions 

In `telegraf.js`, middleware functions are used to add extra functionality to the bot. Middleware functions are functions that take three arguments: `ctx`, `next`, and `...args`. 

The `ctx` argument is an object that contains information about the current update, such as the message text, chat ID, and user ID. 

The `next` argument is a function that is used to continue processing the update after the middleware function has finished. 

The `...args` argument is an array of additional arguments that can be passed to the middleware function.

Middleware functions can be used to perform a wide variety of tasks, such as logging information about each update, checking if a user is authorized to perform a certain action, or modifying the update before it is processed by other parts of the bot.

For example, here's a simple middleware function that logs information about each update:

```javascript
bot.use((ctx, next) => {
  next();
});
```

In this example, the middleware function logs information about each update to the console using `console.log`. The `next` function is then called to continue processing the update.

***What is the difference between Middleware functions and callback functions ?***

Middleware functions and callback functions are both used in JavaScript to add extra functionality to code, but they serve different purposes.

**A callback function** is a function that is passed as an argument to another function and is executed when a certain event occurs or when a certain condition is met. Callback functions are often used in asynchronous programming to handle the results of an asynchronous operation, such as a network request or a database query.

**Middleware functions,** on the other hand, are functions that are executed in between other functions or processes. Middleware functions are often used in web development to add extra functionality to a web application, such as logging, authentication, or error handling.

## next()

In `telegraf.js`, the `next` function is used to pass control to the next middleware function in the sequence. Middleware functions are functions that are executed in a sequence, and each function can modify the `ctx` object before passing control to the next function. 

When a middleware function is executed, it can either send a response to the user or pass control to the next middleware function in the sequence. If the middleware function sends a response to the user, it should not call the `next` function, as there is no need to execute any further middleware functions. 

However, if the middleware function does not send a response to the user, pr if there is a need for additional processing it should call the `next` function to ensure that control is passed to the next middleware function in the sequence.


Here's an example to illustrate the purpose of the `next` function:

```javascript
bot.on('text', (ctx, next) => {
  // Do some processing
  if (ctx.message.text === 'hello') {
    ctx.reply('Hi there!');
  } else {
    // Pass control to the next middleware function
    next();
  }
});

bot.on('text', (ctx) => {
  // Do some processing
  ctx.reply('I did not understand what you said.');
});
```

In this example, there are two middleware functions registered to handle the `text` event. The first middleware function checks if the user sent the message "hello". If the message is "hello", the middleware function sends a reply to the user with the message "Hi there!". If the message is not "hello", the middleware function calls the `next` function to pass control to the next middleware function in the sequence.

The second middleware function is executed only if the first middleware function did not send a reply to the user. The second middleware function sends a reply to the user with the message "I did not understand what you said.".

By calling the `next` function in the first middleware function, we ensure that control is passed to the second middleware function if the message is not "hello". This allows us to create a sequence of middleware functions that can handle different scenarios and modify the `ctx` object before passing control to the next function.

## use method

In `telegraf.js`, the `use()` method is used to register middleware functions that can handle events triggered by the bot. Middleware functions are functions that are executed in a sequence, and each function can modify the `ctx` object before passing control to the next function.

> When is the use() method executed ?

The `use()` is executed whenever the user uses the bot it can be text message, sticker, image , anything not specific like on and entity.

The `use()` method takes one or more middleware functions as arguments and registers them to handle events triggered by the bot. When an event is triggered, the middleware functions are executed in the order they were registered, and each function can modify the `ctx` object before passing control to the next function.

Here's an example to illustrate the use of the `use()` method:

```javascript
bot.use((ctx, next) => {
  // Do some processing
  console.log('Middleware function 1');
  next();
});

bot.use((ctx, next) => {
  // Do some processing
  console.log('Middleware function 2');
  next();
});

bot.on('text', (ctx) => {
  // Do some processing
  console.log('Text event handler');
  ctx.reply('Hello!');
});

bot.launch();
```

In this example, there are two middleware functions registered using the `use()` method. The first middleware function logs the message "Middleware function 1" to the console and then calls the `next()` function to pass control to the next middleware function. The second middleware function logs the message "Middleware function 2" to the console and then calls the `next()` function to pass control to the next middleware function.

The `on()` method is used to register an event handler for the `text` event. When the `text` event is triggered, the event handler is executed, and the message "Text event handler" is logged to the console. The event handler also sends a reply to the user with the message "Hello!".

By using the `use()` method to register middleware functions, we can create a sequence of functions that can handle events triggered by the bot. Each middleware function can modify the `ctx` object before passing control to the next function, which allows us to create powerful and flexible bots.

# State
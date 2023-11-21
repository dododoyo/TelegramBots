 # Telegraf.js(4.x) Notes

### Creating a bot from telegram

1. First, you'll need to create a Telegram account if you don't already have one. You can do this by downloading the Telegram app on your phone,Telegram desktop app or by visiting the Telegram website.

2. Once you have a Telegram account, you'll need to create a new bot. To do this, you'll need to talk to the [BotFather](https://t.me/botfather), which is a Telegram bot that helps you create and manage other bots. You can find the BotFather by searching for "@BotFather" in the Telegram app or by visiting the BotFather website.

3. When you talk to the BotFather, type "/newbot" to create a new bot. Follow the prompts to choose a name and username for your bot. Once you've created your bot, the BotFather will give you a token that you'll need to use to authenticate your bot.


### Installing Telegraf

4. Now that you have a bot token, you can start building your bot using `telegraf.js`. To get started, you'll need to install `telegraf` using npm. Open your terminal and run the following command:

```
npm install telegraf
```

5. Once you've installed `telegraf`, you can start building your bot. Here's some sample code to get you started:


> Replace `YOUR_TELEGRAM_BOT_TOKEN` with the token you received from the BotFather.

```javascript
const Telegraf = require('telegraf');
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

bot.start(async (ctx) => {
  await ctx.reply('Hello! Welcome to my bot.');
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
- `/help`: This command is used to provide help and support to the user and provide information about the functions of the bot such us it's commands and features.
- `/stop`: This command is usually used to stop the bot from sending messages to the user.
- `/cancel`: This command is usually used to cancel the current operation or action.
- `/feedback`: This command is usually used to provide feedback to the bot developer.
  
Here's some sample code for each command using the `telegraf.js` library:

> Note that you'll need to replace `YOUR_TELEGRAM_BOT_TOKEN` with your actual bot token.


```javascript
const Telegraf = require('telegraf');
const bot = new Telegraf('YOUR_TELEGRAM_BOT_TOKEN');

// /start command
bot.start(async (ctx) => {
  await ctx.reply('Welcome to my bot! Type /help to see the available commands.');
});

// /help command
bot.help(async (ctx) => {
  await ctx.reply('Here are the available commands:\n/start - Start the bot\n/help - Show this help message\n/settings - Change bot settings\n/stop - Stop the bot\n/cancel - Cancel the current operation\n/feedback - Provide feedback to the bot developer');
});

// /settings command
bot.command('settings', async (ctx) => {
  await ctx.reply('Here are the available settings:\nOption 1\nOption 2\nOption 3');
});

// /stop command
bot.command('stop', async (ctx) => {
  await ctx.reply('Bot stopped. Type /start to start the bot again.');
});

bot.launch();
```


##  What is `ctx` ?

`ctx` stands for "context" and it's an object that contains information about the current message and the user who sent it. Think of it like a messenger who delivers a message to you, but also tells you who sent it and some other details about it.

For example, when someone sends a message to your bot, `ctx` contains information like the message text, the sender's username, and the chat ID (which is a unique identifier for the chat the message was sent in).

You can use `ctx` to access this information and perform actions based on it. For example, you can use `ctx.reply()` to send a message back to the user who sent the original message.

In the code you provided, `ctx.reply()` is used to send a message back to the user with the specified text. The `ctx` object is passed as a parameter to the function, so that the function can access the message information and send a reply back to the user.

Most commonly used properties of the `ctx` object include:

- `ctx.from`: An object that contains information about the user who sent the message, such as their username, first name, and last name.

- `ctx.chat`: An object that contains information about the chat where the message was sent, such as the chat ID and type (e.g. group chat or private chat).

- `ctx.message`: An object that contains information about the message that was sent, such as the message ID, text, and date.


### Why use ctx ?

While it is possible to use the `telegram.sendMessage` method to send messages directly, using the `ctx` object provides several advantages:

1. **Access to context information:** The `ctx` object contains information about the user, the message, and the chat, which can be useful for creating more complex and personalized bots. For example, you might use the `ctx` object to access the user's name, ID, or language preferences.

2. **Middleware architecture:** `telegraf.js` uses a middleware architecture that allows you to create a sequence of functions that can handle events triggered by the bot. Each middleware function can modify the `ctx` object before passing control to the next function, which allows you to create powerful and flexible bots.

3. **Built-in methods:** The `ctx` object provides several built-in methods for sending messages, editing messages, and interacting with the Telegram API. These methods are designed to work seamlessly with the middleware architecture and provide a convenient and consistent way to interact with the Telegram API.they are a from of a shortcut.

<center>

| ctx shortcut | longer version|
| :------------: | :-------------: |
|addStickerToSet	|telegram.addStickerToSet |
|deleteMessage	|telegram.deleteMessage|
|forwardMessage	|telegram.forwardMessage|
| leaveChat |	telegram.leaveChat|
| reply |	telegram.sendMessage|
| replyWithAudio |	telegram.sendAudio|

</center>

### Shortcuts usage example 

```javascript
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('quit', (ctx) => {
  // Explicit usage
  bot.telegram.leaveChat(ctx.message.chat.id)

  // Using context shortcut
  ctx.leaveChat()
})

bot.on('text', (ctx) => {
  // Explicit usage
  bot.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  ctx.reply(`Hello ${ctx.state.role}`)
})

bot.on('callback_query', (ctx) => {
  // Explicit usage
  bot.telegram.answerCbQuery(ctx.callbackQuery.id)

  // Using context shortcut
  ctx.answerCbQuery()
})

bot.on('inline_query', (ctx) => {
  const result = []
  // Explicit usage
  bot.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

  // Using context shortcut
  ctx.answerInlineQuery(result)
})

bot.launch()
```

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

bot.command('help', (ctx) => {
  ctx.reply('Here are some commands you can use:\n/greet - say hello\n/joke - tell a joke');
});

bot.command('greet', (ctx) => {
  ctx.reply('Hello, world!');
});

bot.command('joke', (ctx) => {
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

> ***Related to entity***  [mention,](https://telegrafjs.org/#/?id=mention)
[phone,](https://telegrafjs.org/#/?id=phone)
[hashtag](https://telegrafjs.org/#/?id=hashtag)

## MiddleWare Functions 

In `telegraf.js`, middleware functions are used to add extra functionality to the bot. Middleware functions are functions that take three arguments: `ctx`, `next`, and `...args`. 

The `ctx` argument is an object that contains information about the current update, such as the message text, chat ID, and user ID. 

The `next` argument is a function that is used to continue processing the update after the middleware function has finished. 

The `...args` argument is an array of additional arguments that can be passed to the middleware function.

Middleware functions can be used to perform a wide variety of tasks, such as logging information about each update, checking if a user is authorized to perform a certain action, or modifying the update before it is processed by other parts of the bot.

For example, here's a simple middleware function that logs information about each update:

```javascript
bot.use((ctx, next) => {
  console.log(ctx.update);
  next();
});
```
In this example, the middleware function logs information about each update to the console using `console.log`. The `next` function is then called to continue processing the update.

***What is the difference between Middleware functions and callback functions ?***

Middleware functions and callback functions are both used in JavaScript to add extra functionality to code, but they serve different purposes.

**A callback function** is a function that is passed as an argument to another function and is executed when a certain event occurs or when a certain condition is met. Callback functions are often used in asynchronous programming to handle the results of an asynchronous operation, such as a network request or a database query.

**Middleware functions,** on the other hand, are functions that are executed in between other functions or processes. Middleware functions are often used in web development to add extra functionality to a web application, such as logging, authentication, or error handling.

## `next` method

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

## `use` method

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

> Note that while it is possible to access the modified `ctx.state` object without passing the `ctx` argument to the `next()` method, it is generally considered good practice to pass the `ctx` argument to ensure that the next middleware function has access to the full context object.

```javascript
next();
next(ctx);
// both serve the same purpose.
```

# [`state`](https://telegrafjs.org/#/?id=state)

In `telegraf.js`, the `ctx.state` object is a property of the context object (`ctx`) that is used to store and retrieve state data across multiple middleware functions. 

The `ctx.state` object is an empty object by default, but you can add properties to it to store data that needs to be shared across multiple middleware functions. For example, you might use the `ctx.state` object to store user-specific data that needs to be accessed by multiple middleware functions.

Here's an example to illustrate the use of the `ctx.state` object:

```javascript
bot.use((ctx, next) => {
  // Set a property on the ctx.state object
  ctx.state.user = {
    id: ctx.from.id,
    name: ctx.from.first_name,
    last_name: ctx.from.last_name
  };
  next();
});

bot.on('text', (ctx) => {
  // Access the property on the ctx.state object
  const user = ctx.state.user;
  ctx.reply(`Hello, ${user.name} ${user.last_name}!`);
});

bot.launch();
```

In this example, we use the `use()` method to register a middleware function that sets a property on the `ctx.state` object. The property is an object that contains information about the user who sent the message, such as their ID, first name, and last name.

We then use the `on()` method to register an event handler for the `text` event. The event handler accesses the property on the `ctx.state` object and sends a reply to the user with a personalized greeting.

By using the `ctx.state` object to store user-specific data, we can share this data across multiple middleware functions and create more complex and personalized bots.



### Handling Inline Queries

`bot.on("inline_query")` and `bot.inlineQuery` are two different ways to handle inline queries in the Telegram Bot API using the `telegraf` library.

`bot.on("inline_query")` is an event listener that listens for inline queries and executes a callback function when an inline query is received. This method allows you to handle inline queries in a more flexible way, as you can define your own logic for handling the query.

`bot.inlineQuery` is a method that sets a default callback function for handling inline queries. This method is simpler to use, as you only need to define the callback function once and it will be used for all inline queries. However, it is less flexible than using the event listener, as you cannot define custom logic for handling specific inline queries.

In summary, if you need more flexibility in handling inline queries, you should use `bot.on("inline_query")`. If you only need a simple way to handle all inline queries, you can use `bot.inlineQuery`.


# Composer

In Telegraf.js, `Composer` is a class that provides a way to group related bot commands and middleware together. It allows you to create a hierarchy of middleware and commands, which can be used to organize your bot's functionality and make it easier to maintain.

A `Composer` instance can be used to define a set of middleware functions and commands that will be executed in a specific order when a user interacts with your bot. Middleware functions can be used to perform tasks such as logging, error handling, and authentication, while commands are used to define the bot's functionality.

Generally speaking, Composer is middleware composition tool.All handlers and plugins for Telegraf are middleware, and we need some abstraction layer to simplify development. Thats why we have Composer as a first class citizen here, and compose method is core library functionality.

You can create multiple `Composer` instances to group related functionality together. **For example, you might create one `Composer` instance for handling user commands, and another for handling administrative commands**. You can then use the `use` method to add these `Composer` instances to your main bot instance, which will allow you to easily manage your bot's functionality.

Overall, `Composer` provides a way to organize and manage your bot's functionality, making it easier to maintain and extend over time. 

For example, you can make available some part of bot functionality only for selected users:

```Javascript
const {Telegraf,Composer} = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

var exampleBot = new Composer();
exampleBot.command("start", (ctx) => {});
exampleBot.command("get", (ctx) => {});

var adminBot = new Composer();
adminBot.command("delete", (ctx) => {});
adminBot.command("add", (ctx) => {});

// for admins only
bot.use(Composer.acl(['adminId1', 'adminId2'], adminBot));

// Composer.acl(['admin1','admin2'])Generates middleware responding only to specified users.

// for all users
bot.use(exampleBot);
```
In the code excerpt provided, two `Composer` instances are created: `exampleBot` and `adminBot`. These instances define a set of commands that will be executed when a user interacts with the bot. The `bot.use` method is then used to add an **access control list (ACL)** middleware to the main bot instance, which will restrict access to certain functionality to only specified users.

# Scenes and Stages

**What are Scenes and WizardScene, what are their purpose?**

Basic API of telegraf allows for implementation of simple interactions, such as:

command -> response or message -> response, trigger -> another response

While that is quite powerful and easy to use, there is a set of tasks, that require to create a **DIALOGUE** between user and the bot. That is where Scenes and WizardScenes fill in.

**What is a Scene, how does it work?**

In Telegraf.js, `Scenes` is a feature that allows you to create multi-step interactions with your bot.It is like a namespace, an abstract isolated room that user can be pushed into by means of code. When inside one, all the outer noise, such as global commands or message handlers, stop reacting on user actions.It provides a way to break down complex interactions into smaller, more manageable steps, making it easier for users to understand and use your bot.

A `Scene` is a set of related commands and middleware that are executed in a specific order. Each `Scene` represents a step in the interaction, and can be used to collect information from the user, perform actions, or display information.

When a user starts a `Scene`, the bot enters a "waiting" state, where it waits for the user to provide input. The bot can then use this input to determine the next step in the interaction, or to perform an action.

`Scenes` can be used to create a wide range of interactions, from simple forms to complex workflows. For example, you might use a `Scene` to collect information from a user, such as their name and email address, or to guide them through a multi-step process, such as booking a flight or ordering food.

To use `Scenes` in your bot, you first need to define a set of `Scene` instances, each representing a step in the interaction. You can then use the different type of scenes to manage the flow of the interaction, moving the user from one `Scene` to the next as they provide input.

Overall, `Scenes` provides a powerful way to create complex interactions with your bot, making it easier for users to understand and use your bot, and providing a more engaging and interactive experience.

Scenes can be entered, or left from, scenes can have their own hooks (command/message listeners), that only work while user is inside.

**What kind of Scenes are there, what's the difference?**

There are two types of Scenes,
- a more configurable `BaseScene`,
- a less configurable, Step-based `WizardScene`.

**How to create and use a BaseScene ?**

`BaseScene` is just an isolated namespace that needs manually attached hooks, here is an example:

```Javascript
import { Scenes } from 'telegraf';

,

scenarioTypeScene.action(MOVIE_ACTION, (ctx) => {
  ctx.reply('You choose movie, your loss');
  ctx.session.myData.preferenceType = 'Movie';
  return ctx.scene.leave(); // exit global namespace
});

scenarioTypeScene.leave((ctx) => {
  ctx.reply('Thank you for your time!');
});

// What to do if user entered a raw message or picked some other option?
scenarioTypeScene.use((ctx) => ctx.replyWithMarkdown('Please choose either Movie or Theater'));
```

**How to create and use a WizardScene ?**

WizardScene is a lot easier to use, it does not require any hooks, although it might have them.
WizardScene is created in via the following call
`const wizardScene = new WizardScene(wizardSceneId, ...stepHandlers);`

Context (ctx) inside wizardScene is enhanced with ctx.wizard field. That is step control interface, it has following fields:

`ctx.wizard.next()` - to advance to next step;

`ctx.wizard.back()` - to go back to previous step;

`ctx.wizard.cursor` - to get current step index;

`ctx.wizard.selectStep(index)` - to jump straight to a given step index, can be used to implement branching;

Normally each stepHandler, should end with ctx.wizard.next(); Once called, bot awaits for the next trigger from user, such as message or action, the result will be available in the next stepHandler.

If there was an error or ctx.wizard.next() was not called, current step is reentered and bot awaits for the next trigger from user. This can be used to implement validation

General Example:
```Javascript
import { Scenes } from 'telegraf';

const contactDataWizard = new Scenes.WizardScene(
  'CONTACT_DATA_WIZARD_SCENE_ID', // first argument is Scene_ID, same as for BaseScene
  (ctx) => {
    ctx.reply('What is your name?');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    if (ctx.message.text.length < 2) {
      ctx.reply('Please enter name for real');
      return; 
    }
    ctx.wizard.state.contactData.fio = ctx.message.text;
    ctx.reply('Enter your e-mail');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.contactData.email = ctx.message.text;
    ctx.reply('Thank you for your replies, we'll contact your soon');
    await mySendContactDataMomentBeforeErase(ctx.wizard.state.contactData);
    return ctx.scene.leave();
  },
);
```

Specific Example:
```javascript
const { Telegraf, session, Scenes, Composer } = require("telegraf");
const { message } = require("telegraf/filters");
const bot = new Telegraf(process.env.TEST_BOT_TOKEN);
bot.use(session());

const nameWizard = new Scenes.WizardScene(
  "name-wizard",
  async (ctx) => {
    await ctx.reply("What is your name?");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const name = ctx.message.text;
    if (!name) {
      await ctx.reply("Please enter a valid name.");
      return;
    }
    ctx.session.name = name;
    await ctx.reply(`Hello, ${name}! How old are you?`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    const age = parseInt(ctx.message.text);
    if (isNaN(age)) {
      await ctx.reply("Please enter a valid age.");
      return;
    }
    ctx.session.age = age;
    await ctx.reply(`Thank you for providing your age, ${ctx.session.name}!`);
    return ctx.scene.leave();
  }
);
const stage = new Scenes.Stage([quizWizard, nameWizard]);
bot.use(stage.middleware());

// add wizard to stage
bot.command(["name", "Name"], (ctx) => ctx.scene.enter("name-wizard"));

bot.launch();
```

Is there a way to gain more control over stepHandlers
In fact there is. A step handler may be created as a Composer, this way you can attach multiple hooks to it, to have different response, based on the data.

**How are Scenes attached to telegraf bot?**

The foundational component of Scenes is a Stage,

```javascript
import { Scenes } from 'telegraf';
const stage = new Scenes.Stage([scene1, scene2, scene3, ...]);
bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.use(stage.middleware());
```

Stage itself is just there for the code sugar, you may think of it as a boilerplate to concatenate scenes into a middleware.

`MORE ON STAGES LATER`

**How to enter a scene (BaseScene or WizardScene) ?**

Entering a scene can be a little tricky if you do not pay attention, the following code can be found in the original example:

NOT RECOMMENDED:
```javascript
const stage = new Stage([scene1, scene2, ...], { default: 'CONTACT_DATA_WIZARD_SCENE_ID' });
```
this is a quite nasty way of entering scene. When default sceneId is provided as an option to Stage constructor, user automatically enters provided scene and there is no way of leaving scenes anymore. As soon as you call ctx.scene.leave(), you end up in the default scene.

CAUTION ADVISED:
```javascript
Stage.enter('CONTACT_DATA_WIZARD_SCENE_ID');
```
this piece of code looks good and it is valid, but when you try using it, it doesn't work. 

Why? Because you're probably using it as a function, but it is in fact a middleware factory! So instead of doing this:

```javascript
// BAD
bot.hears('hi', () => {
  Stage.enter('CONTACT_DATA_WIZARD_SCENE_ID');
});
```

```javascript
// ALSO BAD
bot.hears('hi', (ctx) => Stage.enter('CONTACT_DATA_WIZARD_SCENE_ID'));
```
You have to do this:
```javascript
// GOOD
bot.hears('hi', Stage.enter('CONTACT_DATA_WIZARD_SCENE_ID'));
```
Recommended
```javascript
ctx.scene.enter('CONTACT_DATA_WIZARD_SCENE_ID')
```
These are simple and reliable way of entering scenes. This code is not limited to the scope of current scene, it's available anywhere, once you enable stage.middleware(), global context is extended with ctx.scene, so you can freely use it anywhere in your application.

The same API (as 2 and 3) can be used to switch from one scene to another.

**How to persist data between Scenes ?**

The scope of the context object is only for the current command or action being handled which means it doesn’t pass from command to command or from step to step. We store the state in the context when we want to pass data between middlewares.but what can we do if we cant to pass data between command to command or scene to scene.

*`Answer: We use session, If your bot has been extended with session middleware, you can always read/write data via ctx.session field. If you choose this path, you are responsible for initializing and cleaning up your session data.`*

If you are using WizardScene there is another option:

```javascript
`ctx.wizard.state`
// or 
`ctx.scene.state`
```
Actually these fields are almost identical, as they point to the same data object:
`ctx.wizard.state` -> `ctx.scene.state` -> `ctx.session.state`
The only difference is - first two automatically resolve to {}.

If you follow this path, you don't have to clean the data, as it is cleaned up automatically once you leave a scene or enter a new one.

If you combine BaseScenes with WizardScenes, state will be erased upon switching from one scene to another, but there is still a way:

You can pass state to another scene via second argument to `ctx.scene.enter(sceneId, initialState)`. So if you use `ctx.state`, you can call `ctx.scene.enter('MY_SCENE_ID', ctx.scene.state)`, and your state will be written into state of new scene.


I would like to share my enhancement of WizardScene mechanics, that allows for better code due to higher responsibility separation.

**List of issues:**

Allow complicated branching for scenes;
Allow to 'await' scene ending to execute some code;
Have a separate single place for branching code;
Make scenes reusable in same/different scenarios;
Allow defining scenes or steps in a separate files;
Provide a better alternative to step switching than by stepIndex (which is not safe);
How do we overcome all these issues? With a factory of course.
Here's the code for SceneFactory. It's not perfect and does not claim to be a library.

```javascript
import WizardScene from 'telegraf/scenes/wizard';

const unwrapCallback = async (ctx, nextScene) => {
  const nextSceneId = await Promise.resolve(nextScene(ctx));
  if (nextSceneId) return ctx.scene.enter(nextSceneId, ctx.scene.state);
  return ctx.scene.leave();
};

/**
 * Takes steps as arguments and returns a sceneFactory
 *
 * Additionally does the following things:
 * 1. Makes sure next step only triggers on `message` or `callbackQuery`
 * 2. Passes second argument - doneCallback to each step to be called when scene is finished
 */
export const composeWizardScene = (...advancedSteps) => (
  /**
   * Branching extension enabled sceneFactory
   * @param sceneType {string}
   * @param nextScene {function} - async func that returns nextSceneType
   */
  function createWizardScene(sceneType, nextScene) {
    return new WizardScene(
      sceneType,
      ...advancedSteps.map((stepFn) => async (ctx, next) => {
        /** ignore user action if it is neither message, nor callbackQuery */
        if (!ctx.message && !ctx.callbackQuery) return undefined;
        return stepFn(ctx, () => unwrapCallback(ctx, nextScene), next);
      }),
    );
  }
);
```

**How does it work, what does it do?**
Lets look at an example:

```javascript
// scenes/contactData.js
import { composeWizardScene } from '../../utils/sceneFactory';

export const createContactDataScene = composeWizardScene(
  (ctx) => {
    ctx.reply('Please enter your credentials');
    return ctx.wizard.next();
  },
  (ctx, done) => {
    ctx.wizard.state.credentials = ctx.message.text;
    return done();
  },
);
```

In the above example, we created a sceneFactory, using nearly same interface as WizardScene, the amount of steps can be larger, for simplicity I only put 2.

So what are the differences:

We did not define a sceneId (or sceneType as I call it);
There is a new done function-argument in call to each step (instead of next);
Not impressed? Wait till we see how it works on the stage;

```javascript
// reportStageWizard.js
import { createEntryScene } from '../scenes/entryData';
import { createContactDataScene } from '../scenes/contactData';
import { createOrderDataScene } from '../scenes/orderData';
import { createActionTimeScene } from '../scenes/actionTimeScene';
import { ENTRY_SCENE, CONTACT_DATA_SCENE, ORDER_DATA_SCENE, ACTION_TIME_SCENE } from '../scenes/sceneTypes';

const bot = new Composer();

const stage = new Stage([
  // the following line defines ENTRY_SCENE, when scenario finishes, depending on hasCreds flag, it either switches to CONTACT_DATA_SCENE, or skips it to go straight for ORDER_DATA_SCENE
  createEntryScene(ENTRY_SCENE, (ctx) => (ctx.session.hasCreds ? ORDER_DATA_SCENE : CONTACT_DATA_SCENE)),
  // simple linear scenario, switch scenes one by one
  createContactDataScene(CONTACT_DATA_SCENE, () => ORDER_DATA_SCENE),
  createOrderDataScene(ORDER_DATA_SCENE, () => ACTION_TIME_SCENE),
  // once done, we send the data, gathered during scenario and leave scene
  createActionTimeScene(ACTION_TIME_SCENE, async (ctx) => {
    const { fio, date, time, clientName, actionType } = ctx.wizard.state;
    await sendReport({ date, time, clientName, actionType, fio, payment: '?' });
    await ctx.reply('Thank you for your report');
  }),
]);

bot.use(stage.middleware());
bot.command('test', Stage.enter(ENTRY_SCENE));

```
Let me first explain how create***Scene works. It takes two arguments:
sceneType - is sceneId - a string identifier for the scene;
nextScene - is the wrapped done callback function that we call once scene finishes, current ctx is forced in its call. nextScene is used to control the flow of our stage, as it awaits for new sceneId to be returned. If that happens current ctx.wizard.state is automatically passed to ctx.scene.enter call. If it returns nullable value, then ctx.scene.leave() is called.

Now our stage actually has a meaning, it joins multiple scenes into a large scenario. And now we can split each scene logic into a separate file. Scene naming and branching is done in a single place, it can be both simple or complicated.

As an additional feature, I've added verification into each step - so that step function only fires if there was a message or callbackButton click from the user (does not fire if some old message got edited, etc.).


# Stage 

`Stage` is a feature that provides a way to manage multiple `Scenes` and control the flow of the conversation. It allows you to define a set of `Scenes` and manage the transitions between them, making it easier to create complex interactions with your bot.

`Stage` is built on top of the `Composer` and `Scene` classes, and provides a way to organize your bot's functionality into a set of related `Scenes`. You can define a set of `Scenes` and use the `Stage` middleware to manage the flow of the conversation, moving the user from one `Scene` to the next as they provide input.

`Stage` provides a number of features to help you manage the flow of the conversation, including the ability to define a default `Scene` to start with, the ability to handle cancel and help commands, and the ability to handle errors and fallbacks.

To use `Stage` in your bot, you first need to define a set of `Scene` instances, each representing a step in the interaction. You can then use the `Stage` middleware to manage the flow of the conversation, moving the user from one `Scene` to the next as they provide input.

Overall, `Stage` provides a powerful way to manage the flow of the conversation in your bot, making it easier to create complex interactions and provide a more engaging and interactive experience for your users.

## How can I define a default scene in Telegraf.js Stage?

In Telegraf.js, you can define a default scene in `Stage` by passing the `default` option when creating a new instance of `Stage`. The `default` option should be set to the name of the scene that you want to use as the default.

Here's an example of how to define a default scene in `Stage`:

```javascript
const { Telegraf, Stage, session } = require('telegraf')
const { BaseScene } = require('telegraf/scenes')

// Create a new scene
const myScene = new BaseScene('myScene')

// Define the scene's command handler
myScene.command('start', (ctx) => {
  ctx.reply('Welcome to my scene!')
})

// Create a new stage and add the scene to it
const stage = new Stage([myScene])

// Set the default scene to 'myScene'
stage.command('start', (ctx) => {
  ctx.scene.enter('myScene')
})
stage.hears('help', (ctx) => ctx.reply('Send me a message to get started!'))

// Create a new bot instance and use the stage middleware
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(session())
bot.use(stage.middleware())

// Start the bot
bot.launch()
```

In this example, the `myScene` scene is added to a new instance of `Stage`. The `stage.command` method is used to define a command handler that will be executed when the user sends the `/start` command. This command handler calls the `ctx.scene.enter` method to enter the `myScene` scene.

The `stage.hears` method is used to define a fallback handler that will be executed when the user sends a message that doesn't match any of the other handlers. In this case, the fallback handler sends a message telling the user to send a message to get started.

By setting the default scene to `myScene`, the bot will automatically enter this scene when the user sends the `/start` command.

[Good Reference](https://medium.com/@habib23me/handling-state-in-telegraf-explained-easily-d8d53a336c4c)
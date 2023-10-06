# search-bot

### Handling Inline Queries
---

`bot.on("inline_query")` and `bot.inlineQuery` are two different ways to handle inline queries in the Telegram Bot API using the `telegraf` library.

`bot.on("inline_query")` is an event listener that listens for inline queries and executes a callback function when an inline query is received. This method allows you to handle inline queries in a more flexible way, as you can define your own logic for handling the query.

`bot.inlineQuery` is a method that sets a default callback function for handling inline queries. This method is simpler to use, as you only need to define the callback function once and it will be used for all inline queries. However, it is less flexible than using the event listener, as you cannot define custom logic for handling specific inline queries.

In summary, if you need more flexibility in handling inline queries, you should use `bot.on("inline_query")`. If you only need a simple way to handle all inline queries, you can use `bot.inlineQuery`.
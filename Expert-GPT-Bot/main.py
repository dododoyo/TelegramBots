import csv
import os
import threading
from dotenv import load_dotenv
import telebot
# pyTelegramBotAPI version 4.14.0
import g4f,asyncio
import queue

# Create a queue to pass the sent_message object from the thinking_thread to the ai_thread
message_queue = queue.Queue()

async def ask_AI(question):
    try:
        response = await g4f.Provider.You.create_async(
            model=g4f.models.default.name,
            messages=[{"role": "user", "content": question}],
        )
        return response
    except Exception as e:
        print("Error :", e)

load_dotenv()

# Open and read the CSV file containing the prompts
with open('newPrompts.csv', 'r',encoding='utf-8') as file:
    reader = csv.reader(file)
    prompts_dict = {row[0]: row[1] for row in reader}

bot = telebot.TeleBot(os.getenv('BOT_TOKEN'))

@bot.message_handler(commands=['start'])
def send_menu(message):
    with open('welcome.gif','rb') as image_file:
        welcome_caption = """*Hello there, and Welcome. \nI generate different prompts for ChatGPT.* """
        bot.send_animation(message.chat.id,image_file,caption=welcome_caption,parse_mode='Markdown')
        # print(message.chat)
        print(f'User @{message.chat.username} connected.')
    # Create the menu as a markup object with each name as a button
    menu_markup = telebot.types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    for name in sorted(prompts_dict.keys()):
        name_button = telebot.types.KeyboardButton(name)
        menu_markup.add(name_button)

    # Send the menu to the user
    bot.send_message(message.chat.id, '*Select an expert to get started:*', reply_markup=menu_markup,parse_mode='Markdown')

def show_thinking(message):
    # Send a message to the user
    sent_message = bot.reply_to(message, 'Thinking')
    for i in range(5):
        thinkMessage = 'Thinking'
        for i in range(5):
            thinkMessage += ' . '
            bot.edit_message_text(thinkMessage, message.chat.id, sent_message.message_id)
    message_queue.put(sent_message)
    return sent_message;

# Define a handler function to handle user prompt selections
@bot.message_handler(func=lambda message: message.text in prompts_dict.keys())
def handle_prompt_selection(message):
    # Retrieve the prompt based on the user's name selection
    selected_prompt = '`' + prompts_dict[message.text] +'`'

    # Add 'Copy  Prompt' button bellow message

    bot.send_message(message.chat.id,'Prompt send to AI is')
    bot.reply_to(message,selected_prompt,parse_mode = 'Markdown')
    bot.send_message(message.chat.id,"My reply to your first request is");

    # # shows thinking... before sending response
    # bot.send_chat_action(message.chat.id, 'typing')
    # message_sent = show_thinking(message)
    # try:
    #     AIResponse = asyncio.run(ask_AI(selected_prompt))
    #     bot.send_chat_action(message.chat.id, 'typing')
    #     bot.edit_message_text(message_sent.chat.id,text=AIResponse, parse_mode='Markdown')
    # except Exception as e:
    #     print('An error ocurred ', end='')
    #     print(e)

    try:
        AIResponse = asyncio.run(ask_AI(selected_prompt))
        bot.send_chat_action(message.chat.id, 'typing')
        bot.reply_to(message, AIResponse, parse_mode='Markdown')
    except Exception as e:
        print('An error ocurred ', end='')
        print(e)

    print(f'User @{message.chat.username} | Selected: {message.text}')

# @bot.message_handler(func=lambda message: True)
# def handle_text(message):
#     bot.send_chat_action(message.chat.id, 'typing')
#     show_thinking(message);
#     bot.send_chat_action(message.chat.id, 'typing')
#     try:
#         AIResponse = asyncio.run(ask_AI(message.text))
#         bot.reply_to(message, AIResponse, parse_mode='Markdown')
#     except Exception as e:
#         print('An error ocurred ', end='')
#         print(e)

# @bot.message_handler(func=lambda message: True)
# def handle_text(message):
#     # shows thinking... before sending response
#     bot.send_chat_action(message.chat.id, 'typing')
#     message_sent = show_thinking(message)
#     bot.send_chat_action(message.chat.id, 'typing')
#     try:
#         AIResponse = asyncio.run(ask_AI(message.text))
#         bot.edit_message_text(chat_id=message.chat.id, message_id=message_sent.message_id, text=AIResponse, parse_mode='Markdown')
#     except Exception as e:
#         print('An error ocurred ', end='')
#         print(e)

def fetch_ai_response(message):
    try:
        # Get the sent_message object from the queue
        sent_message = message_queue.get()
        AIResponse = asyncio.run(ask_AI(message.text))
        bot.edit_message_text(chat_id=message.chat.id, message_id=sent_message.message_id, text=AIResponse, parse_mode='Markdown')
    except Exception as e:
        print('An error ocurred ', end='')
        print(e)

@bot.message_handler(func=lambda message: True)
def handle_text(message):
    # Start a new thread to handle the "Thinking" animation
    thinking_thread = threading.Thread(target=show_thinking, args=(message,))
    thinking_thread.start()
    # Start a new thread to fetch the AI's response
    ai_thread = threading.Thread(target=fetch_ai_response, args=(message,))
    ai_thread.start()

try:
    print('bot is running . . .')
    bot.polling()
except Exception as e:
    print('An error ocurred ', end='')
    print(e)
import csv
import os
from dotenv import load_dotenv
import telebot
# pyTelegramBotAPI version 4.14.0
import g4f,asyncio


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

# Define a handler function to handle user prompt selections
@bot.message_handler(func=lambda message: message.text in prompts_dict.keys())
def handle_prompt_selection(message):
    # Retrieve the prompt based on the user's name selection
    selected_name = message.text
    if selected_name in prompts_dict:
        selected_prompt = prompts_dict[selected_name]
    else:
        selected_prompt = 'Sorry I can\'t provide answers for the provided command.'

    selected_prompt = '`' + selected_prompt+'`'

    # Send the prompt to the user along with the 'Copy  Prompt' button
    bot.send_message(message.chat.id,'Prompt send to AI is')
    bot.reply_to(message,selected_prompt,parse_mode = 'Markdown')
    bot.send_chat_action(message.chat.id, 'typing')
    bot.send_message(message.chat.id,"My reply to your first request is");

    AIResponse = asyncio.run(ask_AI(selected_prompt))
    bot.send_chat_action(message.chat.id, 'typing')

    bot.reply_to(message, AIResponse, parse_mode = 'Markdown')
    # bot.reply_to(message, AIResponse);

    print(f'User @{message.chat.username} | Selected: {selected_name}')

@bot.message_handler(func=lambda message: True)
def handle_text(message):
    bot.send_chat_action(message.chat.id, 'typing')
    bot.send_chat_action(message.chat.id, 'typing')
    bot.reply_to(message, "Thinking")
    AIResponse = asyncio.run(ask_AI(message.text))

    bot.reply_to(message, AIResponse, parse_mode = 'Markdown')
    # bot.reply_to(message, AIResponse)


try:
    print('bot is running . . .')
    bot.polling()
    
except Exception as e:
    print('An error ocurred ', end='')
    print(e)
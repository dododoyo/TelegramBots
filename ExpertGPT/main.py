import csv
import os
from dotenv import load_dotenv
import telebot
# pyTelegramBotAPI version 4.14.0
load_dotenv()

# Open and read the CSV file containing the prompts
with open('prompts.csv', 'r',encoding='utf-8') as file:
    reader = csv.reader(file)
    prompts_dict = {row[0]: row[1] for row in reader}

bot = telebot.TeleBot(os.getenv('BOT_TOKEN'))

@bot.message_handler(commands=['start'])
def send_menu(message):
    with open('welcome.gif','rb') as image_file:
        welcome_caption = """*Hello there, and Welcome. \nI generate different prompts for ChatGPT.* """
        bot.send_animation(message.chat.id,image_file,caption=welcome_caption,parse_mode='Markdown')
        print(f'User {message.chat.id} connected.')
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
    bot.send_message(message.chat.id,'*Tap the message to copy*', parse_mode = 'Markdown')
    bot.send_message(message.chat.id, selected_prompt, parse_mode = 'Markdown')
    print(f'User: {message.chat.id} | Selected: {selected_name}')

while True:
    try:
        print('bot is running . . .')
        bot.polling()
        
    except Exception as e:
        print('An error occured')
        print(e)
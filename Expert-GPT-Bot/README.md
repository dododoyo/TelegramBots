# How to setup the telegram bot

This is a simple Telegram bot that uses a virtual environment to manage its dependencies. To get started with the bot, follow these steps:

## Prerequisites

- Python 3.x
- `venv` module (included with Python 3.x)

## Virtual Environment Setup

1. Clone this repository to your local machine.
2. Navigate to the repository directory in your terminal or command prompt.
3. Create a new virtual environment by typing the following command and pressing Enter:

   ```
   python -m venv botenv
   ```

   This will create a new directory called `botenv` in the repository directory and populate it with the necessary files for a virtual environment.

4. Activate the virtual environment by typing the following command and pressing Enter:

   ```
   source botenv/bin/activate
   ```

   This will activate the `botenv` virtual environment and change the terminal prompt to indicate that you are now using the virtual environment.

> Note that the name of the virtual environment directory (`botenv` in this example) can be changed to any name you prefer. Also, the `python` command in step 3 may need to be replaced with `python3` depending on your system configuration (like ubuntu).

## Bot Setup

1. Install the required packages by typing the following command and pressing Enter:

   ```
   pip install -r requirements.txt
   ```

   This will install all the required packages listed in the `requirements.txt` file.

2. Create a new file called `.env` in the repository directory and add the following line to it:

   ```
   BOT_TOKEN=<your-bot-token>
   ```

   Replace `<your-bot-token>` with the token for your Telegram bot.

## Usage

To start the bot, make sure the virtual environment is activated and run the following command:

```
python bot.py
```

> Note that again the `python` command in may need to be replaced with `python3` depending on your system configuration (like ubuntu).

This will start the bot and listen for incoming messages. You can interact with the bot by sending messages to it in Telegram.

## Deactivation

When you are finished using the virtual environment, you can deactivate it by typing the following command and pressing Enter:
```
deactivate
```
This will deactivate the virtual environment and return you to the system's default Python environment.

`nodemon --exec python3 main.py`
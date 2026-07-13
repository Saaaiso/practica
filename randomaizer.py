"""
Скрипт генерации тестовых заявок в GLPI через REST API.
Создаёт 1000 заявок со случайным типом, приоритетом и датой создания
(даты — случайные в пределах последнего месяца).

Перед запуском:
    pip install requests
"""



import requests
import random
import json
import time
from datetime import datetime, timedelta

# ==================== НАСТРОЙКИ ====================

GLPI_URL = ""
APP_TOKEN = ""
USER_TOKEN = ""

TOTAL_TICKETS = 1000
DAYS_RANGE = 30  
# Коды GLPI
TYPES = [1, 2]    
PRIORITIES = [1, 2, 3, 4, 5, 6]

TITLES = [
    "Не работает принтер",
    "Нет доступа к почте",
    "Медленно работает компьютер",
    "Не запускается 1С",
    "Проблема с VPN",
    "Не приходят уведомления",
    "Ошибка при входе в систему",
    "Не работает сеть в кабинете",
    "Требуется установка ПО",
    "Не открывается файл на сервере",
    "Замена картриджа",
    "Настройка нового рабочего места",
    "Сбой в работе базы данных",
    "Не работает сканер",
    "Проблема с обновлением Windows",
]

DESCRIPTIONS = [
    "Проблема возникла сегодня утром, требуется помощь.",
    "Ошибка повторяется несколько раз в день.",
    "Не удаётся выполнить операцию, нужна консультация специалиста.",
    "После обновления перестало работать.",
    "Просьба решить в ближайшее время, мешает работе.",
]

# =====================================================


def get_random_datetime():
    """Случайная дата и время в пределах последнего месяца."""
    delta_days = random.randint(0, DAYS_RANGE)
    delta_seconds = random.randint(0, 86400)        # случайное время в течение дня
    dt = datetime.now() - timedelta(days=delta_days, seconds=delta_seconds)
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def init_session():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"user_token {USER_TOKEN}",
        "App-Token": APP_TOKEN,
    }
    resp = requests.get(f"{GLPI_URL}/initSession", headers=headers)
    resp.raise_for_status()
    return resp.json()["session_token"]


def kill_session(session_token):
    headers = {
        "Content-Type": "application/json",
        "Session-Token": session_token,
        "App-Token": APP_TOKEN,
    }
    requests.get(f"{GLPI_URL}/killSession", headers=headers)


def create_ticket(session_token, title, content, ticket_type, priority):
    headers = {
        "Content-Type": "application/json",
        "Session-Token": session_token,
        "App-Token": APP_TOKEN,
    }
    payload = {
        "input": {
            "name": title,
            "content": content,
            "type": ticket_type,
            "priority": priority,
            # Принудительно устанавливаем дату создания
            "date": get_random_datetime(),
        }
    }
    resp = requests.post(f"{GLPI_URL}/Ticket", headers=headers, data=json.dumps(payload))
    return resp


def main():
    print("Открываю сессию GLPI...")
    session_token = init_session()
    print("Сессия открыта, начинаю создание заявок...")

    success = 0
    failed = 0

    for i in range(1, TOTAL_TICKETS + 1):
        title = random.choice(TITLES) + f" #{i}"
        content = random.choice(DESCRIPTIONS)
        ticket_type = random.choice(TYPES)
        priority = random.choice(PRIORITIES)

        try:
            resp = create_ticket(session_token, title, content, ticket_type, priority)
            if resp.status_code in (200, 201):
                success += 1
            else:
                failed += 1
                print(f"[{i}] Ошибка {resp.status_code}: {resp.text[:200]}")
        except requests.exceptions.RequestException as e:
            failed += 1
            print(f"[{i}] Сетевая ошибка: {e}")

        if i % 50 == 0:
            print(f"Создано {i}/{TOTAL_TICKETS} (успешно: {success}, ошибок: {failed})")
            time.sleep(0.5)

    print(f"\nГотово. Успешно создано: {success}, ошибок: {failed}")
    print("Закрываю сессию...")
    kill_session(session_token)
    print("Сессия закрыта.")


if __name__ == "__main__":
    main()

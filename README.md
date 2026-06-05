### Hexlet tests and linter status:
[![Actions Status](https://github.com/g3nnadevich/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/g3nnadevich/frontend-project-11/actions)
[![Node CI](https://github.com/g3nnadevich/frontend-project-11/actions/workflows/nodejs.yml/badge.svg)](https://github.com/g3nnadevich/frontend-project-11/actions/workflows/nodejs.yml)

# RSS Aggregator

## 📖 Описание
Простое приложение для агрегации RSS-фидов.  
Позволяет:  
- Добавлять новые RSS-фиды по URL  
- Просматривать список подписок и постов  
- Отмечать посты как прочитанные (непрочитанные выделяются жирным)  
- Просматривать полное описание поста в модальном окне  

Реализовано с использованием **Vanilla JS**, **Bootstrap 5**, **Axios**, **Valtio** и **i18next**.

---

## ⚙️ Функционал
- Валидация URL и проверка на дубликаты  
- Обработка ошибок сети и некорректного RSS  
- Автоматическое обновление постов каждые 5 секунд  
- Состояние приложения хранится в **Valtio proxy**  

---

## 🛠 Технологии
- HTML / CSS / JS  
- Bootstrap 5  
- Valtio (для state management)  
- Axios (для запросов)  
- i18next (для локализации)  
- Playwright (для e2e тестов)  

---

## 🚀 Установка
```
bash
git clone git@github.com:g3nnadevich/frontend-project-11.git
cd frontend-project-11
npm install
npm run dev
```
Приложение будет доступно по адресу: http://localhost:5173

const BOT_TOKEN = import.meta.env.VITE_TG_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TG_CHAT_ID;

/**
 * Форматирует и отправляет уведомление о заказе в Telegram
 * @param {Object} orderData - { items, subtotal, delivery, total, discount }
 * @returns {Promise<boolean>} - true при успехе
 */
export const sendOrderToTelegram = async (orderData) => {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram: BOT_TOKEN или CHAT_ID не заданы в .env');
    return false;
  }

  const { items, subtotal, delivery, total, discount } = orderData;

  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Формируем строки товаров
  const itemLines = items
    .map(
      (item, i) =>
        `${i + 1}. *${escapeMarkdown(item.name)}*\n` +
        `   Количество: ${item.quantity}\n` +
        `   Цена: $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n\n');

  let message =
    `🛒 *Новый заказ!*\n\n` +
    `📦 *Товары:*\n\n` +
    `${itemLines}\n\n` +
    `───────────────\n`;

  if (discount > 0) {
    message += `🏷 Скидка: \\-$${discount.toFixed(2)}\n`;
  }

  message +=
    `🚚 Доставка: $${delivery.toFixed(2)}\n` +
    `💰 *Итого: $${total.toFixed(2)}*\n\n` +
    `🕒 Дата: ${dateStr} ${timeStr}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error('Telegram API error:', result.description);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
    return false;
  }
};

// Экранирует спецсимволы Markdown v1 в названии товара
const escapeMarkdown = (text) =>
  String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');

const express = require("express");
const router = express.Router();

// маршрут. путь, функции обратного вызова: запрос и ответ
router.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // отправка отвелта клиенту
  res.send("Test");
});

// экспортируем как модуль
module.exports = router;

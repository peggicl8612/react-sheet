#!/bin/bash

# 測試訂單完成 API
# 使用方式: ./test-order.sh

echo "測試訂單完成 API..."
echo "發送測試訂單到 peggy.lin1712@gmail.com"
echo ""

curl -X POST http://localhost:3001/api/orders/completed \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-2024-002",
    "customerEmail": "peggy.lin1712@gmail.com",
    "customerName": "Peggy Lin"
  }'

echo ""
echo ""
echo "測試完成！請檢查："
echo "1. 伺服器日誌"
echo "2. peggy.lin1712@gmail.com 的收件匣"
echo "3. MongoDB 資料庫記錄"


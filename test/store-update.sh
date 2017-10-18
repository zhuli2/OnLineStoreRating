read -p $'\nUpdate a Store by ID'
curl -X "PUT" "http://localhost:3000/store?id=2" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"storename":"duplicateStore","category":"","address":"405 Bloor St"}'

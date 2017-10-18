read -p $'\nCreate a Store'
curl -X "POST" "http://localhost:3000/store" \
     -H "Content-Type:application/json" \
     -d $'{"storename":"","category":"department","address":"123 Steals Ave."}'

read -p $'\nCreate a Store'
curl -X "POST" "http://localhost:3000/store" \
     -H "Content-Type:application/json" \
     -d $'{"storename":"mallwart","category":"","address":""}'     

read -p $'\nCreate a Store'
curl -X "POST" "http://localhost:3000/store" \
     -H "Content-Type:application/json" \
     -d $'{"storename":"mallwart","category":"department","address":"83 Don Mills Ave."}'

read -p $'\nCreate a Store'
curl -X "POST" "http://localhost:3000/store" \
     -H "Content-Type:application/json" \
     -d $'{"storename":"mallwart","category":"department","address":"831 Young St"}'
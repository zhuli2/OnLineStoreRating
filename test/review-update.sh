read -p $'\nUpdate a Review by ID'
curl -X "PUT" "http://localhost:3000/review?id=" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"userid":"","storeid":"","rating":"", "comment":"add text"}'

read -p $'\nUpdate a Review by ID'
curl -X "PUT" "http://localhost:3000/review?id=7" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"userid":"6","storeid":"","rating":"", "comment":"add text"}'

read -p $'\nUpdate a Review by ID'
curl -X "PUT" "http://localhost:3000/review?id=7" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"userid":"6","storeid":"2","rating":"", "comment":"add text"}'

read -p $'\nUpdate a Review by ID'
curl -X "PUT" "http://localhost:3000/review?id=7" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"userid":"6","storeid":"2","rating":"100", "comment":"add text"}'
     
read -p $'\nUpdate a Review by ID'
curl -X "PUT" "http://localhost:3000/review?id=1" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"userid":"15","storeid":"2","rating":"5", "comment":"return json"}'     
     
read -p $'\nUpdate a Review by ID'
curl -X "PUT" "http://localhost:3000/review?id=7" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"userid":"600","storeid":"200","rating":"8", "comment":"add text"}'

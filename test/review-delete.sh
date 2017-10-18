read -p $'\nDelete a Review by id'
curl -X "DELETE" "http://localhost:3000/review?id=&userid=3&storeid=100" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{}'     


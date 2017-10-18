read -p $'\nDelete an User by id'
curl -X "DELETE" "http://localhost:3000/user?id=11" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{}'     

read -p $'\nDelete a Store by id'
curl -X "DELETE" "http://localhost:3000/store?" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{}'     

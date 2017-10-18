read -p $'\nCreate a Review'
curl -X "POST" "http://localhost:3000/review" \
     -H "Content-Type:application/json" \
     -d $'{"userid":"2","storeid":"4","rating":"5", "comment":"test"}'
     

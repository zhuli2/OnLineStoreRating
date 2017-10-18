read -p $'\nCreate an User'
curl -X "POST" "http://localhost:3000/user" \
     -H "Content-Type:application/json" \
     -d $'{"username":"gump1994","firstname":"Tom","lastname":"Hank","sex":"M","age":"60"}'
     

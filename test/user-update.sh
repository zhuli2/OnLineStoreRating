read -p $'\nUpdate an User'
curl -X "PUT" "http://localhost:3000/user?id=12" \
     -H "Content-Type: application/json;charset=utf-8" \
     -d $'{"username":"oneUser","firstname":"","lastname":"","sex":"M","age":"30"}'

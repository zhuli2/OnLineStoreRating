read -p $'\nGet Specific User by id'
curl 'http://localhost:3000/user?id=2'

read -p $'\nGet Specific User by userName'
curl 'http://localhost:3000/user?username=gump'
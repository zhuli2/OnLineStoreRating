read -p $'\nGet Specific Users'
curl 'http://localhost:3000/users?sex=&firstname=&age="20"&lastname=first'
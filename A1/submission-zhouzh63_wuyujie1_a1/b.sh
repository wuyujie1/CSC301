
heroku login
heroku create --app zhouzh63wuyujie1
heroku container:login
heroku container:push web --app zhouzh63wuyujie1
heroku container:release web --app zhouzh63wuyujie1
heroku open --app zhouzh63wuyujie1

# docker
To start:

`docker build -t a1-301 .`

`docker run -d --name a1-301-container -p 80:80 a1-301:latest`

`docker start a1-301-container`

To stop/remove container:

`docker stop a1-301-container`

`docker rm a1-301-container`

# heroku
`heroku login`

`heroku create --app <app-server-name>`

`heroku container:login`

`heroku container:push web --app <app-server-name>`

`heroku container:release web --app <app-server-name>`

`heroku open --app <app-server-name>`

# Write your documentation below

Write your documentation here.

# heroku URL
link to main page: https://zhouzh63wuyujie1.herokuapp.com
link to actor view page: https://zhouzh63wuyujie1.herokuapp.com/actor.html

# objective statement
A prototype web app which monitors the stage position of every charactors according the script. This app will be designed for multiple types of users: Directors can use it to modify the actors' position for all parts of the script, Actors can also get the blocking information for their parts in every scripts.

# personas
1. David as an actor
2. Mike as a director
3. Frank as a lightning director
4. Natalie as a music director

# user stories
1. As an actor, David wants to know where his position for all part of script, so that he can focus on his role in the show and doesn't need to remember other information, like other actors' position.

2. As an director, Mike wants to review the stage position information anytime. He also wants to modify that information when he finds better positions for roles. Without any helping tools, he needs to notify every actor every single time he makes change to any roles and this really makes him feel unconfortable, since he wants to make every detail perfect so that the frequency of modification is very high. 

3. As a lightning director, Frank need to keep track of which parts of stage have actor standing on it, since he need to illuminate actors' face. Originally, he needs to read the entire scripts in order to get stage positions, which includes some useless information for him, such as the name of the roles: the stage position numbers are seperated by role nemas and this makes him very inconvenient when number of roles gets larger. He definately need something that can filtered those unused information so that he can see what he need more intuitively.

4. As a music director, Natalie also wants to know where are the actors. She need to navigate to the nearest audio equipment to each actor and use it as output of that actor's microphone, in order to mimic the best 3D sound effect. The current tool for Natalie is only the paper script which stage positions marked on it, but it take time to translate between position numbers and actual direction. She complainted that in the case of emergency event, such as one audio equipment is malfunctioning, it is very hard for her to react, since she need to find the second best choice in very short amount of time.

# acceptance criteria
- There are only 8 positions and every position has been marked as a certain number.
- There can be at most one actor can take up particular spot on stage.
- Only include the position information for every script. And do not need to care about any other thing.
- Only know the position information for the current script. No information about previous script should be keep tracked.

# JSON files
- script_get_data.json:  
This file contains an example of json for get data, we omitted script_id from the file since actor.js does not need to use this information ("client knows which script they want"). We also omitted the part number and only kept the start time and end time for each part, since the part number can be computed externally and we can use simple arithematic to determine which number should be used as start time and end time for current part. Moreover, we put actor number and name into one string as key for their positions, the positions are in correct order so we can easily compute correct position that we want to use. The last attritube is the content of the script, which must be kept.
- script_post_data.json:  
The information contained in this file is almost the same as *script_get_data.json*. According to the format of scripts, we add one more information into the *script_post_data.json*, the script id. Since no matter the character show on the stage for this part or not, it will be notified on script (0 for not on stage). So we use a dictionary to store the position info for each character. The part number is represented by [#index - 1]. In this way, we avoid to store duplicate information of characters. The reason how we store the the start time and end time for each part is exactly the same as *script_get_data.json*.

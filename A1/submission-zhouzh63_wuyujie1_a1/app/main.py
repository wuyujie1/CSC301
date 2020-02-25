from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import re

# Start the app and setup the static directory for the html, css, and js files.
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

# This is your 'database' of scripts with their blocking info.
# You can store python dictionaries in the format you decided on for your JSON
   # parse the text files in script_data to create these objects - do not send the text
   # files to the client! The server should only send structured data in the sallest format necessary.
scripts = []
scripts_id = []

filepath = "/app/script_data/"
files = os.listdir(filepath)
for item in files:
    scripts.append("/app/script_data/" + item)
    tempf = open(("/app/script_data/" + item), 'r')
    scripts_id.append(int(tempf.readline().strip('\n')))
    tempf.close()
for i in range(len(scripts_id)):
        for j in range(0, len(scripts_id)-i-1):
            if scripts_id[j] > scripts_id[j+1] :
                scripts_id[j], scripts_id[j+1] = scripts_id[j+1], scripts_id[j]
                scripts[j], scripts[j+1] = scripts[j+1], scripts[j]

actorlst = open("/app/actors.csv", 'r').readlines()
### DO NOT modify this route ###
@app.route('/')
def hello_world():
    return 'Theatre Blocking root route'

### DO NOT modify this example route. ###
@app.route('/example')
def example_block():
    example_script = "O Romeo, Romeo, wherefore art thou Romeo? Deny thy father and refuse thy name. Or if thou wilt not, be but sworn my love And I’ll no longer be a Capulet."

    # This example block is inside a list - not in a dictionary with keys, which is what
    # we want when sending a JSON object with multiple pieces of data.
    return jsonify([example_script, 0, 41, 4])


''' Modify the routes below accordingly to
parse the text files and send the correct JSON.'''

## GET route for script and blocking info
@app.route('/script/<int:script_id>')
def script(script_id):
    #right now, just sends the script id in the URL
    if script_id > len(scripts):
        return jsonify("Invalid Script ID")
    curr_script = open(scripts[script_id - 1], 'r')
    curr_script = curr_script.readlines()[2:]
    for line in range(len(curr_script)):
        curr_script[line] = curr_script[line].strip("\n")
    jsn = {'content': curr_script[0], 'part': [], 'actor': {}}
    for item in curr_script[2:]:
        item = item[item.index(' ') + 1:].split(',')
        jsn['part'].append(item[0].strip(' '))
        jsn['part'].append(item[1].strip(' '))
        for itm in item[2:]:
            itm = itm.strip(' ')
            if itm != "":
                char = itm.split('-')
                charnum = ''
                for num in actorlst:
                    if char[0] in num:
                        charnum = num[:num.index(',')]
                if charnum + ' ' + char[0] not in jsn['actor']:
                    jsn['actor'][charnum + ' ' + char[0]] = [char[1]]
                else:
                    jsn['actor'][charnum + ' ' + char[0]].append(char[1])
    return jsonify(jsn)


## POST route for replacing script blocking on server
# Note: For the purposes of this assignment, we are using POST to replace an entire script.
# Other systems might use different http verbs like PUT or PATCH to replace only part
# of the script.
@app.route('/script', methods=['POST'])
def addBlocking():
    # right now, just sends the original request json
    actors = []
    for a in actorlst:
        a = a.strip("\n")
        actors.append(a[2:])
    script_id = request.json['scriptNum']
    actor = request.json['actor_info']
    content = request.json['content_info']
    part_time = request.json['part']
    parts = []
    index = 0
    while index < len(part_time) / 2:
        curr_part = str(index + 1) + ". " + part_time[index * 2] + ", " + part_time[index * 2 + 1] + ", "
        for act in actors:
            curr_part += act + "-" + actor[act][index] + ", "
        curr_part = curr_part[:-2]
        parts.append(curr_part)
        index += 1

    add_str = scripts[int(script_id) - 1]
    file = open(add_str,'w')
    file.write(script_id)
    file.write("\n\n")
    file.write(content)
    file.write("\n")
    for part in parts:
        file.write("\n")
        file.write(part)
    file.close()

    return jsonify(request.json)



if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORT', 80))

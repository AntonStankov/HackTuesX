from flask import Flask, request, jsonify
from map_generation import Ocean
import mysql.connector
import configparser
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
SECRET_KEY = 'ieOlmiWaCCRDOzkg4tZVAO5AtdRnE3dtK10qTCBytyKORfuxAcJxhYFBKDiAqjQ5'

config = configparser.ConfigParser()
config.read('config.ini')
username = config['database']['username']
password = config['database']['password']



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        token = token.split(" ")[1] if token.startswith("Bearer ") else token
        if not token:
            return jsonify(message='Token is missing'), 401

        print("token")
        print(token)
        try:
            print ("token decode")
            print (token)
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = data['username']
        except:
            return jsonify(message='Token is invalid'), 401

        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/server2/generate', methods=['POST'])
#@token_required
def generate_map():
    ocean = Ocean()
    ocean.generate_land()
    # send and sql query to the database to write the ocean_string to the database
    cnx = mysql.connector.connect(user=username, password=password,
                                  host='138.197.120.158',
                                  port=3306,
                                  database='test_db')

    cursor = cnx.cursor()

    #get the user id from the users table
    #cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
    user_id = 1
    cursor.execute("INSERT INTO ocean (ocean_string, user_id) VALUES (%s, %s)", (ocean.convert_to_string(), user_id,))
    cnx.commit()
    cnx.close()
    return ocean.convert_to_string()


@app.route('/save_map', methods=['POST'])
#@token_required
def save_map():
    #should get the current user like save_map(user)
    # Check if the request contains the required data
    if 'map_string' not in request.json:
        return jsonify(message='Map string is missing'), 400

    map_string = request.json['map_string']
    print(map_string)
    try:
        # Connect to the database
        cnx = mysql.connector.connect(user=username, password=password,
                                      host='138.197.120.158',
                                      port=3306,
                                      database='test_db')
        cursor = cnx.cursor()

        # Get the user id from the users table
        #cursor.execute("SELECT id FROM users WHERE username = %s", (current_user,))
        #user_id = cursor.fetchone()[0]
        user_id = 1
        # Insert the map string into the database
        cursor.execute("INSERT INTO ocean (ocean_string, user_id) VALUES (%s, %s)", (map_string, user_id))
        cnx.commit()

        # Close the database connection
        cnx.close()

        return jsonify(message='Map string saved successfully'), 200
    except Exception as e:
        return jsonify(message='Error occurred while saving map string: {}'.format(str(e))), 500


if __name__ == '__main__':
    app.run(debug=True)

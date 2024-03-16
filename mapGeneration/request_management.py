from flask import Flask, request, jsonify
from map_generation import Ocean
import mysql.connector
import configparser
import jwt
import datetime
from functools import wraps
import requests

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

        # print("token")
        # print(token)

        return f(token=token, *args, **kwargs)

    return decorated


@app.route('/server2/generate', methods=['POST'])
@token_required
def generate_map(token):
    ocean = Ocean()
    ocean.generate_land()
    try:
        json_data = request.get_json()
        ocean_name = json_data.get('ocean_name')
    except Exception as e:
        return jsonify(message=f"Error parsing JSON: {str(e)}"), 400

    # send and sql query to the database to write the ocean_string to the database
    cnx = mysql.connector.connect(user=username, password=password,
                                  host='138.197.120.158',
                                  port=3306,
                                  database='test_db')

    cursor = cnx.cursor()

    # get the user id from the users table
    response = requests.get("http://138.197.104.32:8765/api/user", headers={'Authorization': f'Bearer {token}'})
    if response.status_code == 200:
        user_id = response.json().get('id')
    else:
        # Log the error or send back a response indicating the failure
        print(f"Failed to get user id, status code: {response.status_code}")
        return jsonify(
            message=f"An error occurred while retrieving user data, status code: {response.status_code}"), 500

    cursor.execute("INSERT INTO ocean (ocean_string, user_id, name) VALUES (%s, %s, %s)", (ocean.convert_to_string(), user_id, ocean_name,))
    cnx.commit()
    cnx.close()
    print("ocean generated")
    return ocean.convert_to_json(), 200


@app.route('/server2/save_map', methods=['POST'])
@token_required
def save_map(token):
    # should get the current user like save_map(user)
    # Check if the request contains the required data
    if 'map_string' not in request.json:
        return jsonify(message='Map string is missing'), 400

    map_string = request.json['map_string']
    print(map_string)
    try:
        # Connect to the database
        print("database")
        try:
            cnx = mysql.connector.connect(user=username, password=password,
                                          host='138.197.120.158',
                                          port=3306,
                                          database='test_db')
            cursor = cnx.cursor()
        except Exception as e:
            print(e)

        # Get the user id from the users table
        response = requests.get("http://138.197.104.32:8765/api/user", headers={'Authorization': f'Bearer {token}'})
        if response.status_code == 200:
            user_id = response.json().get('id')
        else:
            # Log the error or send back a response indicating the failure
            print(f"Failed to get user id, status code: {response.status_code}")
            return jsonify(
                message=f"An error occurred while retrieving user data, status code: {response.status_code}"), 500
        # print("user id")
        # Insert the map string into the database
        cursor.execute("INSERT INTO ocean (ocean_string, user_id) VALUES (%s, %s)", (map_string, user_id))
        cnx.commit()
        print("map in db")
        # Close the database connection
        cnx.close()

        return jsonify(message='Map string saved successfully'), 200
    except Exception as e:
        return jsonify(message='Error occurred while saving map string: {}'.format(str(e))), 500


@app.route('/server2/get_map', defaults={'id': None})
@app.route('/server2/get_map/<id>')
def get_map(id):
    cnx = mysql.connector.connect(user=username, password=password,
                                  host='138.197.120.158',
                                  port=3306,
                                  database='test_db')
    cursor = cnx.cursor()

    if id:
        cursor.execute("SELECT ocean_id, user_id, ocean_string, name FROM ocean WHERE ocean_id = %s", (id,))
        result = cursor.fetchone()
        cnx.close()
        if result:
            return jsonify(ocean_id=result[0], user_id=result[1], ocean_string=result[2], name=result[3]), 200
        else:
            return jsonify(message='Map not found'), 404
    else:
        cursor.execute("SELECT ocean_id, user_id, ocean_string, name FROM ocean")
        results = cursor.fetchall()
        cnx.close()
        if results:
            oceans = [{'ocean_id': result[0], 'user_id': result[1], 'ocean_string': result[2], 'name': result[3]} for result in results]
            return jsonify(oceans=oceans), 200
        else:
            return jsonify(message='Maps not found'), 404


@app.route('/server2/get_my_ocean', defaults={'ocean_id': None})
@app.route('/server2/get_my_ocean/<ocean_id>', methods=['GET'])
@token_required
def get_my_ocean(token, ocean_id):
    cnx = mysql.connector.connect(user=username, password=password,
                                  host='138.197.120.158',
                                  port=3306,
                                  database='test_db')
    cursor = cnx.cursor()

    response = requests.get("http://138.197.104.32:8765/api/user", headers={'Authorization': f'Bearer {token}'})
    if response.status_code == 200:
        user_id = response.json().get('id')
        print(user_id)
    else:
        # Log the error or send back a response indicating the failure
        print(f"Failed to get user id, status code: {response.status_code}")
        return jsonify(
            message=f"An error occurred while retrieving user data, status code: {response.status_code}"), 500
    if ocean_id:
        cursor.execute("SELECT ocean_string, name FROM ocean WHERE ocean_id = %s AND user_id = %s", (ocean_id, user_id))
        result = cursor.fetchone()
        cnx.close()
        if result:
            return jsonify(ocean_string=result[0], ocean_name=result[1]), 200
        else:
            return jsonify(message='Map not found'), 404
    else:
        cursor.execute("SELECT ocean_string, name FROM ocean WHERE user_id = %s", (user_id,))
        results = cursor.fetchall()
        print("results " + str(results))
        cnx.close()
        if results:
            oceans = [{'ocean_string': result[0], 'ocean_name': result[1]} for result in results]
            return jsonify(oceans=oceans), 200
        else:
            return jsonify(message='Maps not found'), 404


@app.route('/server2/delete_map/<delete_id>', methods=['DELETE'])
@token_required
def delete_map(delete_id, token):
    cnx = mysql.connector.connect(user=username, password=password,
                                  host='138.197.120.158',
                                  port=3306,
                                  database='test_db')
    cursor = cnx.cursor()
    response = requests.get("http://138.197.104.32:8765/api/user", headers={'Authorization': f'Bearer {token}'})
    if response.status_code == 200:
        user_id = response.json().get('id')
    else:
        # Log the error or send back a response indicating the failure
        print(f"Failed to get user id, status code: {response.status_code}")
        return jsonify(
            message=f"An error occurred while retrieving user data, status code: {response.status_code}"), 500
    cursor.execute("SELECT ocean_id FROM ocean WHERE user_id = %s", (user_id,))
    db_ocean_id = cursor.fetchall()

    if cursor.rowcount == 0:
        return jsonify(message='Maps not found'), 404
    delete_id = int(delete_id)
    found = False
    for row in db_ocean_id:
        if delete_id == row[0]:
            found = True
            break

    # Check if delete_id was found in db_ocean_id
    if not found:
        return jsonify(message='Map not found'), 404
    # delete the ocean string from the database
    cursor.execute("DELETE FROM ocean WHERE ocean_id = %s", (delete_id,))
    cnx.commit()
    cnx.close()
    return jsonify(message='Map deleted successfully'), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

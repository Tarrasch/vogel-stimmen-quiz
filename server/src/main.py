from flask import Flask, jsonify, request
import requests


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)

def only_keep_keys_in_dict(keys_to_keep, dictionary):
    all_keys = dictionary.keys()
    keys_to_delete = set(all_keys) - set(keys_to_keep)
    for key in keys_to_delete:
        del dictionary[key]


def clean_response(json: dict) -> dict:
    only_keep_keys_in_dict(keys_to_keep=['numRecordings','page','numPages','recordings'], dictionary=json)
    for recording_dict in json['recordings']:
        only_keep_keys_in_dict(keys_to_keep=['file', 'rec','en','gen','sp','id','url','also'], dictionary=recording_dict)
    return json

@app.route('/simple-xeno-canto')
def simple_xeno_canto():
    """Main handler of codebase."""
    xeno_canto_response = requests.get('https://www.xeno-canto.org/api/2/recordings', params=request.args)
    our_response = jsonify(clean_response(xeno_canto_response.json()))
    our_response.headers.add('Access-Control-Allow-Origin', '*')
    response_cache_control = our_response.cache_control
    response_cache_control.max_age = 12*60*60  # 12 hours
    response_cache_control.public = True
    return our_response


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)

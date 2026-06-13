import requests


class Auth:
  def __init__(self):
    pass

  @classmethod
  def getToken(cls, host=None, port=5000, username=None, password=None):
    BASE_URL = f"http://{host}:{port}/webapi/entry.cgi"

    payload = {
      "api": "SYNO.API.Auth",
      "version": "6",
      "method": "login",
      "account": username,
      "passwd": password,
      "session": "DSM",
      "format": "cookie",
    }

    print("Logging in...")
    response = requests.get(BASE_URL, params=payload)
    return response.json()

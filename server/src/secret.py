import requests


class Secret:
  def __init__(self, SecretPath):
    self.SecretPath = SecretPath

    url = f'http://freeman.kungfoo.local:80/secret/{SecretPath}.json'
    resp = requests.get(url)
    self.data = resp.json()

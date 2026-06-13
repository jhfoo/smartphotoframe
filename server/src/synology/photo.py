import json

import requests


class Photo:
  def __init__(
    self,
  ):
    pass

  @classmethod
  def downloadTeamThumbnail(cls, SessionId, PhotoId, CacheKey: str, size: None):
    BASE_URL = f'http://chie.kungfoo.local:5000/webapi/entry.cgi'
    # CacheKey = "4116_1625255789"
    # PhotoId = 4116

    cookies = {
      'id': SessionId,
    }

    payload = {
      'api': 'SYNO.FotoTeam.Thumbnail',  # Changed API endpoint
      'version': '1',
      'method': 'get',  # Changed method from download to get
      'type': 'unit',
      # "unit": [PhotoId],  # Single ID string instead of unit list array
      'id': PhotoId,  # Single ID string instead of unit list array
      'size': 'xl',  # Choose: 'sm' (small), 'm' (medium), or 'xl' (large)
      'cache_key': CacheKey,
      'shared_space': 'true',
    }

    file_response = requests.get(BASE_URL, params=payload, cookies=cookies, stream=True)

    if file_response.status_code == 200:
      file_path = f'cache/photo.{PhotoId}.jpg'
      with open(file_path, 'wb') as f:
        for chunk in file_response.iter_content(chunk_size=8192):
          print('.', end='', flush=True)
          f.write(chunk)
        return file_path

    print(f'Failed to download photo: {file_response.status_code}')
    return None

  @classmethod
  def downloadThumbnail(cls, SessionId, PhotoId, CacheKey: str, size: None):
    BASE_URL = f'http://chie.kungfoo.local:5000/webapi/entry.cgi'
    # CacheKey = "4116_1625255789"
    # PhotoId = 4116

    cookies = {
      'id': SessionId,
    }

    payload = {
      'api': 'SYNO.Foto.Thumbnail',  # Changed API endpoint
      'version': '1',
      'method': 'get',  # Changed method from download to get
      'type': 'unit',
      # "unit": [PhotoId],  # Single ID string instead of unit list array
      'id': PhotoId,  # Single ID string instead of unit list array
      'size': 'xl',  # Choose: 'sm' (small), 'm' (medium), or 'xl' (large)
      'cache_key': CacheKey,
    }

    file_response = requests.get(BASE_URL, params=payload, cookies=cookies, stream=True)

    if file_response.status_code == 200:
      file_path = f'cache/photo.{PhotoId}.jpg'
      with open(file_path, 'wb') as f:
        for chunk in file_response.iter_content(chunk_size=8192):
          print('.', end='', flush=True)
          f.write(chunk)
        return file_path

    print(f'Failed to download photo: {file_response.status_code}')
    return None

  @classmethod
  def downloadOriginal(cls, SessionId, PhotoId, CacheKey: str, size: None):
    BASE_URL = f'http://chie.kungfoo.local:5000/webapi/entry.cgi'
    CacheKey = '4116_1625255789'
    PhotoId = 4116

    cookies = {
      'id': SessionId,
    }

    payload = {
      'api': 'SYNO.Foto.Download',  # Changed API endpoint
      'version': '1',
      'method': 'download',  # Changed method from download to get
      'unit': PhotoId,  # Single ID string instead of unit list array
      # "unit": f"[{PhotoId}]",  # Single ID string instead of unit list array
      # "cache_key": CacheKey,
      # "team_sharing": "true",
    }

    print(json.dumps(payload, indent=2))

    file_response = requests.get(BASE_URL, params=payload, cookies=cookies, stream=True)

    if file_response.status_code == 200:
      resp = file_response.json()
      if resp['success']:
        file_path = 'photo.jpg'
        with open(file_path, 'wb') as f:
          for chunk in file_response.iter_content(chunk_size=8192):
            f.write(chunk)
      else:
        print(f'Failed to download photo: {respmu["error"]}')

# core
import json

# custom
from synology.album import Album
from synology.auth import Auth
from synology.photo import Photo

NAS_IP = 'chie.kungfoo.local'  # Replace with your NAS IP
NAS_PORT = '5000'  # Default HTTP port (use 5001 for HTTPS)
USERNAME = 'jhfoo'
PASSWORD = '1Luvlisa!'


def main():
  token = Auth.getToken(NAS_IP, NAS_PORT, USERNAME, PASSWORD)
  print(token)
  if token['success']:
    print('Token:', token['data']['sid'])
    session_id = token['data']['sid']
    albums = Album.getAll(session_id)
    # print(json.dumps(albums, indent=2))

    album = [a for a in albums if a['id'] == 38]
    print(json.dumps(album, indent=2))

    photos = Album.getPhotos(session_id, 38)
    print(json.dumps(photos, indent=2))
    photo = dict(next((p for p in photos if p['id'] == 77371), None))
    print(json.dumps(photo, indent=2))

    if photo['owner_user_id'] == 0:
      photo = Photo.downloadTeamThumbnail(session_id, 77371, '77371_1760254928', None)
    else:
      photo = Photo.downloadThumbnail(session_id, 77371, '77371_1760254928', None)

    print(photo)


if __name__ == '__main__':
  main()

# core
import json
import time
from pathlib import Path

# community
from fastapi import APIRouter
from fastapi.responses import FileResponse
from synology.album import Album
from synology.auth import Auth
from synology.photo import Photo

# custom
from config import Config
from secret import Secret

NAS_IP = 'chie.kungfoo.local'  # Replace with your NAS IP
NAS_PORT = 5000  # Default HTTP port (use 5001 for HTTPS)

router = APIRouter(prefix='/smartphotoframe')

SynologySecret = Secret('jhfoo/chie')


def autoCreateCacheFolder():
  if not Path('cache').exists():
    Path('cache').mkdir()


def getSessionId():
  global NAS_IP, NAS_PORT, SynologySecret

  token = Auth.getToken(
    NAS_IP, NAS_PORT, SynologySecret.data['UserId'], SynologySecret.data['passwd']
  )
  if 'data' not in token or 'sid' not in token['data']:
    raise Exception('SessionId is None')

  # else
  return token['data']['sid']


@router.get('/default/album')
def getDefaultAlbum():
  return {'AlbumId': Config.default.AlbumId, 'AlbumName': Config.default.AlbumName}


@router.get('/default/album/{AlbumId}')
def initSetting(AlbumId: int):
  SessionId = getSessionId()
  albums = Album.getAll(SessionId)
  MatchedAlbums = [album for album in albums if album['id'] == AlbumId]
  if not MatchedAlbums:
    return {'success': False, 'message': f'AlbumId {AlbumId} not found'}

  Config.default.AlbumId = AlbumId
  Config.default.AlbumName = MatchedAlbums[0]['name']
  Config.save()
  return {'AlbumId': AlbumId, 'AlbumName': Config.default.AlbumName, 'success': True}


@router.get('/album/list')
def getAlbums():
  autoCreateCacheFolder()

  fname = 'cache/album.list.json'
  MaxAgeSec = 5 * 60

  if not Path(fname).exists() or (
    time.time() - Path(fname).stat().st_mtime > MaxAgeSec
  ):
    # fetch albums from NAS and cache them
    SessionId = getSessionId()
    albums = Album.getAll(SessionId)
    with open(fname, 'w') as f:
      json.dump(albums, f)

  # return cached albums
  with open(fname, 'r') as f:
    albums = json.load(f)
  return albums


@router.get('/photo/{PhotoId}/cache/{CacheKey}/UserId/{UserId}')
def getPhotoThumbnail(PhotoId: int, CacheKey: str, UserId: int):
  autoCreateCacheFolder()

  fname = f'cache/photo.{PhotoId}.jpg'
  if Path(fname).exists():
    return FileResponse(fname)

  SessionId = getSessionId()
  if UserId == 0:
    PhotoFname = Photo.downloadTeamThumbnail(SessionId, PhotoId, CacheKey, None)
  else:
    PhotoFname = Photo.downloadThumbnail(SessionId, PhotoId, CacheKey, None)
  if PhotoFname:
    return FileResponse(PhotoFname)
  return 'Error'


@router.get('/album/{AlbumId}/photos')
def getAlbumPhotos(AlbumId: int):
  autoCreateCacheFolder()

  fname = f'cache/album.{AlbumId}.photos.json'
  print(f'cache: {fname}')
  MaxAgeSec = 5 * 60

  if not Path(fname).exists() or (
    time.time() - Path(fname).stat().st_mtime > MaxAgeSec
  ):
    SessionId = getSessionId()
    photos = Album.getPhotos(SessionId, AlbumId)
    if photos:
      with open(fname, 'w') as f:
        json.dump(photos, f)
    else:
      photos = []
  else:
    with open(fname, 'r') as f:
      photos = json.load(f)
  return photos


@router.get('/')
def getPhoto():
  return 'https://fastly.picsum.photos/id/638/1920/1080.jpg?hmac=NAOd23VbjYey0n--NRzGkAdDkC1xF2c-RM21RQi552k'

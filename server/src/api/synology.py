# community
from fastapi import APIRouter
from synology_api.photos import Photos

# custom
from synology.album import Album
from synology.auth import Auth
from synology.photo import Photo

HOST = "chie.kungfoo.local"
PORT = 5000
USER = "jhfoo"
PASS = "1Luvlisa!"

router = APIRouter(prefix="/synology")


@router.get("/photo/folder/list")
def getFolders():
  global HOST, PORT, USER, PASS

  photos = Photos(
    HOST,
    PORT,
    USER,
    PASS,
    secure=False,
    cert_verify=False,
    dsm_version=7,
    debug=True,
    otp_code=None,
  )

  return photos.list_folders()


@router.get("/album/{AlbumId}/photos")
def getPhotosInFolder(AlbumId: int):
  global HOST, PORT, USER, PASS

  token = Auth.getToken(HOST, PORT, USER, PASS)
  if token["success"]:
    print("Token:", token["data"]["sid"])
    session_id = token["data"]["sid"]
    print(f"SessionId: {session_id}")
    print(f"AlbumId: {AlbumId}")
    photos = Album.getPhotos(session_id, AlbumId)
    return photos
  # photos = Photos(
  #   HOST,
  #   PORT,
  #   USER,
  #   PASS,
  #   secure=False,
  #   cert_verify=False,
  #   dsm_version=7,
  #   debug=True,
  #   otp_code=None,
  # )

  # album_id = 39
  # return photos._list_item_in_folder("SYNO.Foto.Browse.Item", album_id)
  # # return photos.list_item_in_folders(album_id=FolderId)
  # return photos.list_item_in_folders(folder_id=FolderId)


@router.get("/photo/folder/{FolderId}/items")
def getItemsInFolder(FolderId: int):
  global HOST, PORT, USER, PASS

  photos = Photos(
    HOST,
    PORT,
    USER,
    PASS,
    secure=False,
    cert_verify=False,
    dsm_version=7,
    debug=True,
    otp_code=None,
  )

  return photos.list_item_in_folders(folder_id=FolderId)


@router.get("/photo/folder/{FolderId}/folders")
def getFolder(FolderId: int):
  global HOST, PORT, USER, PASS

  photos = Photos(
    HOST,
    PORT,
    USER,
    PASS,
    secure=False,
    cert_verify=False,
    dsm_version=7,
    debug=True,
    otp_code=None,
  )

  return photos.list_folders(FolderId)
  # return photos.list_item_in_folders(folder_id=FolderId)


@router.get("/photo/album/{AlbumId}/info")
def getAlbum(AlbumId: int):
  global HOST, PORT, USER, PASS

  photos = Photos(
    HOST,
    PORT,
    USER,
    PASS,
    secure=False,
    cert_verify=False,
    dsm_version=7,
    debug=True,
    otp_code=None,
  )

  return photos.get_album(AlbumId)


@router.get("/photo/album/list")
def getAlbumList():
  global HOST, PORT, USER, PASS

  token = Auth.getToken(HOST, PORT, USER, PASS)
  if token["success"]:
    print("Token:", token["data"]["sid"])
    session_id = token["data"]["sid"]
    albums = Album.getAll(session_id)
    return albums

  # photos = Photos(
  #   HOST,
  #   PORT,
  #   USER,
  #   PASS,
  #   secure=False,
  #   cert_verify=False,
  #   dsm_version=7,
  #   debug=True,
  #   otp_code=None,
  # )

  # return photos.list_albums()

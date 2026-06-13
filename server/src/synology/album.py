import requests

# --- CONFIGURATION ---
NAS_URL = "http://chie.kungfoo.local:5000"  # Your Synology NAS IP and port

session = requests.Session()


class Album:
  def __init__(self):
    pass

  @classmethod
  def getAll(cls, SessionId):
    try:
      # 2. List the Albums
      # The query uses 'SYNO.Foto.Browse.Album' for Synology Photos (DSM 7+)
      photos_url = f"{NAS_URL}/webapi/entry.cgi"
      album_payload = {
        "api": "SYNO.Foto.Browse.Album",
        "version": "1",
        "method": "list",
        "limit": "100",  # Max number of albums to return per request
        "offset": "0",
        "status": '["normal"]',  # Retrieves normal user-created albums
        "_sid": SessionId,
      }

      albums_response = session.get(photos_url, params=album_payload).json()

      if albums_response.get("success"):
        albums_list = albums_response["data"]["list"]
        return albums_list
        # print(f"Found {len(albums_list)} albums:\n")

        # for album in albums_list:
        #   # Common fields: 'id', 'name', 'item_count'
        #   print(
        #     f"• ID: {album['id']:<4} | Name: {album['name']:<40} | Items: {album['item_count']}"
        #   )
      else:
        print("Failed to fetch albums:", albums_response)

    except Exception as e:
      print(f"An error occurred: {e}")

  @classmethod
  def getPhotos(cls, SessionId, AlbumId: int):
    payload = {
      "api": "SYNO.Foto.Browse.Item",
      "version": "1",
      "method": "list",
      "offset": 0,
      "limit": 100,  # Increase limit if your album has more items
      "album_id": AlbumId,
      "additional": '["thumbnail"]',
      "_sid": SessionId,
    }

    response = session.get(f"{NAS_URL}/webapi/entry.cgi", params=payload).json()

    if not response.get("success"):
      print("Failed to list items in the album: ", response)
      return

    photos = response["data"]["list"]
    return photos
    # print(f"\n--- Found {len(photos)} photos inside the album ---")
    # for photo in photos:
    #   # Synology Photos tracks items by ID and metadata filename
    #   print(f"Photo ID: {photo['id']} | Filename: {photo['filename']}")

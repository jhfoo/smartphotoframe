# community
from fastapi import APIRouter

# custom
from api.synology import router as synology_router
from api.smartphotoframe import router as smartphotoframe_router

router = APIRouter(prefix="/api")
router.include_router(synology_router)
router.include_router(smartphotoframe_router)


@router.get("/ping")
def read_root():
  return {"Hello": "World"}


@router.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
  return {"item_id": item_id, "q": q}

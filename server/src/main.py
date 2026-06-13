# core
import asyncio

import aiohttp

# community
import requests

# custom
from api.api import router
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


def registerCors(app):
  origins = ["*"]
  app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Whitelisted origins
    allow_credentials=True,  # Support cookies and auth headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all custom request headers
  )


app = FastAPI()
registerCors(app)

app.include_router(router)


app.mount("/", StaticFiles(directory="public", html=True), name="public")

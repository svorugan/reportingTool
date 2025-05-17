from fastapi import FastAPI
from starlette.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Reporting Tool API", version="1.0")

@app.get("/health")
def health_check():
    return JSONResponse({"status": "ok"})

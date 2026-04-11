from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import sys
sys.path.append(os.path.dirname(__file__))
from attention import get_attention_patterns
from logit_lens import get_logit_lens
from activation_patch import patch_head
from circuit_discovery import discover_circuit
from model_loader import ModelLoader

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

class PromptModel(BaseModel):
    prompt: str

class PatchModel(BaseModel):
    prompt_clean: str
    prompt_corrupted: str
    layer: int
    head: int

class CircuitModel(BaseModel):
    prompt_clean: str
    prompt_corrupted: str

@app.on_event("startup")
def load_model():
    ModelLoader.get_model()

@app.post("/api/attention")
def attention_api(data: PromptModel):
    return get_attention_patterns(data.prompt)

@app.post("/api/logit_lens")
def logit_lens_api(data: PromptModel):
    return get_logit_lens(data.prompt)

@app.post("/api/patch")
def patch_api(data: PatchModel):
    return patch_head(data.prompt_clean, data.prompt_corrupted, data.layer, data.head)

@app.post("/api/circuit")
def circuit_api(data: CircuitModel):
    return discover_circuit(data.prompt_clean, data.prompt_corrupted)

@app.get("/")
def index():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")

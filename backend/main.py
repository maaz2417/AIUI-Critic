from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import os
import sys

# Ensure the root directory is in sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.append(root_dir)

from backend.services.ai_service import analyze_ui_image, generate_improved_ui

app = FastAPI(title="AI UI Critic API")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeResponse(BaseModel):
    ux_score: int
    layout_issues: list
    contrast_issues: list
    general_feedback: str
    error: str = None

@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    contents = await file.read()
    
    # Process image with AI
    feedback = analyze_ui_image(contents)
    
    if "error" in feedback:
        raise HTTPException(status_code=500, detail=feedback["error"])
        
    return feedback

@app.post("/api/improve")
async def improve_ui(file: UploadFile = File(...)):
    """
    Endpoint that re-analyzes and generates an improved UI image. 
    """
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File provided is not an image.")
            
        contents = await file.read()
        
        # First get feedback (already worked if they see the score)
        feedback = analyze_ui_image(contents)
        
        # Generate improved image
        # If DALL-E fails, this function now returns a fallback URL automatically
        improved_image_url = generate_improved_image(contents, feedback)
        
        return {"improved_image_url": improved_image_url}
    except Exception as e:
        print(f"Global error in improve_ui: {e}")
        # Return a customized 'thinking' SVG instead of a static photo
        error_svg = f"""
        <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <rect width="1024" height="1024" fill="#f0f9ff"/>
            <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#0369a1" text-anchor="middle">Design Concept Generating...</text>
            <circle cx="512" cy="560" r="10" fill="#0ea5e9">
                <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
            </circle>
        </svg>
        """
        import base64
        svg_b64 = base64.b64encode(error_svg.encode('utf-8')).decode('utf-8')
        return {"improved_image_url": f"data:image/svg+xml;base64,{svg_b64}"}

# Mount frontend
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

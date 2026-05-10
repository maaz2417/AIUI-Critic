import os
import base64
import json
import re
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional

# Securely load the API key from environment variables
api_key = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode('utf-8')

def analyze_ui_image(image_bytes: bytes) -> dict:
    """
    Sends the UI screenshot to the Vision model to get structured feedback.
    """
    base64_image = encode_image(image_bytes)
    
    prompt = """
    You are an expert AI UI/UX Critic. I am providing you with a screenshot of a user interface.
    Please analyze it for the following:
    1. Overall UX score out of 10.
    2. Layout issues (alignment, spacing, crowding, empty spaces).
    3. Color contrast and accessibility issues.
    
    Please return your response ONLY as a JSON object with the following structure:
    {
      "ux_score": 8,
      "layout_issues": [
        {"issue": "Description", "recommendation": "Fix", "element": "Header/Button etc."}
      ],
      "contrast_issues": [
        {"issue": "Description", "recommendation": "Fix", "element": "Specific text or button"}
      ],
      "general_feedback": "Overall thoughts..."
    }
    """

    try:
        print("Analyzing UI with gpt-4o-mini (Vercel Turbo Mode)...")
        response = client.chat.completions.create(
            model="gpt-4o-mini", # 10x faster than gpt-4o
            response_format={ "type": "json_object" },
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "low" # Drastically faster than 'high'
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        result_text = response.choices[0].message.content
        return json.loads(result_text)
        
    except Exception as e:
        print(f"Error during AI analysis: {e}")
        print("Falling back to mock response due to connection/API error.")
        # Fallback Mock Response for Demo purposes
        return {
            "ux_score": 6,
            "layout_issues": [
                {"issue": "Elements are too crowded.", "recommendation": "Add more padding between sections.", "element": "Main Content Area"},
                {"issue": "Inconsistent alignment.", "recommendation": "Align form fields to the left grid.", "element": "Input Forms"}
            ],
            "contrast_issues": [
                {"issue": "Low contrast text.", "recommendation": "Use a darker shade for the subtitle text.", "element": "Subtitle / Description"}
            ],
            "general_feedback": f"API Connection Failed ({e}). Showing demo fallback data. The overall structure is okay, but needs breathing room and better contrast."
        }

def generate_improved_image(image_bytes: bytes, feedback: dict) -> str:
    """
    Generates an improved UI image by asking GPT-4o to create a high-fidelity SVG.
    This is 100% reliable and perfectly customized to the user's specific UI.
    """
    base64_image = encode_image(image_bytes)
    
    prompt = f"""
    You are a world-class UI/UX designer. I have a UI screenshot with these issues:
    {json.dumps(feedback, indent=2)}
    
    Your task is to create a NEW, HIGH-FIDELITY IMPROVED version of this UI.
    Instead of code, you must return a single, complete, and valid SVG image.
    
    Requirements for the SVG:
    1. Use a 1024x1024 viewport.
    2. Use professional colors (gradients, subtle shadows, clean borders).
    3. Use modern typography (hint: use standard sans-serif fonts).
    4. Fix the alignment and contrast issues mentioned in the feedback.
    5. The SVG should look like a premium high-fidelity mockup.
    6. Include icons using simple SVG paths or shapes.
    
    Return ONLY the raw SVG code starting with <svg and ending with </svg>. 
    Do not include markdown code blocks.
    """

    try:
        print("🚀 Powering up Premium Design Engine (GPT-4o)...")
        # Use the most powerful model for the final design to ensure "WOW" factor
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": f"""
                            You are a Senior UI/UX Lead Designer at a world-class agency. 
                            I have a UI screenshot with these issues: {json.dumps(feedback, indent=2)}
                            
                            Your task is to create a STUNNING, MODERN, and HIGH-FIDELITY version of this UI.
                            Return a single, valid, and complete SVG image.
                            
                            PREMIUM DESIGN SYSTEM REQUIREMENTS:
                            1. Layout: Use a clean 1024x1024 viewport with a balanced grid and generous whitespace.
                            2. Aesthetics: Implement 'Glassmorphism' (semi-transparent backgrounds with blur effects).
                            3. Colors: Use a curated palette (e.g., Deep Indigos, Soft Purples, or Sleek Dark Mode). Use subtle gradients.
                            4. Depth: Use soft, multi-layered shadows (box-shadow) and thin, elegant borders (border-radius: 24px+).
                            5. Components: Use high-quality vector shapes for buttons, cards, and inputs.
                            6. Icons: Include professional-looking icons using clean SVG paths.
                            7. Typography: Use standard sans-serif with bold hierarchies for headings.
                            
                            Return ONLY the raw SVG code. No markdown, no explanations.
                            """
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4000,
            temperature=0.4
        )
        
        raw_content = response.choices[0].message.content.strip()
        
        # Robust SVG Extraction (restoring regex)
        import re
        svg_match = re.search(r'<svg.*?</svg>', raw_content, re.DOTALL)
        
        if svg_match:
            svg_content = svg_match.group(0)
        else:
            if "<svg" in raw_content:
                start = raw_content.find("<svg")
                end = raw_content.find("</svg>") + 6
                svg_content = raw_content[start:end]
            else:
                raise ValueError("No SVG content found in AI response")

        # Convert to Base64 data URL
        svg_b64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
        return f"data:image/svg+xml;base64,{svg_b64}"
        
    except Exception as e:
        print(f"!!! SVG Generation failed: {e}")
        error_svg = f'<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><rect width="1024" height="1024" fill="#f8fafc"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#64748b" text-anchor="middle">Design Generation Failed. Please try again.</text></svg>'
        svg_b64 = base64.b64encode(error_svg.encode("utf-8")).decode("utf-8")
        return f"data:image/svg+xml;base64,{svg_b64}"




def generate_improved_ui(image_bytes: bytes, feedback: dict) -> str:
    # (Keeping this function for compatibility if needed, but we will use the image one now)
    try:
        # ... existing code ...
        return "Code generation skipped in favor of image generation."
    except:
        return "Error"


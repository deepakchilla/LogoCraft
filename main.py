from fastapi import FastAPI, Form
import openai
import os
from fastapi.responses import JSONResponse

app = FastAPI()

# Set your OpenAI API Key
openai.api_key = ""

@app.post("/generate-logo/")
async def generate_logo(prompt: str = Form(...)):
    try:
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"
        )
        image_url = response["data"][0]["url"]
        return JSONResponse(content={"image_url": image_url})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Run the server using: uvicorn main:app --reload

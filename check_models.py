import google.generativeai as genai

# Using the key from your app.py which appears to be a placeholder.
# If this script fails, it confirms the key is invalid.
genai.configure(api_key="AIzaSyAlEevATIgiwTeifYbWaMrnmvpb_ngR2qQ")

print("Checking available models...")
try:
    for m in genai.list_models():
        # We only want models that can "generateContent" (chat/images)
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error: {e}")

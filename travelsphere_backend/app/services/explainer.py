import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-3.6-flash")

def generate_explanation(result: dict, travelers: dict, destinations: dict) -> str:
    if not result.get("chosen"):
        return "No destination could satisfy every traveler's budget and dates. Consider relaxing one constraint."

    chosen = result["chosen"]
    prompt = f"""You are explaining a group trip planning decision to a group of friends.

The system chose: {chosen}
Cost: {result['cost']}
Group interest match score: {result['match_score']} (out of {len(travelers)} travelers)

Traveler details: {travelers}
All destination options considered: {destinations}

In 2-3 friendly sentences, explain why {chosen} was chosen for this group, mentioning
any budget or date constraints that ruled out other options. Be specific and warm, like
you're texting the group chat."""

    response = model.generate_content(prompt)
    return response.text
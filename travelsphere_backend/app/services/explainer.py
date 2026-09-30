from google import genai

from app.core.config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


def generate_explanation(
    result: dict,
    travelers: dict,
    destinations: dict,
) -> str:
    if not result.get("chosen"):
        return (
            "No destination could satisfy every traveler's "
            "budget and dates. Consider relaxing one constraint."
        )

    chosen = result["chosen"]

    prompt = f"""You are explaining a group trip planning decision to a group of friends.

The system chose: {chosen}
Cost: {result['cost']}
Group interest match score: {result['match_score']} (out of {len(travelers)} travelers)

Traveler details: {travelers}
All destination options considered: {destinations}

In 2-3 friendly sentences, explain why {chosen} was chosen for this group,
mentioning any budget or date constraints that ruled out other options.
Be specific and warm, like you're texting the group chat."""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text or "The destination was selected based on the group constraints."
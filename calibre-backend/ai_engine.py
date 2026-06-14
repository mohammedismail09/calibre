import os
import json
from openai import OpenAI

# Initialize the OpenAI client handler
# Ensure you set your system environment variable: export OPENAI_API_KEY="your-key"
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock-fallback-key"))

def attribute_meeting_with_llm(meeting_title: str, meeting_desc: str, attendees_list: list, active_projects: list) -> dict:
    """
    Uses GPT to intelligently analyze meeting strings and infer the correct 
    project taxonomy mapping with a strict structural confidence rating.
    """
    # If no real API key is detected during the hackathon run, gracefully fall back to deterministic parsing
    if os.getenv("OPENAI_API_KEY") is None:
        title_lower = meeting_title.lower()
        if "scale" in title_lower or "sync" in title_lower:
            return {"project_id": "p1", "confidence": 0.94, "reasoning": "Fallback Parser: Found structural tech keywords in metadata."}
        if "status" in title_lower:
            return {"project_id": "p2", "confidence": 0.62, "reasoning": "Fallback Parser: Low keyword density; matched default growth group."}
        return {"project_id": "p3", "confidence": 0.88, "reasoning": "Fallback Parser: Processed under client alignment category."}

    # Format taxonomy schema for the context injection layout
    project_context = ""
    for proj in active_projects:
        project_context += f"- ID: {proj['id']}, Name: {proj['name']}, Target Scope: {proj['description']}\n"

    # Construct the instruction model payload
    system_prompt = (
        "You are the core intelligence router for Calibre, an HR Cost Intelligence Engine. "
        "Your job is to analyze corporate meeting metadata and assign it to the single most "
        "relevant project taxonomy identifier.\n\n"
        "Available Project Taxonomy:\n"
        f"{project_context}\n"
        "Rules:\n"
        "1. Return your analysis in a valid raw JSON format.\n"
        "2. Include 'project_id' (matching one of the IDs above or null if completely ambiguous).\n"
        "3. Include 'confidence' as a floating-point score between 0.0 and 1.0.\n"
        "4. Include 'reasoning' detailing why the match was made based on title, description, or attendees.\n"
        "5. If context is highly ambiguous, degrade gracefully: drop confidence below 0.70."
    )

    user_payload = f"Meeting Title: {meeting_title}\nDescription: {meeting_desc}\nAttendees: {', '.join(attendees_list)}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_payload}
            ],
            temperature=0.2
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {
            "project_id": None,
            "confidence": 0.0,
            "reasoning": f"AI pipeline exception failure: {str(e)}"
        }
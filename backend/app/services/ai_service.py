import json
import re
import logging
from typing import Dict, Any
import httpx

from app.core.config import settings
from app.schemas.ai import CampaignGenerationRequest, CampaignGenerationResponse, ContentRefinementRequest

logger = logging.getLogger(__name__)


class AIService:
    """
    Service integrating with Google Gemini 2.5 Flash API for structured JSON campaign generation.
    """

    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL_NAME or "gemini-2.5-flash"

    def _sanitize_json_output(self, raw_text: str) -> str:
        """
        Strip markdown code fences (e.g. ```json ... ```) from Gemini response.
        """
        cleaned = raw_text.strip()
        # Remove ```json or ``` at beginning
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        # Remove ``` at end
        cleaned = re.sub(r"\s*```$", "", cleaned)
        return cleaned.strip()

    async def generate_campaign_plan(
        self, request: CampaignGenerationRequest
    ) -> CampaignGenerationResponse:
        """
        Generate complete AI marketing campaign using Gemini 2.5 Flash API.
        Enforces structured JSON output without markdown.
        """
        if not self.api_key or self.api_key in ["mock-gemini-api-key", "your-gemini-api-key", ""]:
            logger.warning("Gemini API key missing or unconfigured. Using structured AI fallback.")
            return self._generate_fallback_campaign(request)

        prompt = f"""You are a professional digital marketing strategist.

Generate a marketing campaign.

Return ONLY JSON.

Schema

{{
"buyer_persona":"Single paragraph string describing target persona",
"marketing_strategy":"Single paragraph string describing strategy",
"google_ads":[],
"facebook_ads":[],
"instagram_ads":[],
"linkedin_ads":[],
"keywords":[],
"hashtags":[],
"budget_breakdown":{{
"google":"35%",
"facebook":"25%",
"instagram":"20%",
"linkedin":"20%"
}}
}}

Product

{request.product_description}

Industry

{request.industry or 'Technology & SaaS'}

Audience

{request.target_audience or 'B2B Decision Makers'}

Budget

{request.budget or '₹2,00,000 - ₹10,00,000 / month'}

Goal

{request.goal or 'Lead Generation'}

Tone

{request.tone or 'Professional'}

No markdown.

No explanation.

Only JSON."""

        endpoint_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.7,
                "maxOutputTokens": 4096
            }
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(endpoint_url, json=payload)

            if response.status_code != 200:
                logger.error(f"Gemini API returned error status {response.status_code}: {response.text}")
                return self._generate_fallback_campaign(request)

            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if not candidates:
                logger.error("Gemini API response contained no candidates.")
                return self._generate_fallback_campaign(request)

            raw_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            sanitized_json = self._sanitize_json_output(raw_content)

            parsed_dict = json.loads(sanitized_json)

            raw_persona = parsed_dict.get("buyer_persona") or parsed_dict.get("persona") or "Target Buyer Persona"
            if isinstance(raw_persona, dict):
                buyer_persona = raw_persona.get("description") or raw_persona.get("summary") or json.dumps(raw_persona)
            else:
                buyer_persona = str(raw_persona)

            raw_strat = parsed_dict.get("marketing_strategy") or "Strategic marketing execution plan"
            if isinstance(raw_strat, dict):
                marketing_strategy = raw_strat.get("description") or raw_strat.get("summary") or json.dumps(raw_strat)
            else:
                marketing_strategy = str(raw_strat)

            return CampaignGenerationResponse(
                buyer_persona=buyer_persona,
                persona=buyer_persona,
                marketing_strategy=marketing_strategy,
                google_ads=parsed_dict.get("google_ads", []),
                facebook_ads=parsed_dict.get("facebook_ads", []),
                instagram_ads=parsed_dict.get("instagram_ads", []),
                linkedin_ads=parsed_dict.get("linkedin_ads", []),
                keywords=parsed_dict.get("keywords", []),
                hashtags=parsed_dict.get("hashtags", []),
                budget_breakdown=parsed_dict.get("budget_breakdown", {
                    "google": "35%",
                    "facebook": "25%",
                    "instagram": "20%",
                    "linkedin": "20%"
                }),
                status="completed"
            )
        except Exception as e:
            logger.error(f"Failed to generate campaign via Gemini API: {str(e)}", exc_info=True)
            return self._generate_fallback_campaign(request)

    async def refine_content_piece(
        self, request: ContentRefinementRequest
    ) -> Dict[str, Any]:
        """
        Refine or rewrite specific campaign copy using Gemini 2.5 Flash API.
        """
        if not self.api_key or self.api_key in ["mock-gemini-api-key", "your-gemini-api-key", ""]:
            return {"refined_text": f"[AI Refined]: {request.current_text} ({request.instructions})"}

        prompt = f"""You are a professional digital marketing strategist.

Refine the following copy:

Instructions: {request.instructions}
Channel: {request.channel}

Original Copy:
{request.current_text}

Return ONLY raw JSON with schema {{"refined_text": ""}}. No markdown. No explanation."""

        endpoint_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json", "temperature": 0.7}
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(endpoint_url, json=payload)
            if response.status_code == 200:
                res_data = response.json()
                raw_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
                sanitized = self._sanitize_json_output(raw_text)
                return json.loads(sanitized)
        except Exception as e:
            logger.error(f"Failed to refine content via Gemini API: {str(e)}")

        return {"refined_text": f"{request.current_text} (Refined according to: {request.instructions})"}

    def _generate_fallback_campaign(
        self, request: CampaignGenerationRequest
    ) -> CampaignGenerationResponse:
        """
        Fallback structured campaign payload matching exact requested JSON schema.
        """
        industry = request.industry or "Technology"
        product = request.product_name or "Campaign Product"
        audience = request.target_audience or "Decision Makers"

        persona_str = f"Target Buyer Persona for {industry}: {audience}. Motivated by high ROI, rapid campaign generation, and operational efficiency."
        strategy_str = f"Core Strategy for {product}: Position as the premier autonomous campaign planner for {industry}. Focus on AI velocity and multi-channel consistency."

        return CampaignGenerationResponse(
            buyer_persona=persona_str,
            persona=persona_str,
            marketing_strategy=strategy_str,
            google_ads=[
                {
                    "headline": f"Top {industry} AI Marketing Suite",
                    "description": f"Supercharge campaigns with {product}. Launch in seconds.",
                    "call_to_action": "Start Free Trial"
                }
            ],
            facebook_ads=[
                {
                    "primary_text": f"Stop manual marketing campaign bottlenecks. {product} generates complete strategies, ad copy, and keywords automatically.",
                    "headline": f"Scale Your {industry} Growth Fast",
                    "call_to_action": "Sign Up Free"
                }
            ],
            instagram_ads=[
                {
                    "caption": f"Automate your marketing workflow with AI precision 🚀. Try {product} today!",
                    "visual_concept": "Sleek dark mode dashboard graphics.",
                    "call_to_action": "Tap Link in Bio"
                }
            ],
            linkedin_ads=[
                {
                    "post_text": f"High-performing B2B marketing teams rely on {product} to streamline cross-channel messaging and buyer persona analysis.",
                    "headline": f"Enterprise Campaign Planning for {industry}",
                    "call_to_action": "Request Demo"
                }
            ],
            keywords=[
                f"{industry.lower()} marketing strategy",
                "ai campaign planner",
                "gemini flash marketing",
                "b2b lead generation"
            ],
            hashtags=[
                "#AIMarketing",
                "#GrowthHacking",
                f"#{industry.replace(' ', '').replace('&', 'And')}",
                "#CampaignMind"
            ],
            budget_breakdown={
                "google": "35%",
                "facebook": "25%",
                "instagram": "20%",
                "linkedin": "20%"
            },
            status="completed"
        )


ai_service = AIService()

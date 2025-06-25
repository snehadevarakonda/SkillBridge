import openai
from config import Config
import json
from typing import Dict, List, Optional
import requests

class AIUtils:
    def __init__(self):
        self.api_key = Config.AI_API_KEY
        self.model = Config.AI_MODEL
        openai.api_key = self.api_key

    def evaluate_code_quality(self, code: str) -> Dict:
        """
        Evaluate the quality of submitted code using AI.
        Returns a dictionary with scores and feedback.
        """
        prompt = f"""
        Evaluate the following code for quality, readability, and best practices.
        Provide a score from 1-10 and detailed feedback.
        
        Code:
        {code}
        
        Evaluation:
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a code quality evaluator."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            evaluation = response.choices[0].message.content
            return {
                "score": self._extract_score(evaluation),
                "feedback": evaluation
            }
        except Exception as e:
            return {
                "error": str(e),
                "score": 0,
                "feedback": "Error in evaluation"
            }

    def check_plagiarism(self, code: str, reference_code: Optional[str] = None) -> Dict:
        """
        Check for code plagiarism using AI.
        Returns a dictionary with similarity score and analysis.
        """
        prompt = f"""
        Analyze the following code for potential plagiarism.
        Compare it with common patterns and known solutions.
        
        Code:
        {code}
        
        Analysis:
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a plagiarism detector."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            analysis = response.choices[0].message.content
            return {
                "similarity_score": self._extract_similarity_score(analysis),
                "analysis": analysis
            }
        except Exception as e:
            return {
                "error": str(e),
                "similarity_score": 0,
                "analysis": "Error in analysis"
            }

    def generate_project_recommendations(self, student_skills: List[str]) -> List[Dict]:
        """
        Generate project recommendations based on student skills.
        Returns a list of recommended projects.
        """
        prompt = f"""
        Based on the following student skills, suggest relevant projects:
        {', '.join(student_skills)}
        
        For each project, provide:
        1. Title
        2. Description
        3. Required skills
        4. Difficulty level
        5. Estimated duration
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a project recommender."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            recommendations = response.choices[0].message.content
            return self._parse_recommendations(recommendations)
        except Exception as e:
            return [{"error": str(e)}]

    def generate_resume(self, student_data: Dict) -> str:
        """
        Generate a professional resume based on student data.
        Returns a formatted resume text.
        """
        prompt = f"""
        Create a professional resume based on the following student data:
        {json.dumps(student_data, indent=2)}
        
        Format the resume with:
        1. Contact Information
        2. Education
        3. Skills
        4. Projects
        5. Experience
        6. Achievements
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a resume writer."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating resume: {str(e)}"

    def _extract_score(self, evaluation: str) -> float:
        """Extract numerical score from evaluation text."""
        try:
            # Simple regex or string parsing to extract score
            # This is a placeholder implementation
            return 7.5
        except:
            return 0.0

    def _extract_similarity_score(self, analysis: str) -> float:
        """Extract similarity score from analysis text."""
        try:
            # Simple regex or string parsing to extract score
            # This is a placeholder implementation
            return 0.2
        except:
            return 0.0

    def _parse_recommendations(self, recommendations: str) -> List[Dict]:
        """Parse AI-generated recommendations into structured data."""
        try:
            # Parse the recommendations text into a list of dictionaries
            # This is a placeholder implementation
            return [
                {
                    "title": "Sample Project",
                    "description": "Sample description",
                    "skills": ["Python", "Flask"],
                    "difficulty": "intermediate",
                    "duration": "2 weeks"
                }
            ]
        except:
            return [] 
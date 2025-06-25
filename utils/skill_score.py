from typing import Dict, List, Optional
from datetime import datetime
from config import Config

class SkillScoreCalculator:
    def __init__(self):
        self.score_ranges = Config.SKILL_SCORE_RANGES

    def calculate_skill_score(self, 
                            project_difficulty: str,
                            completion_time: float,
                            deadline_met: bool,
                            code_quality_score: float,
                            peer_reviews: List[Dict],
                            plagiarism_score: float) -> Dict:
        """
        Calculate the skill score based on various factors.
        
        Args:
            project_difficulty: 'beginner', 'intermediate', or 'advanced'
            completion_time: Time taken to complete in days
            deadline_met: Whether the deadline was met
            code_quality_score: Score from 0-10
            peer_reviews: List of review dictionaries with 'rating' and 'weight'
            plagiarism_score: Score from 0-1 (lower is better)
            
        Returns:
            Dictionary containing the final score and category
        """
        # Base score based on project difficulty
        base_scores = {
            'beginner': 30,
            'intermediate': 60,
            'advanced': 90
        }
        base_score = base_scores.get(project_difficulty, 30)

        # Time factor (penalize for taking too long)
        time_factor = 1.0
        if not deadline_met:
            time_factor = 0.8
        elif completion_time > 7:  # More than a week
            time_factor = 0.9

        # Code quality factor
        code_quality_factor = code_quality_score / 10

        # Peer review factor
        review_score = self._calculate_review_score(peer_reviews)

        # Plagiarism factor
        plagiarism_factor = 1.0 - plagiarism_score

        # Calculate final score
        final_score = (
            base_score * 0.4 +  # Base score weight
            (base_score * time_factor) * 0.2 +  # Time factor weight
            (base_score * code_quality_factor) * 0.2 +  # Code quality weight
            (base_score * review_score) * 0.15 +  # Peer review weight
            (base_score * plagiarism_factor) * 0.05  # Plagiarism weight
        )

        # Ensure score is within valid range
        final_score = max(0, min(100, final_score))

        # Determine category
        category = self._determine_category(final_score)

        return {
            'score': round(final_score, 2),
            'category': category,
            'factors': {
                'base_score': base_score,
                'time_factor': time_factor,
                'code_quality_factor': code_quality_factor,
                'review_score': review_score,
                'plagiarism_factor': plagiarism_factor
            }
        }

    def _calculate_review_score(self, reviews: List[Dict]) -> float:
        """Calculate weighted average of peer reviews."""
        if not reviews:
            return 0.5  # Default to neutral if no reviews

        total_weight = sum(review.get('weight', 1) for review in reviews)
        if total_weight == 0:
            return 0.5

        weighted_sum = sum(
            review.get('rating', 5) * review.get('weight', 1)
            for review in reviews
        )
        
        return weighted_sum / (total_weight * 5)  # Normalize to 0-1

    def _determine_category(self, score: float) -> str:
        """Determine skill category based on score."""
        for category, (min_score, max_score) in self.score_ranges.items():
            if min_score <= score <= max_score:
                return category
        return 'beginner'

    def calculate_score_increase(self, 
                               current_score: float,
                               new_score: float,
                               time_since_last_update: float) -> float:
        """
        Calculate the increase in skill score, considering time decay.
        
        Args:
            current_score: Current skill score
            new_score: Newly calculated score
            time_since_last_update: Days since last score update
            
        Returns:
            Final score after applying time decay
        """
        # Time decay factor (scores decay over time)
        decay_factor = 0.99 ** (time_since_last_update / 30)  # Monthly decay
        
        # Calculate decayed current score
        decayed_score = current_score * decay_factor
        
        # Calculate weighted average
        time_weight = min(1.0, time_since_last_update / 90)  # Cap at 3 months
        final_score = (decayed_score * (1 - time_weight) + 
                      new_score * time_weight)
        
        return round(final_score, 2)

    def get_skill_level_requirements(self, category: str) -> Dict:
        """Get requirements for each skill level category."""
        requirements = {
            'beginner': {
                'min_projects': 1,
                'min_score': 0,
                'max_score': 30,
                'description': 'Basic understanding and implementation'
            },
            'intermediate': {
                'min_projects': 3,
                'min_score': 31,
                'max_score': 70,
                'description': 'Proficient implementation and problem-solving'
            },
            'expert': {
                'min_projects': 5,
                'min_score': 71,
                'max_score': 100,
                'description': 'Advanced implementation and innovation'
            }
        }
        return requirements.get(category, requirements['beginner'])

    def calculate_project_difficulty(self,
                                   complexity: int,
                                   scope: int,
                                   technical_requirements: List[str]) -> str:
        """
        Calculate project difficulty based on various factors.
        
        Args:
            complexity: 1-5 scale
            scope: 1-5 scale
            technical_requirements: List of required technologies/skills
            
        Returns:
            'beginner', 'intermediate', or 'advanced'
        """
        # Calculate base difficulty
        base_difficulty = (complexity + scope) / 2
        
        # Adjust for technical requirements
        tech_factor = len(technical_requirements) / 5  # Normalize to 0-1
        
        # Calculate final difficulty
        final_difficulty = base_difficulty * (1 + tech_factor)
        
        # Determine category
        if final_difficulty <= 2:
            return 'beginner'
        elif final_difficulty <= 4:
            return 'intermediate'
        else:
            return 'advanced' 
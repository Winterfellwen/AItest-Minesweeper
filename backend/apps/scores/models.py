from django.db import models
from apps.users.models import UserProfile


class Difficulty(models.TextChoices):
    EASY = "easy", "Easy 9x9"
    MEDIUM = "medium", "Medium 16x16"
    HARD = "hard", "Hard 16x30"


class ScoreEntry(models.Model):
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="scores"
    )
    difficulty = models.CharField(
        max_length=10, choices=Difficulty.choices, db_index=True
    )
    score = models.IntegerField()
    time_seconds = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["difficulty", "-score"]),
            models.Index(fields=["user", "difficulty", "-score"]),
        ]

    def __str__(self):
        return f"{self.user.nickname} - {self.difficulty}: {self.score}"

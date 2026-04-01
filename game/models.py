from django.db import models
from django.contrib.auth.models import User


class GameScore(models.Model):
    """Model to store game scores (optional)."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField()
    difficulty = models.CharField(max_length=20, default='beginner')
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.score}"

    class Meta:
        ordering = ['-score']
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ScoreEntry
from .serializers import ScoreEntrySerializer, ScoreSubmitSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_score(request):
    serializer = ScoreSubmitSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    difficulty = serializer.validated_data["difficulty"]
    time_seconds = serializer.validated_data["time_seconds"]
    score = max(0, int(10000 - time_seconds * 100))

    ScoreEntry.objects.create(
        user=request.user,
        difficulty=difficulty,
        score=score,
        time_seconds=time_seconds,
    )

    rank = (
        ScoreEntry.objects.filter(difficulty=difficulty, score__gt=score).count() + 1
    )

    return Response(
        {"rank": rank, "score": score, "message": "Score submitted"},
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def leaderboard(request):
    difficulty = request.GET.get("difficulty", "easy")
    limit = int(request.GET.get("limit", 50))

    entries = list(
        ScoreEntry.objects.filter(difficulty=difficulty)
        .order_by("-score", "time_seconds", "created_at")[:limit]
    )

    my_rank = None
    rank = 0
    serialized = []
    for i, entry in enumerate(entries, 1):
        rank = i
        serialized.append(
            {
                "rank": rank,
                "user_nickname": entry.user.nickname,
                "user_avatar": entry.user.avatar_url,
                "score": entry.score,
                "time_seconds": entry.time_seconds,
                "created_at": entry.created_at.isoformat(),
            }
        )
        if hasattr(request, "user") and request.user.is_authenticated:
            if entry.user_id == request.user.id and my_rank is None:
                my_rank = rank

    return Response({"my_rank": my_rank, "scores": serialized})

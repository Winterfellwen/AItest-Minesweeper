from django.shortcuts import render
from django.http import JsonResponse
import json
import random


def index(request):
    """Render the main game page."""
    return render(request, 'game/index.html')


def new_board(request):
    """
    Generate a new Minesweeper board.
    Expected GET parameters: width, height, mines (all integers).
    Returns JSON: {board: [[cell, ...], ...], width, height}
    Each cell is either -1 for mine or a number (0-8) for adjacent mine count.
    """
    try:
        width = int(request.GET.get('width', 10))
        height = int(request.GET.get('height', 10))
        mines = int(request.GET.get('mines', 10))
    except ValueError:
        return JsonResponse({'error': 'Invalid parameters'}, status=400)

    if mines >= width * height:
        return JsonResponse({'error': 'Too many mines'}, status=400)

    # Initialize empty board
    board = [[0 for _ in range(width)] for _ in range(height)]

    # Place mines randomly
    mines_placed = 0
    while mines_placed < mines:
        x = random.randrange(width)
        y = random.randrange(height)
        if board[y][x] != -1:
            board[y][x] = -1
            mines_placed += 1

    # Compute numbers
    for y in range(height):
        for x in range(width):
            if board[y][x] == -1:
                continue
            count = 0
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if dy == 0 and dx == 0:
                        continue
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < height and 0 <= nx < width:
                        if board[ny][nx] == -1:
                            count += 1
            board[y][x] = count

    return JsonResponse({
        'board': board,
        'width': width,
        'height': height
    })


# Optional: save score (requires authentication if you want to tie to user)
def save_score(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    try:
        data = json.loads(request.body)
        score = int(data.get('score', 0))
        difficulty = data.get('difficulty', 'beginner')
    except (ValueError, json.JSONDecodeError):
        return JsonResponse({'error': 'Invalid data'}, status=400)

    # If you have user authentication, you can associate with request.user
    # For simplicity, we'll create an anonymous score (user=None)
    from .models import GameScore
    GameScore.objects.create(score=score, difficulty=difficulty, user=None)
    return JsonResponse({'status': 'saved'})
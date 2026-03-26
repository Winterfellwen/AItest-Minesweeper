from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('new_board/', views.new_board, name='new_board'),
    path('save_score/', views.save_score, name='save_score'),
]
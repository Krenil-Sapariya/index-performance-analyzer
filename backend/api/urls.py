# backend/api/urls.py
from django.urls import path
from .views import post

urlpatterns = [
    path('analyze/', post, name='analyze'),
]

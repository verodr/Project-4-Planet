
from django.urls import path 
from .views import ContentListView, ContentDetailView, ContentLatestView

urlpatterns = [
    path('', ContentListView.as_view()),
    path('<int:pk>/', ContentDetailView.as_view()),
    path('latest/', ContentLatestView.as_view())
]
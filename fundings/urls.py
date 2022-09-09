from django.urls import path
from .views import FundingListView, FundingDetailView

urlpatterns = [
    path('', FundingListView.as_view()),
    path('<int:pk>/', FundingDetailView.as_view())
]
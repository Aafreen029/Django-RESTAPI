from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, MessageViewSet,index_view, room_view


router = DefaultRouter()
router.register(r'chatrooms', ChatRoomViewSet, basename='chatroom')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('ui/', index_view, name='chat-index'),  # HTML view
    path('ui/<str:room_name>/', room_view, name='chat-room'),  # HTML view
]


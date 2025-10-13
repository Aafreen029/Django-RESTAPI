from rest_framework import viewsets, permissions
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from django.shortcuts import render

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-timestamp')
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        after = self.request.query_params.get('after')
        qs = Message.objects.filter(room_id=room_id)
        if after:
            qs = qs.filter(timestamp__gt=after)
        return qs.order_by('timestamp')

def index_view(request):
    return render(request, 'index.html', {
        'rooms': ChatRoom.objects.all(),
    })

def room_view(request, room_name):
    chat_room, created = ChatRoom.objects.get_or_create(name=room_name)
    return render(request, 'room.html', {
        'room': chat_room,
    })


from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import SchemeAlert
from .serializers import SchemeAlertSerializer

class AlertListView(generics.ListAPIView):
    """
    List verified government alerts and deadlines.
    Filters:
    - state: Filter by farmer state (or national alerts)
    - urgent: 'true' to get urgent deadlines only
    - type: 'deadline', 'announcement', etc.
    """
    permission_classes = [AllowAny]
    serializer_class = SchemeAlertSerializer

    def get_queryset(self):
        queryset = SchemeAlert.objects.all().select_related('scheme')
        
        state = self.request.query_params.get('state', '').strip()
        urgent = self.request.query_params.get('urgent', '').strip().lower()
        alert_type = self.request.query_params.get('type', '').strip()

        if state and state.lower() != 'all':
            queryset = queryset.filter(Q(state='') | Q(state__iexact=state))

        if urgent in ('true', '1', 'yes'):
            queryset = queryset.filter(is_urgent=True)

        if alert_type:
            queryset = queryset.filter(alert_type=alert_type)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'count': queryset.count(),
            'alerts': serializer.data
        })

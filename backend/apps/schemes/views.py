from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Scheme
from .serializers import SchemeListSerializer, SchemeDetailSerializer

class SchemeListView(generics.ListAPIView):
    """
    Search and filter verified government schemes.
    Supports query parameters:
    - q: Text search in name, benefits, description
    - state: Filter by state applicability (e.g., 'Maharashtra' or 'All India')
    - category: Filter by scheme category
    - crop: Filter by cultivated crop
    - type: 'central' or 'state'
    """
    permission_classes = [AllowAny]
    serializer_class = SchemeListSerializer

    def get_queryset(self):
        queryset = Scheme.objects.all().prefetch_related('rules', 'required_documents')
        
        q = self.request.query_params.get('q', '').strip()
        state = self.request.query_params.get('state', '').strip()
        category = self.request.query_params.get('category', '').strip()
        crop = self.request.query_params.get('crop', '').strip()
        scheme_type = self.request.query_params.get('type', '').strip().lower()

        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(category__icontains=q) |
                Q(benefits_amount__icontains=q)
            )

        if state and state.lower() != 'all india' and state.lower() != 'all':
            # Check if scheme covers "All India" or the specific state
            # In SQLite JSONField, we can filter contains or iterate
            queryset = queryset.filter(
                Q(state_coverage__icontains='All India') |
                Q(state_coverage__icontains=state)
            )

        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)

        if crop and crop.lower() != 'all':
            queryset = queryset.filter(
                Q(crop_coverage__icontains='All Crops') |
                Q(crop_coverage__icontains=crop)
            )

        if scheme_type in ('central', 'state', 'ut'):
            queryset = queryset.filter(scheme_type=scheme_type)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'count': queryset.count(),
            'schemes': serializer.data
        })

class SchemeDetailView(generics.RetrieveAPIView):
    """Retrieve full details of a specific scheme including rules and documents"""
    permission_classes = [AllowAny]
    serializer_class = SchemeDetailSerializer
    queryset = Scheme.objects.all().prefetch_related('rules', 'required_documents')
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'scheme': serializer.data
        })

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SavedScheme, ApplicationDraft
from .serializers import SavedSchemeSerializer, ApplicationDraftSerializer
from apps.schemes.models import Scheme

class SavedSchemesListView(APIView):
    """Retrieve all bookmarked schemes for the authenticated farmer"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved = SavedScheme.objects.filter(user=request.user).select_related('scheme')
        serializer = SavedSchemeSerializer(saved, many=True)
        scheme_ids = [s.scheme_id for s in saved]
        return Response({
            'success': True,
            'saved_schemes': serializer.data,
            'scheme_ids': scheme_ids
        })

class ToggleSaveSchemeView(APIView):
    """Bookmark or un-bookmark a scheme for the authenticated farmer"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        scheme_id = request.data.get('scheme_id')
        if not scheme_id:
            return Response({'success': False, 'error': 'scheme_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            scheme = Scheme.objects.get(id=scheme_id)
        except Scheme.DoesNotExist:
            return Response({'success': False, 'error': 'Scheme not found.'}, status=status.HTTP_404_NOT_FOUND)

        saved_item = SavedScheme.objects.filter(user=request.user, scheme=scheme).first()
        if saved_item:
            saved_item.delete()
            is_saved = False
            msg = 'Scheme removed from saved list.'
        else:
            SavedScheme.objects.create(user=request.user, scheme=scheme)
            is_saved = True
            msg = 'Scheme saved successfully.'

        # Get updated list of IDs
        scheme_ids = list(SavedScheme.objects.filter(user=request.user).values_list('scheme_id', flat=True))

        return Response({
            'success': True,
            'is_saved': is_saved,
            'message': msg,
            'scheme_ids': scheme_ids
        })

class ApplicationDraftView(APIView):
    """
    Get or update application document checklist progress for a specific scheme.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, scheme_id):
        draft, created = ApplicationDraft.objects.get_or_create(
            user=request.user,
            scheme_id=scheme_id,
            defaults={'document_status': {}, 'completed_steps': [], 'notes': ''}
        )
        serializer = ApplicationDraftSerializer(draft)
        return Response({'success': True, 'draft': serializer.data})

    def post(self, request, scheme_id):
        draft, _ = ApplicationDraft.objects.get_or_create(
            user=request.user,
            scheme_id=scheme_id
        )

        doc_status = request.data.get('document_status')
        completed_steps = request.data.get('completed_steps')
        notes = request.data.get('notes')

        if doc_status is not None:
            # Merge document statuses
            current = draft.document_status or {}
            current.update(doc_status)
            draft.document_status = current

        if completed_steps is not None:
            draft.completed_steps = completed_steps

        if notes is not None:
            draft.notes = notes

        draft.save()
        serializer = ApplicationDraftSerializer(draft)
        return Response({
            'success': True,
            'message': 'Application checklist updated.',
            'draft': serializer.data
        })

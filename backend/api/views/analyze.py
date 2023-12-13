from api.utils import analyze
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view

@csrf_exempt 
@api_view(['POST'])
def post(request):
    # try:
        result = analyze(request.data)
        return JsonResponse(result)

    # except ValueError as e:
    #     return JsonResponse({'error': 'Invalid payload format'})

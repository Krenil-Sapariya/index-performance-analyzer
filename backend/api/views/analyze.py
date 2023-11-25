from api.utils import analyze
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view

@csrf_exempt 
@api_view(['POST'])
def post(request):
    try:
        # # Assuming payload is a JSON with 'num1' and 'num2'
        # num1 = int(request.data.get('num1', 0))
        # num2 = int(request.data.get('num2', 0))

        # # Process the numbers using utility function
        # result = process_numbers_from_payload(num1, num2)

        # # Return the result to the frontend
        # return Response({'result': result}, status=status.HTTP_200_OK)
        print(analyze(19))
        print('view analyze.py ', request.data['blockingFactor'])
        return JsonResponse({'Result': 0})

    except ValueError as e:
        return JsonResponse({'error': 'Invalid payload format'})

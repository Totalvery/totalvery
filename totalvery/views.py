from django.http import JsonResponse


def ping(request):
    data = {'ping': 'paaagn!'}
    return JsonResponse(data)


from django.http import JsonResponse
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

def ping(request):
    data = {'ping': 'pong!'}
    return JsonResponse(data)

index = never_cache(TemplateView.as_view(template_name='index.html'))

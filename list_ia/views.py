from django.core.paginator import Paginator
from django.http import JsonResponse
from django.db.models import Count
from django.shortcuts import render
from .models import IaItem
import time

def accueil(request):
    all_ia_items = IaItem.objects.all()

    # Pagination pour l'affichage initial
    page_number = request.GET.get('page', 1)
    paginator = Paginator(all_ia_items, 4)  
    page_obj = paginator.get_page(page_number)
    

    return render(
        request,
        'list_ia/home.html',
        context={
            'results': page_obj,  
            'pagination': {
                'has_previous': page_obj.has_previous(),
                'has_next': page_obj.has_next(),
                'current_page': page_obj.number,
                'total_pages': paginator.num_pages,
            },
        }
    )

def filter(request):
    if request.method == 'GET':
        time.sleep(0.3)  
        tag_names = request.GET.getlist('filter[]')

        rating = [int(note) for note in tag_names if note.isdigit()]
        tag_names = [tag for tag in tag_names if not tag.isdigit()]


        queryset = IaItem.objects.prefetch_related('tags').all()

        if tag_names:
            queryset = queryset.filter(tags__name__in=tag_names) \
                            .annotate(tag_count=Count('tags')) \
                            .filter(tag_count=len(tag_names)) \
                            .distinct()

        if rating:
            queryset = queryset.filter(rating__in=rating)

        for item in queryset:
            print(item.title)
        page_number = request.GET.get('page', 1)  
        paginator = Paginator(queryset, 4)  
        page_obj = paginator.get_page(page_number)

        data = {
            'results': [
                {
                    'id': item.id,
                    'title': item.title,
                    'text': item.text,
                    'image': item.image.url if item.image else None, 
                    'rating': item.rating,
                    'url': item.url,
                    'tags': [tag.name for tag in item.tags.all()]  
                }
                for item in page_obj
            ],
             'pagination': {
                 'has_previous': page_obj.has_previous(),
                 'has_next': page_obj.has_next(),
                 'current_page': page_obj.number,
                 'total_pages': paginator.num_pages,
             }
        }

        return JsonResponse(data, safe=False)

# def filter(request):
#     if request.method == 'GET':
#         time.sleep(0.3)   

#         tag_names = request.GET.getlist('filter[]')


#         rating = [int(note) for note in tag_names if note.isdigit()]
#         tag_names = [tag for tag in tag_names if not tag.isdigit()]


#         queryset = IaItem.objects.prefetch_related('tags').all()

#         if tag_names:
        
#             queryset = queryset.filter(tags__name__in=tag_names) \
#                             .annotate(tag_count=Count('tags')) \
#                             .filter(tag_count=len(tag_names)) \
#                             .distinct()

#         if rating:

#             queryset = queryset.filter(rating__in=rating)

#         data = [
#             {
#                 'id': item.id,
#                 'title': item.title,
#                 'text': item.text,
#                 'image': item.image.url if item.image else None,  
#                 'rating': item.rating,
#                 'url': item.url,
#                 'tags': [tag.name for tag in item.tags.all()]   
#             }
#             for item in queryset
#         ]

#         return JsonResponse(data, safe=False)

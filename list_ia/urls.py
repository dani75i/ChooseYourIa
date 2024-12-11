from django.urls import path

from . import views

urlpatterns = [
    path("", views.accueil),
    path("filter", views.filter, name="filter"),

]
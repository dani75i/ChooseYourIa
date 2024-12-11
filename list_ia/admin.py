from django.contrib import admin
from .models import IaItem, Tag

class IaItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'rating', 'url', 'display_tags')  # Afficher les champs principaux
    search_fields = ('title',)
    
    def display_tags(self, obj):
        return ", ".join([tag.name for tag in obj.tags.all()])
    display_tags.short_description = 'Tags'  # Titre de la colonne dans l'admin

    # Si vous voulez personnaliser l'affichage du champ 'tags', vous pouvez définir 'filter_horizontal' ou 'filter_vertical' :
    filter_horizontal = ('tags',)  # Ajoute un widget multi-sélection avec un affichage horizontal

class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

admin.site.register(IaItem, IaItemAdmin)
admin.site.register(Tag, TagAdmin)

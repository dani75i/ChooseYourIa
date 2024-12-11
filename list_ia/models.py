# models.py
from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class IaItem(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='items/images/')  # Répertoire où les images seront stockées
    text = models.TextField()
    tags = models.ManyToManyField('Tag', related_name='items')  # Liste de tags associés
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)], default=1)  # Note sur 5
    url = models.URLField(max_length=500, blank=True, null=True)  # Champ URL ajouté
    
    def __str__(self):
        return self.title


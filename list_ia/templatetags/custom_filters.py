# templatetags/custom_filters.py
from django import template

register = template.Library()

@register.filter
def rangefilter(value):
    """Retourne une liste de nombres de 0 à value-1."""
    return range(value)


---
layout: post
title: "Make conversion code reusable in Xamarin.Forms"
date: 2020-10-12 00:00:00 +0000
comments: true
categories: Xamarin
tags: Xamarin
author: Alwyn Lombaard
published: true
excerpt_separator: <!--more-->
---

In [How to bind Xamarin.Forms Shapes Path Data to a string]({% post_url 2020-10-09-how-to-bind-xamarinforms-shapes-path-data-to-a-string %}) I expain how to convert an SVG path (stored in a resource file in this case) to the `Data` property of a `Path` view. 

Now it would be useful to make the conversion code reusable across multiple views in the application.

<!--more-->

<a href="/images/pathicons.png" target="_blank"><img src="/images/pathicons.png" alt="Step 1" width="160"/></a>
>example of SVG string data rendered in a Path

Here's how to do it:

### Step 1
Create a value converter
{% highlight csharp %}
public class StringPathToGeometryConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is string stringValue)
        {
            try
            {
                return (Geometry)new PathGeometryConverter()
                .ConvertFromInvariantString(stringValue);
            }
            catch
            {
                return stringValue;
            }
        }
        return null;
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
{% endhighlight %}

### Step 2
Instantiate the converter in the resource dictionary. 

Register a namespace where the converter is located, for example:

{% highlight csharp %}
...
xmlns:converters="clr-namespace:Musictheory.Converters"
...
{% endhighlight %}

Instantiate:
{% highlight xml%}
<ResourceDictionary>
    <converters:StringPathToGeometryConverter
        x:Key="StringPathToGeometryConverter" />
</ResourceDictionary>
{% endhighlight %}

### Step 3
Reference the converter with the `StaticResource` markup extension
    
{% highlight xml%}
<Path
    Data="{Binding IconSvgPath, 
        Converter={StaticResource StringPathToGeometryConverter}}"
    Stroke="White"
    Fill="White"
    StrokeThickness="1"
    Aspect="Uniform"
    VerticalOptions="Center"
    HorizontalOptions="Center"/>
{% endhighlight %}


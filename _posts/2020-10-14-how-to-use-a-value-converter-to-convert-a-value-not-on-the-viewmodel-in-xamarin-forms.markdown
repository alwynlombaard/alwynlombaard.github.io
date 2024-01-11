---
layout: post
title: "How to use an IValueConverter to convert a value not on the view model"
date: 2020-10-14 00:00:00 +0000
comments: true
categories: Xamarin
tags: Xamarin
author: Alwyn Lombaard
published: false
excerpt_separator: <!--more-->
---

In [Make conversion code reusable in Xamarin.Forms]({% post_url 2020-10-12-make-conversion-code-reusable-in-xamarin-forms %}) I expain how to convert an SVG path (stored in a resource file in this case) to the `Data` property of a `Path` view. 

Now I want to be able to use the `IValueConverter` to convert a value even if it is not a property on the viewmodel. In this example the value is an SVG path stored as a string in a resource file.

<!--more-->

The fundamental requirement still remains that `Data` is of type `Geometry` and requires a convertion from `string` to `Geometry` to be able to use a resource value stored as string. 

For example  
`Data="{x:Static localisation:Resources.SharpSignPath}"`

results in a type mismatch error and does not even compile.

The solution is to expand the `IValueConverter` and add a `property` that will be used as the source if it has been set.

Here's how to do it:

### Step 1
Add a property to the value converter
{% highlight csharp %}
public string PathDataStringSource { get; set; }
{% endhighlight %}

Then adapt the `Convert` function.
{% highlight csharp %}
public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
{
    var stringValue = value as string;
    if (!string.IsNullOrWhiteSpace(PathDataStringSource))
    {
        stringValue = PathDataStringSource;
    }
    if (!string.IsNullOrWhiteSpace(stringValue))
    {
        try
        {
            return (Geometry)new PathGeometryConverter().ConvertFromInvariantString(stringValue);
        }
        catch
        {
            return stringValue;
        }
    }
    return null;
}
{% endhighlight %}

### Step 2
Use Binding markup to set `IValueConverter` and the `property`.

{% highlight xml%}
<Path x:Name="FlatSign"
    Stroke="White"
    Fill="White"
    Aspect="Uniform"
    StrokeThickness="1">
    <Path.Data>
        <Binding>
            <Binding.Converter>
                <converters:StringPathToGeometryConverter
                    PathDataStringSource="{x:Static localisation:Resources.FlatSignPath}"/>
            </Binding.Converter>
        </Binding>
    </Path.Data>
</Path>
{% endhighlight %}


<a href="/images/sharpsign.png" target="_blank"><img src="/images/sharpsign.png" alt="Step 1" width="160"/></a>
>example of SVG string data rendered in a Path
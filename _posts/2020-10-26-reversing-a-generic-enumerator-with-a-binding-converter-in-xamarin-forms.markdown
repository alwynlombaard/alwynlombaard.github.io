---
layout: post
title: "Reversing an IEnumerable<T> with a binding converter in Xamarin.Forms"
date: 2020-10-26 00:00:00 +0000
comments: true
categories: xamarin
tags: xamarin
author: Alwyn Lombaard
published: false
excerpt_separator: <!--more-->
---

I wanted to bind a property on the viewmodel of type `IEnumerable<T>` to the `ItemsSource` property of a `CollectionView` and be able to reverse the order of the items displayed without having to reverse them in the viewmodel or code behind code.

<!--more-->

Here's how I did it:

### Step 1

Define an  `IValueConverter` with generic type (`T`). `T` is the type of the items in the Enumerable (`String`, `Int32`, `Object` etc)

{% highlight csharp %}
public class ReverseEnumerableConverter<T> : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if(value is IEnumerable<T> collection)
        {
            return Enumerable.Reverse(collection);
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
The generic type of the IEnumerable<T> must be supplied to the converter.

Use Binding markup to supply the generic type argument using `x:TypeArguments`.

In this example the Notes property on the viewmodel is of type `List<string>` but it could be any `IEnumerable<String>`.

{% highlight xml%}
<CollectionView>
    <CollectionView.ItemsSource>
        <Binding Path="Notes">
            <Binding.Converter>
                <converters:ReverseEnumerableConverter 
                  x:TypeArguments="x:String" />
            </Binding.Converter>
        </Binding>
    </CollectionView.ItemsSource>
    <CollectionView.ItemTemplate>
       ...
    </CollectionView.ItemTemplate>
</CollectionView>
{% endhighlight %}


If the property was of type `IEnumerable<int>` for example `List<int>`:

{% highlight xml%}
<CollectionView>
    <CollectionView.ItemsSource>
        <Binding Path="Notes">
            <Binding.Converter>
                <converters:ReverseEnumerableConverter 
                  x:TypeArguments="x:Int32" />
            </Binding.Converter>
        </Binding>
    </CollectionView.ItemsSource>
    <CollectionView.ItemTemplate>
       ...
    </CollectionView.ItemTemplate>
</CollectionView>
{% endhighlight %}
---
layout: post
title: "Xamarin iOS swipable multiple step process used for onboarding"
date: 2015-10-27rak 21:49:01 +0000
comments: true
categories: Xamarin
tags: Xamarin iOS programming C#
published: true
author: Alwyn Lombaard
---

<h3 id="the-requirement">The requirement</h3>

I recently had to build an onboarding process in the JustGiving iOS app that consists
of a series of screens that can be navigated by swiping forward and backward.

<a href="/images/onboarding/make-good-things-happen.png" target="_blank"><img src="/images/onboarding/make-good-things-happen.png" alt="Step 1" width="160"/></a>
<a href="/images/onboarding/make-good-things-happen.png" target="_blank"><img src="/images/onboarding/fundraise.png" alt="Step 2" width="160"/></a>
<a href="/images/onboarding/make-good-things-happen.png" target="_blank"><img src="/images/onboarding/connect.png" alt="Step 3" width="160"/></a>
<a href="/images/onboarding/make-good-things-happen.png" target="_blank"><img src="/images/onboarding/discover.png" alt="Step 4" width="160"/></a>
<a href="/images/onboarding/make-good-things-happen.png" target="_blank"><img src="/images/onboarding/get-started.png" alt="Step 5" width="160"/></a>

<h3 id="the-solution">The solution</h3>

I used a `UIPageViewController` with a `UIPageViewControllerDataSource` for navigating through steps
and a `UIPageControl` for the progress indicator. 

[The working sample solution can be found on GitHub](https://github.com/alwynlombaard/xamarin-ios-horizontal-swipe-sample)

<h3 id="endresult">The end result</h3>

<video controls preload="false" width="100%">
   <source src="/video/onboarding.mp4" type="video/mp4">
</video> 

<h3 id="steps">Steps</h3>

Each step is a `UIViewController` that implements the following interface.

	public interface IMultiStepProcessStep : IDisposable
    {
        int StepIndex { get; set; }
        event EventHandler<MultiStepProcessStepEventArgs> StepActivated;
        event EventHandler<MultiStepProcessStepEventArgs> StepDeactivated;
    }

	
	public class MultiStepProcessStepEventArgs
    {
        public int Index { get; set; }
    }

<h3 id="UIViewController">UIViewController step</h3> 

A step publishes its index when it is activated or de-activated as the active step.
This is done in `ViewDidAppear` and `ViewWillDisappear`.

	public class MakeGoodthingsHappenStep : UIViewController, IMultiStepProcessStep
    {
        public override void ViewDidAppear(bool animated)
        {
            base.ViewDidAppear(animated);
            StepActivated?.Invoke(this, new MultiStepProcessStepEventArgs { Index = StepIndex });
        }

        public override void ViewWillDisappear(bool animated)
        {
            base.ViewWillDisappear(animated);
            StepDeactivated?.Invoke(this, new MultiStepProcessStepEventArgs { Index = StepIndex });
        }

        public int StepIndex { get; set; }
        public event EventHandler<MultiStepProcessStepEventArgs> StepActivated;
        public event EventHandler<MultiStepProcessStepEventArgs> StepDeactivated;
    }

<h3 id="UIPageViewControllerDataSource">UIPageViewControllerDataSource</h3>

The data source is a `UIPageViewControllerDataSource` that is constructed with a list of `IMultiStepProcessStep` steps.

	public class MultiStepProcessDataSource : UIPageViewControllerDataSource
    {
        private readonly List<IMultiStepProcessStep> _steps;
       
        public MultiStepProcessDataSource(List<IMultiStepProcessStep> steps)
        {
            if (steps == null)
            {
              throw new ArgumentNullException(nameof(steps));
            }
            if (!steps.Any())
            {
                throw new ArgumentException("steps cannot be empty.", nameof(steps));
            }
            if (steps.Any(s => !(s is UIViewController)))
            {
                throw new ArgumentException("all steps must be a UIViewController", nameof(steps));
            }

            _steps = steps;
            
            for (int i = 0; i < _steps.Count; i++)
            {
                var step = _steps[i];
                step.StepIndex = i;
            }
        }

        public List<IMultiStepProcessStep> Steps => _steps;

        public override UIViewController GetPreviousViewController(UIPageViewController pageViewController,
            UIViewController referenceViewController)
        {
            var step = referenceViewController as IMultiStepProcessStep;
            if (step == null)
            {
                return null;
            }

            var index = _steps.IndexOf(step);
            if (index <= 0)
            {
                return null;
            }

            return   _steps[index - 1] as UIViewController;
        }

        public override UIViewController GetNextViewController(UIPageViewController pageViewController, 
															   UIViewController referenceViewController)
        {
            var step = referenceViewController as IMultiStepProcessStep;
            if (step == null)
            {
                return null;
            }
            var index = _steps.IndexOf(step);
            if (index + 1 == _steps.Count)
            {
                return null;
            }

            return _steps[(step.StepIndex + 1)] as UIViewController;
        }
    }	
	
<h3 id="UIPageViewController">UIPageViewController</h3>

The `UIPageViewController` is constructed from the data source.

    public sealed class MultiStepProcessHorizontal : UIPageViewController
    {
        public MultiStepProcessHorizontal(MultiStepProcessDataSource dataSource) 
			:base(UIPageViewControllerTransitionStyle.Scroll, 
				  UIPageViewControllerNavigationOrientation.Horizontal)
        {
            DataSource = dataSource;
            SetViewControllers(new[] {dataSource.Steps.FirstOrDefault() as UIViewController}, 
							   UIPageViewControllerNavigationDirection.Forward, 
							   false, 
							   null);
        }
    } 
	
<h3 id="UIPageControl">UIPageControl</h3>

A  `UIPageControl` is used to indicate which step is active.

![UIPageControl](/images/onboarding/UIPageControl.png)
	
<h3 id="putting-it-all-together">Putting it all together in the OnBoardingViewController</h3>

The event handlers for when a step is activated and de-activated are used to set the current page index
and to update any other parts of the UI as needed.
	
	private void HandleStepActivated(object sender, MultiStepProcessStepEventArgs args)
	{
		_pageControl.CurrentPage =  args.Index;
	}

	private void HandleStepDeactivated(object sender, MultiStepProcessStepEventArgs args)
	{
		//update the UI as required while transitioning between steps
	}

Get the steps that form part of the process and wire them up to `StepActivated` and `StepDeactivated` events.

	private List<IMultiStepProcessStep> GetSteps()
	{
		var steps = new List<IMultiStepProcessStep>()
			{
				new MakeGoodthingsHappenStep(),
				new FundraiseStep(),
				new ConnectStep(),
				new DiscoverStep(),
				new GetStartedStep()
			};

		steps.ForEach(s => 
		{
			s.StepActivated += HandleStepActivated;
			s.StepDeactivated += HandleStepDeactivated;
		});

		return steps;
	}

Setup and add the `UIPageViewController` and `UIPageControl` controls to the view.
	
	private MultiStepProcessHorizontal _pageViewController;
	private UIPageControl _pageControl;
	
	private List<IMultiStepProcessStep> _steps;
	public List<IMultiStepProcessStep> Steps => _steps ?? (_steps = GetSteps());

	public override void LoadView()
        {
            View = new UIView();

            _pageViewController = new MultiStepProcessHorizontal(new MultiStepProcessDataSource(Steps));

            _pageControl = new UIPageControl
                {
                    CurrentPage = 0,
                    Pages = Steps.Count
                };
				
			View.Add(_pageViewController.View);
            View.Add(_pageControl);
	}

	
* [The requirement](#the-requirement)
* [The solution](#the-solution)
* [The end result](#endresult)
* [Steps](#steps)
* [UIViewController step](#UIViewController)
* [UIPageViewControllerDataSource](#UIPageViewControllerDataSource)
* [UIPageViewController](#UIPageViewController)
* [UIPageControl](#UIPageControl)
* [Putting it all together in the OnBoardingViewController](#putting-it-all-together)





	
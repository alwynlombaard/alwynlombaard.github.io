---
layout: post
title: "How to use the ExactTarget SOAP API to setup and send a transactional email in .Net without logging into ExactTarget"
date: 2014-06-26 15:07:00 +0100
comments: true
categories: [programming]
tags: [ExactTarget, transactional email, C#, .Net]
author: Alwyn Lombaard
---

I recently had to use the ExaxtTarget SOAP API to send transactional emails from a website but setting up a new  one required me to log in to ExactTarget and shaving yaks called "Data Extension", "Triggered Send", "Triggered Send Definition", "Delivery Profile", "Email Templates" etc.. 

I just wanted to be able to send a simple transactional email without first having to perform a number of steps in the cumbersome ExactTarget UI ....so I created a library to make my life easier when I need to set up a new transactional email. I hope this can help some poor soul out there suffering the same fate I have.

Here is how you can set up a new transactional email by using my library.

## Getting started ##

I assume you have received API user credentials from ExactTarget to use with the SOAP API. I also assume you have logged into ExactTarget and have heard about "Triggered Sends" and "Data Extensions".

## Step 1: Install from Nuget ##

{% gist 83bf27007bf84e63ceb9 Install %}

## Step 2: Create ##

You only need to do this once for the type of email you wish to send with tracking. (For example order confirmation emails, welcome after registration emails, order dispatched emails etc)

You have two choices, you can create a "Triggered send" with a  

1. "PasteHtml" email or
2. Templated email

{% gist 83bf27007bf84e63ceb9 Config.cs %}

### Create "PasteHtml" email ###

{% gist 83bf27007bf84e63ceb9 CreatePasteHtml.cs %}

### Create Templated email ###

{% gist 83bf27007bf84e63ceb9 CreateTemplate.cs %}


## Sending an email ##

### Sending "PasteHtml" email ###

If you've created a "PasteHTML" email, you supply replacement values to use for the email for:

1. Subject 
2. Body
3. Head (optional)

{% gist 83bf27007bf84e63ceb9 Config.cs %}

{% gist 83bf27007bf84e63ceb9 SendPasteHtml.cs %}

### Sending Templated email ###

If you've created a templated email, you supply replacement values to use for the email for:

1. Subject 
2. Body

{% gist 83bf27007bf84e63ceb9 Config.cs %}

{% gist 83bf27007bf84e63ceb9 SendTemplate.cs %}

## Links ##
[Project site](http://exacttarget.lombaard.co.uk/)

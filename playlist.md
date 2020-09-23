---
layout: page
title: "Playlist"
permalink: /playlist/
---

<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js"></script>
<script src="/javascripts/playlist.js"></script>

<style>
	.active{
			background-color: #b7b7b7;
	}
	.prev {
		height: 56px;
		width: 56px;
		background: url(/images/controls.jpg) -56px -112px;
	}
	.next {
		height: 56px;
		width: 56px;
		background: url(/images/controls.jpg) -112px -112px;
	}
	.left{
		float:left;
	}
	.clear
	{
		clear:both;
	}
	.playlist ul{
		list-style: none;
		padding: 3px;
		margin: 3px;
	}
	.playlist ul{
		width: 400px;
	}
	
	.playlist ul li.track{
		cursor:pointer;
		padding-bottom : 3px;
		padding-top: 3px;
	}
	
	#extra-controls{
		width:300px;
		vertical-align: center;
		padding-bottom: 30px;
		//border: 1px solid red;
	}
	
</style>

<header><h1 class="entry-title">Playlist</h1></header>
<p>I developed this playlist for my recordings while playing around with Angular. Read about it <a href="{% post_url 2015-10-13-a-simple-angular-audio-playlist%}">here</a>.
</p>

<p>Here is a list of some of the recordings I've made during my practice sessions.</p>
<div class="playlist" ng-app="playListApp" ng-controller="playListController">
	<h2>Track: {% raw %}{{selectedTrack().name}}{% endraw %}</h2>
	<audio preload="false" id="playlist-audio" controls="controls" width="300"></audio>
	<div id="extra-controls">
		<button id="btnPrev" class="ctrlbtn" ng-click="previous()">|&lt;&lt; Prev Track</button> 
		<button id="btnNext" class="ctrlbtn" ng-click="next()">Next Track &gt;&gt;|</button>
	</div>
	<h3>Playlist</h3>
	<ul>
		<li class="track" ng-repeat="track in tracks" ng-class="{active:selectedIndex == $index}" ng-click="loadTrack($index)">
			{% raw %}{{$index + 1}}. {{track.name}} - {{track.length}}{% endraw %}
		</li>
	</ul>
</div>



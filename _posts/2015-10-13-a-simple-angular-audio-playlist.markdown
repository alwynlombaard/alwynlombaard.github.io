---
layout: post
title: "A simple Angular audio playlist"
date: 2015-10-13 20:34:45 +0000
comments: true
categories: Angular Jasvascript programming
author: Alwyn Lombaard
---

I recently knocked out this Angular.js app to put my recordings in a playlist.

You can play with it [here](/playlist).

###The markup

	<div class="playlist" ng-app="playListApp" ng-controller="playListController">
		<h2>Track: {{"{{selectedTrack().name"}}}}</h2>
		<audio preload="false" id="playlist-audio" controls="controls" width="300"></audio>
		<div id="extra-controls">
			<button id="btnPrev" class="ctrlbtn" ng-click="previous()">|&lt;&lt; Prev Track</button> 
			<button id="btnNext" class="ctrlbtn" ng-click="next()">Next Track &gt;&gt;|</button>
		</div>
		<h3>Playlist</h3>
		<ul>
			<li class="track" ng-repeat="track in tracks" ng-class="{active:selectedIndex == $index}" ng-click="loadTrack($index)">
				{{"{{track.track"}}}}. {{"{{track.name"}}}} - {{"{{track.length"}}}}
			</li>
		</ul>
	</div>


###The JavaScript

	'use strict';

	(function(global) {
		var app = angular.module('playListApp', []);

		app.factory('audio', function($document) {
			var audio = $document[0].getElementById('playlist-audio');
			return audio;
		});

		global.playListController = function ($scope, audio){
			$scope.mediaPath = '/music/';
			$scope.playing = false;
			$scope.selectedIndex = 0;
			$scope.tracks = [
				{'track':1,'name':'Brouwer Study No 1','length':'01:06','file':'Brouwer_Study_No_1_20150919_182834.mp3'},
				{'track':2,'name':'Brouwer Study No 2','length':'01:10','file':'Brouwer_Study_No_2_20151004_140303.mp3'},
				{'track':3,'name':'Brouwer Study No 3','length':'00:48','file':'Brouwer_Study_No_3_20151007_214619.mp3'},
				{'track':4,'name':'Brouwer Study No 4','length':'00:48','file':'Brouwer_Study_No_4_20151008_212308.mp3'},
				{'track':5,'name':'Brouwer Study No 5','length':'01:08','file':'Brouwer_Study_No_5_20151011_150048.mp3'},
				{'track':6,'name':'Brouwer Study No 6','length':'01:31','file':'Brouwer_Study_No_6_20151010_132529.mp3'}];
			$scope.trackCount = $scope.tracks.length;
			$scope.selectedTrack = function(){ return $scope.tracks[$scope.selectedIndex]};
			$scope.audioSource = function (){return $scope.mediaPath + $scope.selectedTrack().file;};
			audio.src = $scope.audioSource();
			$scope.loadTrack = function(index) {
				$scope.selectedIndex = index;
				audio.src = $scope.audioSource();
				if($scope.playing){
					audio.play();
				}
			}
			$scope.previous = function(){
				$scope.selectedIndex--;
				$scope.selectedIndex = ($scope.selectedIndex < 0 ? $scope.tracks.length - 1 : $scope.selectedIndex);
				audio.src = $scope.audioSource();

				if($scope.playing){
					audio.play();
				}
			};
			$scope.next = function(){
				$scope.selectedIndex++;
				$scope.selectedIndex = ($scope.selectedIndex >=  $scope.tracks.length ? 0 : $scope.selectedIndex);
				audio.src = $scope.audioSource();
				if($scope.playing){
					audio.play();
				}
			};
			audio.addEventListener('play', function() {
				$scope.$apply(function(){
					$scope.playing = true;
				});
			}, false);
			audio.addEventListener('pause', function() {
				$scope.$apply(function(){
					$scope.playing = false;
				});
			}, false);
			audio.addEventListener('ended', function() {
				$scope.$apply(function(){
					if(($scope.selectedIndex + 1) === $scope.tracks.length){
						$scope.playing = false;
						$scope.selectedIndex = 0;
						audio.src = $scope.audioSource();
					}
					else{
						$scope.playing = true;
						$scope.next();
					}
				});
			}, false);
		}
	})(this);

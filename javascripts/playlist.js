'use strict';

(function(global) {
	var app = angular.module('playListApp', []);

	app.factory('audio', function($document) {
		var audio = $document[0].getElementById('playlist-audio');
		return audio;
	});

	global.playListController = function ($scope, audio){
		$scope.supportsAudio = !!document.createElement('audio').canPlayType;
		$scope.mediaPath = '/music/';
		$scope.playing = false;
		$scope.selectedIndex = 0;
		$scope.tracks = [
					{'name':'Bach Prelude for Lute BWV 999','length':'02:10','file':'Bach_Prelude_for_Lute_BWV999_20180415_150053.mp3'},
					{'name':'An Irish Air','length':'01:46','file':'An_Irish_Air_20151024_174705.mp3'},
					{'name':'Still by my side - Irish traditional','length':'00:59','file':'Still_by_my_side_Irish_Traditional_20140903_190251.mp3'},
					{'name':'Greensleeves','length':'02:01','file':'Greensleeves.mp3'},
					{'name':'Pavan I by Luis Milan','length':'01:52','file':'Pavan_20140819_182702.mp3'},
					{'name':'Aria by Johann Anton Logy','length':'02:09','file':'Aria_20140822.mp3'},
					{'name':'Espanoleta','length':'00:54','file':'Espanoleta_20140825_203019.mp3'},
					{'name':'Prelude in D Minor - De Visee','length':'00:58','file':'Prelude_De_Visee_20140828_191016.mp3'},
					{'name':'Brouwer Study No 1','length':'01:06','file':'Brouwer_Study_No_1_20150919_182834.mp3'},
					{'name':'Brouwer Study No 2','length':'01:10','file':'Brouwer_Study_No_2_20151004_140303.mp3'},
					{'name':'Brouwer Study No 3','length':'00:48','file':'Brouwer_Study_No_3_20151007_214619.mp3'},
					{'name':'Brouwer Study No 4','length':'00:48','file':'Brouwer_Study_No_4_20151008_212308.mp3'},
					{'name':'Brouwer Study No 5','length':'01:08','file':'Brouwer_Study_No_5_20151011_150048.mp3'},
					{'name':'Brouwer Study No 6','length':'01:31','file':'Brouwer_Study_No_6_20151010_132529.mp3'},
					{'name':'Brouwer Study No 11','length':'3:13','file':'Brouwer_Study_No_11_20151024_125532.mp3'},
					{'name':'Study in E minor - Tarrega','length':'01:12','file':'Tarrega_eminor_20140917_195801.mp3'},
					{'name':'Opus 60 no 3 - Carcassi','length':'01:49','file':'Carcassi_Etude3_20141026_180555.mp3'},
					{'name':'Allegro in A minor - Giuliani','length':'01:10','file':'Giuliani Allegro in A Minor_20141126_192344.mp3'},
					{'name':'Lesson in A minor - Aguado','length':'00:37','file':'Aguado_Lesson_20141126_221556.mp3'},
					{'name':'Andantino in A minor - Carulli','length':'01:24','file':'Carulli_Antantino_20150705_113534.mp3'},
					{'name':'Andantino in G - Carulli','length':'01:02','file':'Carulli_Andantino_20141128_225123.mp3'},
					{'name':'Opus 241 No 21 Waltz - Carulli','length':'01:12','file':'Carulli-Op241no21_Waltz_20200927_173712.mp3'},
					{'name':'Waltz in C - Carcassi','length':'00:59','file':'Carcassi_method_C_Major_Waltz_20150608_184813.mp3'},
					{'name':'Opus 60 No 1 - Sor','length':'01:05','file':'Sor_Opus_60_no_1_20151122_131513.mp3'},
					{'name':'Opus 60 No 22 - Sor','length':'02:31','file':'Sor_Opus_60_No_22_20151031_214715.mp3'},
					{'name':'Opus 60 No 22 - Sor (again)','length':'02:18','file':'Sor_Opus_60_no_22_Slur_study_20200917.mp3'}
					
				];
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

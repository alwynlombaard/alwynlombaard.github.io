jQuery(function($) {
	var supportsAudio = !!document.createElement('audio').canPlayType;
	var index = 0,
	playing = false;
	mediaPath = '/music/',
	extension = '',
	tracks = [
		{"track":1,"name":"Greensleeves","length":"02:01","file":"Greensleeves"},
		{"track":2,"name":"Pavan I by Luis Milan","length":"01:52","file":"Pavan_20140819_182702"},
		{"track":3,"name":"Aria by Johann Anton Logy","length":"02:09","file":"Aria_20140822"},
		{"track":4,"name":"Espanoleta","length":"00:54","file":"Espanoleta_20140825_203019"},
		{"track":5,"name":"Prelude in D Minor - De Visee","length":"00:58","file":"Prelude_De_Visee_20140828_191016"},
		{"track":6,"name":"Still by my side - Irish traditional","length":"00:59","file":"Still_by_my_side_Irish_Traditional_20140903_190251"},
		{"track":7,"name":"Study in E minor - Tarrega","length":"01:12","file":"Tarrega_eminor_20140917_195801"}
	],
	trackCount = tracks.length,
	$action = $('#npAction'),
	$title = $('#npTitle'),
	$audio = $('#audio1').bind('play', function() {
			playing = true;
			$action.text('Now Playing:');
		}).bind('pause', function() {
			playing = false;
			$action.text('Paused:');
		}).bind('ended', function() {
			$action.text('Paused:');
			if((index + 1) < trackCount) {
				index++;
				loadTrack(index);
				$audio.play();
			} else {
				$audio.pause();
				index = 0;
				$action.text('Paused:');
				loadTrack(index);
			}
		}).get(0),
	$btnPrev = $('#btnPrev').click(function() {
		if((index - 1) > -1) {
			index--;
			loadTrack(index);
			if(playing) {
				$audio.play();
			}
		} else {
			$audio.pause();
			index = 0;
			loadTrack(index);
		}
	}),
	$btnNext = $('#btnNext').click(function() {
		if((index + 1) < trackCount) {
			index++;
			loadTrack(index);
			if(playing) {
				$audio.play();
			}
		} else {
			$audio.pause();
			$action.text('Paused:');
			index = 0;
			loadTrack(index);
		}
	}),
	loadTrack = function(id) {
		$title.text(tracks[id].name);
		index = id;
		$audio.src = mediaPath + tracks[id].file + extension;
	},
	playTrack = function(id) {
		loadTrack(id);
		$audio.play();
	};
	if($audio.canPlayType('audio/ogg')) {
		extension = '.ogg';
	}
	if($audio.canPlayType('audio/mpeg')) {
		extension = '.mp3';
	}
	loadTrack(index);
	
	
});
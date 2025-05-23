$(document).ready(function(){
	
	// Mobile menu toggle
	$('.menu-toggle').on('click', function() {
		$('.navigation').toggleClass('active');
	});
	
	// Hide additional album info initially
	$(".additionalAlbumInfo").hide();

	// Album list click handler
	$("#albums li").click(function(){
		$("#albums li").removeClass("selected");
		$(this).addClass("selected");
		$(".additionalAlbumInfo").slideUp(300);

		var albumIndex = parseInt($(this).index())+1;
		$("article").each(function(index){
			if(index != albumIndex && index != 0)
				$(this).fadeOut(400);
			else 
				$(this).fadeIn(600);
		});
	});
		
	// Track list click handler
	$("tr").click(function(){
		$("tr").removeClass("selected");
		$(this).addClass("selected");
		$(".audio").remove();
		
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		var source = $(this).attr("data-source");
		
		var audio = new Audio(source);
		audio.controls = true;
		tr.className = "audio";
		tr.appendChild(td1);
		tr.appendChild(td2);
		td2.appendChild(audio);
		
		$(this).after(tr);
		$(tr).hide().fadeIn(500);
	});

	// Album info toggle
	$(".aboutAlbum").click(function(){
		$(this).next().slideToggle(400);
	});

	// Album cover hover effects
	$(".albumCover").hover(function(){
		$(this).css({
			transform: 'scale(1.05)',
			boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
		});
	}, function(){
		$(this).css({
			transform: 'scale(1)',
			boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
		});
	});
	
	// Image hover effects
	$(".albumCover .thumbnail, .albumPhoto img").hover(function(){
		$(this).animate({opacity: 0.7}, 200);
	}, function(){
		$(this).animate({opacity: 1}, 200);
	});

	// Article hover effects
	$("article").hover(function() {
		$(this).css({
			transform: 'translateY(-5px)',
			boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
		});
	}, function() {
		$(this).css({
			transform: 'translateY(0)',
			boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
		});
	});
	
	// Social links hover effects
	$(".social-links a").hover(function() {
		$(this).css({
			transform: 'translateY(-5px)',
			color: '#d5b942'
		});
	}, function() {
		$(this).css({
			transform: 'translateY(0)',
			color: ''
		});
	});
	
	// Add smooth scrolling to all links
	$("a").on('click', function(event) {
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 800, function(){
				window.location.hash = hash;
			});
		}
	});
	
	// Add animation to page elements on load
	$("article").css({opacity: 0}).each(function(i) {
		$(this).delay(i * 200).animate({opacity: 1}, 800);
	});
	
	// Add back to top button functionality
	$(window).scroll(function() {
		if ($(this).scrollTop() > 300) {
			$('.back-to-top').fadeIn();
		} else {
			$('.back-to-top').fadeOut();
		}
	});
});

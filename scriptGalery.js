$(document).ready(function(){
	// Mobile menu toggle
	$('.menu-toggle').on('click', function() {
		$('.navigation').toggleClass('active');
	});
	
	// Initialize gallery
	$(".albumCover").each(function(index){
		var path = $(this).attr("data-path");
		var count = parseInt($(this).attr("data-count"));
		var albumPhoto = $("<div> </div>");
		albumPhoto.addClass("albumPhoto");
		albumPhoto.addClass("fade-in");

		$("#albumsPhotos").append(albumPhoto);
		
		// Create image thumbnails with loading animation
		for(var i=0; i<count; i++) {
			var img = $("<img>");
			img.attr("src", path+(i+1)+".jpg");
			img.attr("alt", "Gallery image " + (i+1));
			img.attr("loading", "lazy");
			img.css("opacity", 0);
			albumPhoto.append(img);
			
			// Fade in images as they load
			img.on('load', function() {
				$(this).animate({opacity: 1}, 500);
			});
		}
	});

	// Track current image
	var currentImage;
	
	// Image click handler
	$(".albumPhoto img").click(function(){
		currentImage = $(this);
		changeCurrentImage(currentImage);
	});

	// Next image button
	$("#right").click(function(){
		if(currentImage.index() == currentImage.parent().children().length-1)
			currentImage = currentImage.parent().children(":first");
		else
			currentImage = currentImage.next();

		changeCurrentImage(currentImage);
	});
	
	// Previous image button
	$("#left").click(function(){
		if(currentImage.index() != 0)
			currentImage = currentImage.prev();
		else
			currentImage = currentImage.parent().children().last();
		
		changeCurrentImage(currentImage);
	});

	// Keyboard navigation
	$(document).keydown(function(e) {
		if (!currentImage) return;
		
		switch(e.which) {
			case 37: // left arrow
				$("#left").click();
				break;
			case 39: // right arrow
				$("#right").click();
				break;
			case 27: // escape
				closeFullscreen();
				break;
			default: return;
		}
		e.preventDefault();
	});

	// Album cover click handler
	$(".albumCover").click(function(){
		$("#showAllPictures").fadeIn(200);
		$("#mainFrameContainer").fadeIn(200);
		
		$(".albumCover").css({opacity: 1});
		$(this).css({opacity: 0.6});	
		
		var albumIndex = parseInt($(this).index())-1;
		$(".albumPhoto").each(function(index){
			if(index != albumIndex) {
				$(this).fadeOut(400);
			} else {
				$(this).fadeIn(400);
				currentImage = $(this).children(":first");
				changeCurrentImage(currentImage);
			} 
		});
	});

	// Function to change current image
	function changeCurrentImage(img) {
		$("#mainFrame").fadeTo(250, 0, function(){
			var newImg = new Image();
			newImg.onload = function(){
				var imgWidth = newImg.width;
				var imgHeight = newImg.height;
				
				// Responsive sizing
				var maxWidth = Math.min(700, window.innerWidth - 40);
				var maxHeight = Math.min(600, window.innerHeight - 200);
				
				if (imgWidth > maxWidth) {
					var ratio = maxWidth / imgWidth;
					imgWidth = maxWidth;
					imgHeight = imgHeight * ratio;
				}
				
				if (imgHeight > maxHeight) {
					var ratio = maxHeight / imgHeight;
					imgHeight = maxHeight;
					imgWidth = imgWidth * ratio;
				}
				
				$("#mainFrame").css({
					width: imgWidth + "px", 
					height: imgHeight + "px"
				});
			};
			
			newImg.src = img.attr("src");
			$("#mainFrame").attr("src", img.attr("src")).fadeTo(500, 1);
		});
		
		$("#counter").text((img.index()+1) + "/" + img.parent().children().length);
		$(".albumPhoto img").css({borderColor: "var(--border-color)"});
		img.css({borderColor: "var(--accent-color)"});
	}

	// Close fullscreen view
	function closeFullscreen() {
		$("#mainFrameContainer").fadeOut(300);
		$(".albumCover").css({opacity: 1});
	}

	// Show/hide all pictures button
	$("#showAllPictures").click(function(){
		currentImage.parent().fadeToggle(400);
	});
	
	// Close button for fullscreen view
	$("#closeFullscreen").click(function(){
		closeFullscreen();
	});
	
	// Add swipe support for mobile
	var touchStartX = 0;
	var touchEndX = 0;
	
	$("#mainFrameContainer").on('touchstart', function(e) {
		touchStartX = e.originalEvent.touches[0].clientX;
	});
	
	$("#mainFrameContainer").on('touchend', function(e) {
		touchEndX = e.originalEvent.changedTouches[0].clientX;
		handleSwipe();
	});
	
	function handleSwipe() {
		if (touchEndX < touchStartX - 50) {
			// Swipe left - next image
			$("#right").click();
		}
		if (touchEndX > touchStartX + 50) {
			// Swipe right - previous image
			$("#left").click();
		}
	}
	
	// Add animation to page elements on load
	$(".albumCover").css({opacity: 0}).each(function(i) {
		$(this).delay(i * 100).animate({opacity: 1}, 500);
	});
});
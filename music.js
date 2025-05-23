$(document).ready(function() {
    // Initialize variables
    let currentVideoIndex = 0;
    const videos = $('.video-item');
    const totalVideos = videos.length;
    let videoModal = null;
    
    // Create video modal
    function createVideoModal() {
        if ($('#video-modal').length === 0) {
            const modal = $(`
                <div id="video-modal">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <div class="modal-video-container">
                            <iframe id="modal-iframe" width="100%" height="100%" frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            `);
            
            $('body').append(modal);
            
            // Close modal on X click
            $('.close-modal').on('click', function() {
                closeVideoModal();
            });
            
            // Close modal on outside click
            $('#video-modal').on('click', function(e) {
                if ($(e.target).is('#video-modal')) {
                    closeVideoModal();
                }
            });
            
            // Close modal on ESC key
            $(document).keydown(function(e) {
                if (e.key === "Escape") {
                    closeVideoModal();
                }
            });
            
            videoModal = $('#video-modal');
        }
    }
    
    // Open video modal with specific YouTube video
    function openVideoModal(videoId) {
        if (!videoModal) {
            createVideoModal();
            videoModal = $('#video-modal');
        }
        
        $('#modal-iframe').attr('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
        videoModal.addClass('active');
        $('body').addClass('modal-open');
    }
    
    // Close video modal
    function closeVideoModal() {
        $('#modal-iframe').attr('src', '');
        videoModal.removeClass('active');
        $('body').removeClass('modal-open');
    }
    
    // Fade in videos with delay
    videos.each(function(index) {
        const delay = parseInt($(this).attr('data-delay'));
        setTimeout(() => {
            $(this).addClass('active');
        }, delay);
    });
    
    // Thumbnail click handler
    $('.thumbnail-container').on('click', function() {
        const videoId = $(this).data('video-id');
        const videoItem = $(this).closest('.video-item');
        
        // Highlight the currently playing video
        videos.removeClass('now-playing');
        videoItem.addClass('now-playing');
        
        // Set current index
        currentVideoIndex = videos.index(videoItem);
        
        // Open modal with video
        openVideoModal(videoId);
    });
    
    // Play All button functionality
    $('#play-all').on('click', function() {
        if ($(this).data('playing')) {
            // Stop playing
            closeVideoModal();
            videos.removeClass('now-playing');
            $(this).html('<i class="fas fa-play-circle"></i> Play All');
            $(this).data('playing', false);
        } else {
            // Start playing first video
            const firstVideoId = videos.first().find('.thumbnail-container').data('video-id');
            videos.removeClass('now-playing');
            videos.first().addClass('now-playing');
            currentVideoIndex = 0;
            openVideoModal(firstVideoId);
            $(this).html('<i class="fas fa-pause-circle"></i> Pause All');
            $(this).data('playing', true);
        }
    });
    
    // Shuffle button functionality
    $('#shuffle').on('click', function() {
        const videoItems = Array.from(videos);
        const videoGrid = $('.video-grid');
        
        // Close any open modal
        closeVideoModal();
        
        // Reset play button
        $('#play-all').html('<i class="fas fa-play-circle"></i> Play All');
        $('#play-all').data('playing', false);
        
        // Shuffle array using Fisher-Yates algorithm
        for (let i = videoItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            videoGrid.append(videoItems[j]);
            
            // Add shuffle animation
            $(videoItems[j]).removeClass('active');
            setTimeout(() => {
                $(videoItems[j]).addClass('active');
            }, 100 * i);
        }
    });
    
    // Fullscreen toggle functionality
    $('#fullscreen-toggle').on('click', function() {
        $('.video-container').toggleClass('fullscreen-mode');
        
        if ($('.video-container').hasClass('fullscreen-mode')) {
            $(this).html('<i class="fas fa-compress"></i> Normal View');
            $('body').css('overflow', 'hidden');
            
            // Add close button if it doesn't exist
            if ($('#close-fullscreen').length === 0) {
                const closeBtn = $('<button id="close-fullscreen"><i class="fas fa-times"></i></button>');
                $('.video-container').append(closeBtn);
                
                closeBtn.on('click', function() {
                    $('#fullscreen-toggle').click();
                });
            }
        } else {
            $(this).html('<i class="fas fa-expand"></i> Expand View');
            $('body').css('overflow', 'auto');
            $('#close-fullscreen').remove();
        }
    });
    
    // Keyboard navigation
    $(document).keydown(function(e) {
        // Only if modal is open or in fullscreen mode
        if (!$('#video-modal').hasClass('active') && !$('.video-container').hasClass('fullscreen-mode')) {
            return;
        }
        
        switch(e.which) {
            case 32: // Space bar
                if ($('#video-modal').hasClass('active')) {
                    e.preventDefault();
                }
                break;
            case 37: // Left arrow
                if ($('#video-modal').hasClass('active')) {
                    e.preventDefault();
                    navigateVideos('prev');
                }
                break;
            case 39: // Right arrow
                if ($('#video-modal').hasClass('active')) {
                    e.preventDefault();
                    navigateVideos('next');
                }
                break;
            default: return;
        }
    });
    
    // Video navigation function
    function navigateVideos(direction) {
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (currentVideoIndex + 1) % totalVideos;
        } else {
            newIndex = (currentVideoIndex - 1 + totalVideos) % totalVideos;
        }
        
        // Play the new video
        const nextVideoId = videos.eq(newIndex).find('.thumbnail-container').data('video-id');
        
        // Highlight the currently playing video
        videos.removeClass('now-playing');
        videos.eq(newIndex).addClass('now-playing');
        currentVideoIndex = newIndex;
        
        // Update the modal iframe
        $('#modal-iframe').attr('src', `https://www.youtube.com/embed/${nextVideoId}?autoplay=1`);
        
        // Update play button
        $('#play-all').html('<i class="fas fa-pause-circle"></i> Pause All');
        $('#play-all').data('playing', true);
        
        // Scroll to the currently playing video if in normal view
        if (!$('.video-container').hasClass('fullscreen-mode')) {
            $('html, body').animate({
                scrollTop: videos.eq(newIndex).offset().top - 100
            }, 500);
        }
    }
    
    // Add animation to page elements on load
    $('article').css({opacity: 0}).each(function(i) {
        $(this).delay(i * 200).animate({opacity: 1}, 800);
    });
    
    // Initialize the modal
    createVideoModal();
}); 
$(document).ready(function() {
  $(".hamburger-toggle").on('click', function(){
    $(this).toggleClass("active");
    $('.sidebar').toggleClass('expand');
    $('.sidebar div').toggleClass('active');
  })

  $(".nav-item").on('click', function() {
    $(".sidebar div.active ul").removeClass('active');
    $(".nav-item .down-arrow").removeClass('active');
    $(this).find('.down-arrow').addClass('active');
    $(this).find('.down-arrow.active').toggleClass('transform-rotate');
    $(".nav-item .down-arrow:not('.active')").removeClass('transform-rotate');
    $(this).next().toggleClass('active');
    $(this).next('.active').slideToggle();
    $(".sidebar div.active ul:not('.active')").slideUp();
  })

  $('.sidebar ul li a').on('click', function() {
    $('.sidebar ul li').removeClass('active-item')
    $(this).parent().addClass('active-item')
  })
});
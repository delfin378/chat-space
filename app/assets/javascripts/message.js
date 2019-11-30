$(function(){
  function buildHTML(message){
    var content = message.content ? `${ message.content }` : "";
    var image = message.image ? `<img src= ${ message.image }>` : "";
    var html = `<div class="message" data-id="${message.id}">
                <div class="upper-message">
                <div class="upper-message__user-name">
                  ${message.user_name}
                </div>
                <div class="upper-message__date">
                  ${message.date}
                </div>
                </div>
                <div class="lower-message">
                <p class="lower-message__content">
                  ${content}
                </p>
                  ${image}
                </div>
                </div>`
    return html
  }
  $('#new_message.form-box').on('submit', function(e){
    e.preventDefault();
  var message = new FormData(this);
  var url = $(this).attr('action');
  $.ajax({
    url: url,
    type: 'POST',
    data: message,  
    dataType: 'json',
    processData: false,
    contentType: false
   })

   .done(function(data){
    var html = buildHTML(data);
    $('.messages').append(html);
    $('#new_message.form-box')[0].reset();
    })
    
    .fail(function(data){
      alert('エラーが発生したためメッセージは送信できませんでした。');
    })

    .done(function scrollBottom(){
      var target = $('.message').last();
      var position = target.offset().top + $('.messages').scrollTop();
      $('.messages').animate({
        scrollTop: position
      }, 300, 'swing');
    })
  
    .always(function(data){
      $('.form__submit').prop('disabled', false);
    })
  });
});
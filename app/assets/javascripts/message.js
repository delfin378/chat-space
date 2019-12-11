$(function(){
  function buildHTML(message){
    var content = message.content ? `${ message.content }` : "";
    image = (message.image) ? `<img class= "lower-message__image" src=${message.image} >` : "";
    var html = `<div class="message" data-message-id="${message.id}">
                <div class="upper-message">
                <div class="upper-message__user-name">
                  ${message.user_name}
                </div>
                <div class="upper-message__date">
                  ${message.created_at}
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

    var reloadMessages = function () {
      if (window.location.href.match(/\/groups\/\d+\/messages/)){
        last_message_id = $('.message:last').data("message-id");
        $.ajax({ 
          url: "api/messages", 
          type: 'get', 
          dataType: 'json', 
          data: {last_id: last_message_id} 
        })

        .done(function (messages) { 
          console.log(messages)
          var insertHTML = '';
          messages.forEach(function (message) {
            insertHTML += buildHTML(message);
            $('.messages').append(insertHTML);
          $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
        })
        })
        .fail(function () {
          console.log('自動更新に失敗しました');
        });
      }
    };
    setInterval(reloadMessages, 7000);
  });
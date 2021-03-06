$('.error').hide();

$(document).ready(function eventhandlers(){

let templateVars={};

let counter= 2;

// Adding a new option on new_poll.ejs

$( '.btn.btn-outline-secondary.start.add-option' ).click(function() {
  event.preventDefault;
    counter = counter+1;
    console.log(counter);
  $('.option-container').append(

    `
<div class="ind_option">
    <div class="input-group">
            <input type="text" class="form-control option_val" placeholder="" aria-label="" aria-describedby="basic-addon1">
            <div class="input-group-append">
              <button class="btn btn-success" type="button"><i class="fas fa-backspace">    </i></button>
            </div>
    </div>
    <input class="form-control form-control-lg" type="text" placeholder="Description">
</div>

`
  );
  $('.option_val').focus();
  if (counter === 10){
    $('.btn.btn-outline-secondary.start.add-option').slideUp();
    }
});

//Removing an option on new_poll.ejs

$('.option-container').on('click', 'button', function(){
  $(this).closest('div .ind_option').slideUp('slow');
  $(this).closest('div .ind_option').detach();
  $(this).closest('div .ind_option').remove();
  counter-- ;
  $('.btn.btn-outline-secondary.start.add-option').slideDown();

});

// Submitting a poll on new_poll.ejs

$('.btn.btn-outline-secondary.start.subpoll').click(function(){
  if (counter < 2){
    $(".error_ms").text("You need to add some options, wiseguy!");
    $(".error").fadeIn();
    $(".error").addClass("shake");
    setTimeout(fade, 3000 );
    return

  }

  function fade(){
      $(".error").fadeOut()
  };

  let emailOutput = $('.form-control.emailNewPoll').val();
  let pollQuestion = $('.form-control.newPollTitle').val();

  if (pollQuestion === "" || pollQuestion === null) {
    $(".error_ms").text("Your poll needs a question");
    $(".error").fadeIn();
    $(".error").addClass("shake");
    $('.form-control.newPollTitle').focus();
    setTimeout(fade, 3000 );
    return
  }

  let optionOutput = [];
  let votes = [];
  let descriptionOut= [];
  let error= false;

$('.form-control.option_val').each(function(){
    if ($(this).val() ==="" || $(this).val() === null){
      $(".error_ms").text("You can't submit an empty answer!");
      $(this).focus();
      error= true;
    return
    }

  for(options in optionOutput){
    if ($(this).val()===optionOutput[options]){
      $(".error_ms").text("No duplicate answers please!");
      error = true;
    }

  }
  optionOutput.push($(this).val());


  descriptionOut.push($(this).parent().next('input').val());
});


  if (error === true){
    $(".error").fadeIn();
    $(".error").addClass("shake");
    setTimeout(fade, 3000 );
    return
  }

  if (emailOutput === "" || emailOutput === null || emailOutput.includes('@')=== false ) {
    $(".error_ms").text("Please submit a valid email address.");
    $(".error").fadeIn();
    $('.form-control.emailNewPoll').focus();
    setTimeout(fade, 3000 );
    return
  }

   $.ajax({
      method: "POST",
      url: "/new_poll",
      data: {
        email: emailOutput,
        pollValue: pollQuestion,
        options: optionOutput,
        descriptions: descriptionOut
      }
    }).then((data) => {
       window.location.href = data.url
    })


});


// Voting an option up on poll_show.ejs

$('.pollshow_indoption').on('click', '.fas.fa-arrow-circle-up', function(){
  if ($(this).closest('div .pollshow_indoption').prev().length === 0){
    return
  }
  { $(this).closest('div .pollshow_indoption').slideUp('', function(){
  $(this).closest('div .pollshow_indoption').prev().insertAfter($(this).closest('div .pollshow_indoption'))});
$(this).closest('div .pollshow_indoption').slideDown('');}
});

// Voting an option down on poll_show.ejs

$('.pollshow_indoption').on('click', '.fas.fa-arrow-circle-down', function(){
  if ($(this).closest('div .pollshow_indoption').next().length === 0){
    return
  }
  $(this).closest('div .pollshow_indoption').slideUp('', function(){
  $(this).closest('div .pollshow_indoption').next().insertBefore($(this).closest('div .pollshow_indoption'))});
  $(this).closest('div .pollshow_indoption').slideDown('');
});

//Submitting votes on poll_show.ejs

  $('#pollshow_submit').click( function (){
    let votes =[]
    $('.pollshow_option_text').each(function(){
      votes.push($(this).text() )
    });
       $.ajax({
        method: "POST",
        url: window.location.href,
        data: {
          votes: votes
        }
      }).then((data) => {
         window.location.href = data.url
      })
    return votes
  });


  $('#emaillist').click(function(){
    let emaillist =($('#emaillist22').val());
  if (emaillist === "" || emaillist === null) {
    $(".error").text("Error ! Not a valid input.");
  }else{
   $.ajax({
      method: "POST",
      url: "/poll",
      data: {
        email: emaillist,
      }
    }).then((data) => {
       window.location.href = data.pollRedirect
    })
  }

  })

});


// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require jquery3
//= require jquery_ujs
//= require activestorage
//= require turbolinks

var ready;
var elementOnTop;

ready = function() {
  showAttributeBox();
  expandCategoryList();
  showCategoryInput();
  hideAlertBoxes();
  enableSubmitButtons();
  moveTasksToOtherCategory();
  modalOperations();
  createFirstCategory();
  validatePassword();
  allowAccountRemoval();
  checkTask();
  showAsideMenu();
  setPomodoroControls();
};

pomodoroSettings = {
  sprint: 25,
  shortBreak: 5,
  longBreak: 20,
  status: 1,
  cycle: 0,
  finish: 0
}

setPomodoroControls = function() {
  if($('#pomodoro-controls').length > 0) {
    $('#pomodoro-controls input').on('input', function() {
      $(this).next('span').text($(this).val() + ' minutes');
    });

    $('#pomodoro-start').click(function() {
      pomodoroSettings.sprint = parseInt($('#pomodoro-sprint').val());
      pomodoroSettings.shortBreak = parseInt($('#pomodoro-short').val());
      pomodoroSettings.longBreak = parseInt($('#pomodoro-long').val());

      $('#pomodoro-time').text(("0" + pomodoroSettings.sprint).slice(-2) + ':00');

      $('#pomodoro-controls').fadeOut(function() {
        $('#pomodoro-timer').fadeIn();
        $('#pomodoro-finish').removeAttr('disabled');

        startPomodoroSprint();
      });
    });
  }
}

getTimeLeft = function(t) {
  var total = Date.parse(t) - Date.parse(new Date()),
    seconds = Math.floor((total/1000) % 60),
    minutes = Math.floor((total/60000) % 60);

  return {
    "total": total,
    "min": minutes,
    "sec": seconds
  };
}

startPomodoroSprint = function() {
  $('#pomodoro-icon').children('i').removeClass().addClass('fa fa-stopwatch');
  $('#pomodoro-finish').removeAttr('disabled');

  $('#pomodoro-message').html('&nbsp;');
  pomodoroSettings.finish = new Date(Date.parse(new Date()) + (pomodoroSettings.sprint * 60 * 1000));
  pomodoroSettings.status = 0;

  startPomodoroClock();
}

startPomodoroBreak = function(l) {
  $('#pomodoro-icon').children('i').removeClass().addClass('fa fa-pause-circle');
  $('#pomodoro-finish').attr('disabled', 'disabled');

  if (l == false) {
    $('#pomodoro-message').text('Take a little break now. (=');
    $('#pomodoro-cycles').append('<i class="fa fa-check"></i>');
    pomodoroSettings.finish = new Date(Date.parse(new Date()) + (pomodoroSettings.shortBreak * 60 * 1000));
  } else {
    $('#pomodoro-message').text('You\'ve been through four sprints. Take some time to rest, learn something new and get back in ' + pomodoroSettings.longBreak + ' minutes.');
    $('#pomodoro-cycles').empty().html('&nbsp;');
    pomodoroSettings.finish = new Date(Date.parse(new Date()) + (pomodoroSettings.longBreak * 60 * 1000));
  }
  pomodoroSettings.status = 1;

  startPomodoroClock();
}

startPomodoroClock = function() {
  var timeInterval = setInterval(function(){
    var t = getTimeLeft(pomodoroSettings.finish);

    if (pomodoroSettings.status == 0) {
      document.title = 'Sprint time: ' + ("0" + t.min).slice(-2) + ":" + ("0" + t.sec).slice(-2);
      $('#pomodoro-progress-bar').css('width', 100 - ((t.total / 10) / (pomodoroSettings.sprint * 60)) + '%');
    } else if (pomodoroSettings.status == 1) {
      document.title = 'Break time: ' + ("0" + t.min).slice(-2) + ":" + ("0" + t.sec).slice(-2);

      if (pomodoroSettings.cycle % 4 == 0) {
        $('#pomodoro-progress-bar').css('width', 100 - ((t.total / 10) / (pomodoroSettings.longBreak * 60)) + '%');
      } else {
        $('#pomodoro-progress-bar').css('width', 100 - ((t.total / 10) / (pomodoroSettings.shortBreak * 60)) + '%');
      }
    }

    $('#pomodoro-time').text(("0" + t.min).slice(-2) + ":" + ("0" + t.sec).slice(-2));

    if (t.total <= 0) {
      clearInterval(timeInterval);
      if (pomodoroSettings.status == 0) {
        pomodoroSettings.cycle++;

        if (pomodoroSettings.cycle % 4 == 0) {
          startPomodoroBreak(true);
          pomodoroSettings.cycle == 0;
        } else {
          startPomodoroBreak(false);
        }
      } else if (pomodoroSettings.status == 1) {
        startPomodoroSprint();
      }
    }
  }, 1000);

  $('#pomodoro-reset').click(function(event) {
    event.preventDefault();

    clearInterval(timeInterval);
    resetPomodoroClock();
  });
}

resetPomodoroClock = function() {
  document.title = 'Get things done!';

  $('#pomodoro-icon').children('i').removeClass().addClass('fa fa-stopwatch');
  $('#pomodoro-cycles').empty().html('&nbsp;');
  $('#pomodoro-time').empty().html('&nbsp;');
  $('#pomodoro-message').empty().html('&nbsp;');
  $('#pomodoro-finish').attr('disabled', 'disabled');
  $('#pomodoro-timer').fadeOut(function() {
    $('#pomodoro-controls').fadeIn();
  });

  pomodoroSettings.status = 1;
  pomodoroSettings.cycle = 0;
  pomodoroSettings.finish = 0;
}

displayAlert = function(t, msg) {
  var timestamp = 'timestamp-' + new Date().getTime(),
    timestampClass = '.' + timestamp;

  $(document).on('deleteNotification', function(event, element) {
    setTimeout(function() {
      $(element).fadeOut(function(){
        $(this).remove();
      });
    }, 3000);
  });

  switch (t) {
    case 'notice':
      $('.box-alert').append('<li class="alert-notice ' + timestamp + '">' + msg + '</li>');
      $(document).trigger('deleteNotification', [timestampClass]);
      break;
    case 'alert':
      $('.box-alert').append('<li class="alert-alert">' + msg + '</li>');
      break;
    case 'error':
      $('.box-alert').append('<li class="alert-error">' + msg + '</li>');
      break;
    default:
      $('.box-alert').append('<li class="alert-default">' + msg + '</li>');
  }

  $(document).off('deleteNotification');
}

showAsideMenu = function() {
  if ($('#open-menu-button').length > 0) {
    $('#open-menu-button').click(function() {
      $('aside').animate({ left: 0 }, 200);
      $('body').append('<div id="open-menu-backdrop"></div>');
      $('#open-menu-backdrop').fadeIn();
    });

    $(document).on('click', '#open-menu-backdrop', function() {
      $('aside').animate({ left: '-190px' }, 200);
      $(this).fadeOut().remove();
    })
  }
}

checkTask = function() {
  $('.task-check-button').click(function() {
    var url = '/check_task_complete/' + $(this).data('task-id') + '.json',
      task = $(this),
      button_class = $(this).children('i').attr('class');

    task.children('i').removeClass().addClass('fa fa-spinner fa-pulse');

    $.getJSON(url, function(data) {
      if (data != false) {
        modifyTaskStatus(task, data);
      } else {
        task.children('i').removeClass().addClass(button_class);
      }
    }).fail(function() {
      task.children('i').removeClass().addClass(button_class);
    });
  });
}

modifyTaskStatus = function(t, d) {
  var counter = $('.category-count[data-category-id="' + d['category_id'] + '"]');

  t.parent('li').toggleClass('completed');

  if (d['due_date'] != null) {
    var today = new Date(),
      today_arr = [today.getDate(), today.getMonth(), today.getFullYear()],
      due_date = new Date(d['due_date']),
      due_date_arr = [due_date.getDate(), due_date.getMonth(), due_date.getFullYear()];
  }

  if (d['completed'] == true) {
    t.children('i').removeClass().addClass('far fa-check-circle');
    t.parent('li').find('.task-description i').remove();
    counter.text(parseInt(counter.text()) - 1);
    displayAlert('notice', 'The task was checked complete');

    if (d['due_date'] != null && today > due_date) {
      if (JSON.stringify(today_arr) == JSON.stringify(due_date_arr)) {
        callTaskLists(false);
      } else {
        callTaskLists(true);
      }
    }
  } else {
    t.children('i').removeClass().addClass('far fa-circle');
    counter.text(parseInt(counter.text()) + 1);
    displayAlert('notice', 'The task was checked incomplete');

    if (d['due_date'] != null && today > due_date) {
      if (JSON.stringify(today_arr) == JSON.stringify(due_date_arr)) {
        t.parent('li').find('.task-description').append('<i class="fa fa-bell task-today"></i>');
        callTaskLists(false);
      } else {
        t.parent('li').find('.task-description').append('<i class="fa fa-exclamation-circle task-overdue"></i>');
        callTaskLists(true);
      }
    }
  }


}

callTaskLists = function(c) {
  const URL_OVERDUE = '/retrieve_overdue_tasks',
    URL_TODAY = '/retrieve_today_tasks';

  var url = '';

  if (c == true) {
    url = URL_OVERDUE;
  } else {
    url = URL_TODAY;
  }

  $.getJSON(url, function(data) {
    rebuildTaskLists(c, data);
  });
}

rebuildTaskLists = function(l, d) {
  var count = d['count'],
    items = d['tasks'],
    container = (l == true ? $('.overdue-tasks-container') : $('.today-tasks-container'));

  container.empty();

  if (count > 0) {
    container.append(l == true ? '<h1>Overdue tasks</h1>' : '<h1>Tasks for today</h1>');
    container.append(l == true ? '<ul class="overdue-tasks"></ul>' : '<ul class="today-tasks"></ul>');

    $.each(items, function(i) {
      if (l == true) {
        var today = new Date(),
          due_date = new Date(items[i]['due_date']);

        container.children('ul').append('<li><span class="days-overdue-count">' + parseInt((today - due_date) / 86400000) + '</span><a href="/tasks/' + items[i]['id'] + '">' + items[i]['task'] + '</a></li>');
      } else {
        container.children('ul').append('<li><a href="/tasks/' + items[i]['id'] + '">' + items[i]['task'] + '</a></li>');
      }
    });
  }

  if (count > 5) {
    var link = (l == true ? '/overdue' : '/today'),
      message = (l == true ? 'Check all overdue tasks' : 'Check all today tasks');

    container.children('ul').append('<li><a href="' + link + '">' + message + '</a></li>');
  }
}

allowAccountRemoval = function() {
  if ($('.edit-user-remove').length > 0) {
    $('#current_password').keyup(function() {
      if ($('#remove_confirmation').is(':checked') == true && $(this).val() != '') {
        $('#edit-user-remove').removeAttr('disabled');
      } else {
        $('#edit-user-remove').attr('disabled', 'disabled');
      }
    });

    $('#remove_confirmation').change(function() {
      if ($('#current_password').val() != '' && $(this).is(':checked') == true) {
        $('#edit-user-remove').removeAttr('disabled');
      } else {
        $('#edit-user-remove').attr('disabled', 'disabled');
      }
    });
  }
}

validatePassword = function() {
  if ($('.edit-user-password').length > 0) {
    var pswInput = $('#user_password'),
      cnfInput = $('#user_password_confirmation'),
      criteria = $('#password-criteria'),
      lowerList = $('#criteria-lower'),
      upperList = $('#criteria-upper'),
      numberList = $('#criteria-number'),
      lengthList = $('#criteria-length'),
      lower = false,
      upper = false,
      number = false,
      length = false;

    pswInput.focus(function() {
      criteria.removeClass('hide');
    });
    pswInput.blur(function() {
      criteria.addClass('hide');
    });

    pswInput.keyup(function() {
      var lowerCaseLetters = /[a-z]/g;
      if (pswInput.val().match(lowerCaseLetters)) {
        lowerList.removeClass('invalid');
        lowerList.addClass('valid');
        lower = true;
      } else {
        lowerList.addClass('invalid');
        lowerList.removeClass('valid');
        lower = false;
      }

      var upperCaseLetters = /[A-Z]/g;
      if (pswInput.val().match(upperCaseLetters)) {
        upperList.removeClass('invalid');
        upperList.addClass('valid');
        upper = true;
      } else {
        upperList.addClass('invalid');
        upperList.removeClass('valid');
        upper = false;
      }

      var numbers = /[0-9]/g;
      if (pswInput.val().match(numbers)) {
        numberList.removeClass('invalid');
        numberList.addClass('valid');
        number = true;
      } else {
        numberList.addClass('invalid');
        numberList.removeClass('valid');
        number = false;
      }

      if (pswInput.val().length > 7) {
        lengthList.removeClass('invalid');
        lengthList.addClass('valid');
        length = true;
      } else {
        lengthList.addClass('invalid');
        lengthList.removeClass('valid');
        length = false;
      }

      if (lower == true && upper == true && number == true && length == true && pswInput.val() == cnfInput.val()) {
        $('#edit-user-password-submit').removeAttr('disabled');
      } else {
        $('#edit-user-password-submit').attr('disabled', 'disabled');
      }
    });

    cnfInput.keyup(function() {
      if (lower == true && upper == true && number == true && length == true && pswInput.val() == cnfInput.val()) {
        $('#edit-user-password-submit').removeAttr('disabled');
      } else {
        $('#edit-user-password-submit').attr('disabled', 'disabled');
      }
    });
  }
}

createFirstCategory = function() {
  $('.add-first-category input').change(function() {
    if ($('.add-first-category input:checked').length > 0) {
      $('.first-category-submit').removeAttr('disabled');
    }
  })
}

modalOperations = function() {
  $('#modal-link').click(function() {
    $('#modal-backdrop').fadeIn();
  });
  $('#modal-close').click(function() {
    $('#modal-backdrop').fadeOut();
  })
}

moveTasksToOtherCategory = function() {
  if ($('.change-task-category').length > 0) {
    $('.change-task-category').hide();
  }

  $('#delete_posts_0').change(function() {
    $('#delete-category-submit').removeAttr('disabled');

    if ($(this).is('checked')) {
      $('.change-task-category').slideDown();
    } else {
      $('.change-task-category').slideUp();
    }
  });

  $('#delete_posts_1').change(function() {
    $('#delete-category-submit').removeAttr('disabled');

    if ($(this).is('checked')) {
      $('.change-task-category').slideUp();
    } else {
      $('.change-task-category').slideDown();
    }
  });
}

enableSubmitButtons = function() {
  $('.edit-user input').keyup(function() {
    $('.input-group-password').slideDown();
  });

  if ($('#current_password').length > 0) {
    $('#current_password').keyup(function() {
      if ($(this).val() == '') {
        $('#edit-user-submit').attr('disabled', 'disabled');
      } else {
        $('#edit-user-submit').removeAttr('disabled');
      }
    });
  }
}

hideAlertBoxes = function() {
  $('[class^="alert-"]').delay(3000).fadeOut(function() {
    $(this).remove();
  });
}

showCategoryInput = function() {
  $('.category-idle-box').click(function() {
    $(this).next('.category-edit-box').show();
    $('.category-input').focus();
    $(this).remove();
  });
}

showAttributeBox = function() {
  var openBox = false;

  $('.idle-box').click(function() {
    openBox = true;
    $(this).next('.edit-box').show();
    $(this).remove();
  });

  $('.task-input').keyup(function() {
    if ($(this).val() == '' && openBox == false) {
      $('.add-task-attribute-box').slideUp();
    } else {
      $('.add-task-attribute-box').slideDown();
    }
  });
}

expandCategoryList = function() {
  $('.show-categories').click(function(event) {
    event.preventDefault();

    if ($(this).hasClass('open')) {
      $('.categories-menu').slideUp();
      elementOnTop = null;
    } else {
      $('.categories-menu').slideDown();
      elementOnTop = $('.categories-menu');
    }

    $(this).toggleClass('open');
    changeCategoryButtonIcon();
  });

  $('.categories-menu button').click(function() {
    var categoryId = $(this).val();
    var categoryLabel = $(this).text();

    $('.task-category-selector').val(categoryId);
    $('.task-category-label').text(categoryLabel);
    $('.categories-menu').slideUp();
    elementOnTop = null;

    $('.show-categories').toggleClass('open');
    changeCategoryButtonIcon();
  });
}

changeCategoryButtonIcon = function() {
  $('.show-categories i').toggleClass('fa-chevron-down fa-chevron-up');
}

$(document).on('turbolinks:load', ready);
